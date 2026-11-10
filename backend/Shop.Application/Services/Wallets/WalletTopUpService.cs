using System;
using Shop.Application.DTOs.Wallets;
using Shop.Application.Exceptions;
using Shop.Application.Interfaces.Payments.GateWay;
using Shop.Application.Interfaces.Transactions;
using Shop.Application.Interfaces.Wallets.Repository;
using Shop.Application.Interfaces.Wallets.Service;
using Shop.Application.Mappers;
using Shop.Domain.Entities;
using Shop.Domain.Enums;

namespace Shop.Application.Services.Wallets
{
    public class WalletTopUpService : IWalletTopUpService
    {
        private readonly IWalletRepository _walletRepository;
        private readonly IWalletTopUpRepository _topUpRepository;
        private readonly IPaymentGateWay _paymentGateway;
        private readonly IWalletTransactionRepository _transactionRepository;
        private readonly IMongoTransactionService _mongoTransactionService;

        public WalletTopUpService(
            IWalletRepository walletRepository,
            IWalletTopUpRepository topUpRepository,
            IPaymentGateWay paymentGateway,
            IWalletTransactionRepository transactionRepository
,
            IMongoTransactionService mongoTransactionService)
        {
            _walletRepository = walletRepository;
            _topUpRepository = topUpRepository;
            _paymentGateway = paymentGateway;
            _transactionRepository = transactionRepository;
            _mongoTransactionService = mongoTransactionService;
        }

        public async Task<WalletTopUpDto> CreateAsync(
            string userId,
            CreateWalletTopUpDto dto)
        {
            if (string.IsNullOrWhiteSpace(userId))
                throw new ArgumentException("User ID is required.");

            if (dto.Amount <= 0)
                throw new ArgumentException("Amount must be greater than zero.");

            var wallet = await _walletRepository.GetByUserIdAsync(userId);

            if (wallet == null)
                throw new NotFoundException("Wallet was not found.");

            var topUp = new WalletTopUp
            {
                UserId = userId,
                WalletId = wallet.Id,
                Amount = dto.Amount,
                Status = WalletTopUpStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };

            // 1. ذخیره درخواست شارژ
            await _topUpRepository.CreateAsync(topUp);

            // 2. ایجاد پرداخت در درگاه
            var gatewayResult = await _paymentGateway.CreatePaymentAsync(
                topUp.Amount,
                topUp.Id,
                "Wallet top-up");

            // 3. ذخیره Authority
            topUp.Authority = gatewayResult.Authority;
            await _topUpRepository.UpdateAsync(topUp);

            // 4. برگرداندن نتیجه به فرانت‌اند
            var result = WalletTopUpMapper.MapToDto(topUp);
            result.PaymentUrl = gatewayResult.PaymentUrl;

            return result;
        }

        public async Task<List<WalletTopUpDto>> GetMyTopUpsAsync(string userId)
        {
            if (string.IsNullOrWhiteSpace(userId))
                throw new ArgumentException("User ID is required.");

            var topUps = await _topUpRepository.GetAllByUserIdAsync(userId);

            return topUps
                .Select(WalletTopUpMapper.MapToDto)
                .ToList();
        }


        public async Task<WalletTopUpDto> VerifyAsync(string authority)
        {
            if (string.IsNullOrWhiteSpace(authority))
                throw new ArgumentException("Payment authority is required.");

            var topUp = await _topUpRepository.GetByAuthorityAsync(authority);

            if (topUp == null)
                throw new NotFoundException(
                    "Wallet top-up request does not exist.");

            // اگر قبلاً پرداخت شده، دوباره اعمال نشود.
            if (topUp.Status == WalletTopUpStatus.Paid)
                return WalletTopUpMapper.MapToDto(topUp);

            // فقط یک درخواست Pending اجازه شروع پردازش دارد.
            var canProcess = await _topUpRepository
                .TryStartProcessingAsync(topUp.Id);

            if (!canProcess)
            {
                var currentTopUp = await _topUpRepository
                    .GetByAuthorityAsync(authority);

                if (currentTopUp == null)
                    throw new NotFoundException(
                        "Wallet top-up request does not exist.");

                return WalletTopUpMapper.MapToDto(currentTopUp);
            }

            // تأیید پرداخت در درگاه؛ فقط یک بار
            var referenceId = await _paymentGateway.VerifyPaymentAsync(
                topUp.Authority!,
                topUp.Amount);

            if (referenceId == null)
            {
                topUp.Status = WalletTopUpStatus.Failed;
                await _topUpRepository.UpdateAsync(topUp);

                return WalletTopUpMapper.MapToDto(topUp);
            }

            // ثبت تمام تغییرات دیتابیس در یک تراکنش
            await _mongoTransactionService.ExecuteAsync(async session =>
            {
                var wallet = await _walletRepository
                    .GetByIdAsync(topUp.WalletId);

                if (wallet == null)
                    throw new NotFoundException("Wallet does not exist.");

                wallet.Balance += topUp.Amount;
                wallet.UpdatedAt = DateTime.UtcNow;

                await _walletRepository.UpdateAsync(wallet, session);

                await _transactionRepository.CreateAsync(
                    new WalletTransaction
                    {
                        UserId = topUp.UserId,
                        WalletId = wallet.Id,
                        Amount = topUp.Amount,
                        Type = "Deposit",
                        Description = "Wallet top-up",
                        BalanceAfter = wallet.Balance,
                        CreatedAt = DateTime.UtcNow
                    },
                    session);

                topUp.Status = WalletTopUpStatus.Paid;
                topUp.ReferenceId = referenceId;
                topUp.PaidAt = DateTime.UtcNow;

                await _topUpRepository.UpdateAsync(topUp, session);
            });

            return WalletTopUpMapper.MapToDto(topUp);
        }

    }
}
