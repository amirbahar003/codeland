using MongoDB.Driver;
using Shop.Application.DTOs.Wallets;
using Shop.Application.Exceptions;
using Shop.Application.Interfaces.Transactions;
using Shop.Application.Interfaces.Wallets.Repository;
using Shop.Application.Interfaces.Wallets.Service;
using Shop.Domain.Entities;

namespace Shop.Application.Services.Wallets
{
    public class WalletService : IWalletService
    {
        private readonly IWalletRepository _walletRepository;
        private readonly IWalletTransactionRepository _transactionRepository;
        private readonly IMongoTransactionService _transactionService;
        public WalletService(IWalletRepository walletRepository, IWalletTransactionRepository transactionRepository, IMongoTransactionService transactionService)
        {
            _walletRepository = walletRepository;
            _transactionRepository = transactionRepository;
            _transactionService = transactionService;
        }

        public async Task AddFundsAsync(string userId,long amount,string description,string referenceId)
        {
                if (string.IsNullOrWhiteSpace(userId))
                    throw new ArgumentException("User ID is required.");

                if (amount <= 0)
                    throw new ArgumentException("Amount must be greater than zero.");

                if (string.IsNullOrWhiteSpace(referenceId))
                    throw new ArgumentException("Reference ID is required.");

            // 1. Ensure wallet exists
            await GetOrCreateWalletAsync(userId);

            // 2. Execute all financial operations in one transaction
            await _transactionService.ExecuteAsync(async session =>
            {
                // 3. Check duplicate transaction
                var exists = await _transactionRepository
                    .ExistsByReferenceIdAsync(referenceId, session);

                if (exists)
                    return;

                // 4. Increase wallet balance
                var wallet = await _walletRepository
                    .AddBalanceAsync(userId, amount, session);

                if (wallet == null)
                    throw new NotFoundException("Wallet not found.");

                // 5. Create transaction record
                var transaction = new WalletTransaction
                {
                    UserId = userId,
                    WalletId = wallet.Id,
                    Amount = amount,
                    Type = "Deposit",
                    Description = description,
                    BalanceAfter = wallet.Balance,
                    ReferenceId = referenceId,
                    CreatedAt = DateTime.UtcNow
                };

                await _transactionRepository.CreateAsync(transaction,session);
            });
        }

        public async Task<WalletDto> GetOrCreateWalletAsync(string userId)
        {
            if (string.IsNullOrWhiteSpace(userId))
                throw new ArgumentException("User ID is required.");

            var wallet = await _walletRepository.GetByUserIdAsync(userId);

            if (wallet == null)
            {
                var newWallet = new Wallet
                {
                    UserId = userId,
                    Balance = 0,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                try
                {
                    await _walletRepository.CreateAsync(newWallet);
                    wallet = newWallet;
                }
                catch (MongoWriteException ex)
                    when (ex.WriteError?.Category == ServerErrorCategory.DuplicateKey)
                {
                    wallet = await _walletRepository.GetByUserIdAsync(userId);

                    if (wallet == null)
                        throw;
                }
            }

            return new WalletDto
            {
                Id = wallet.Id,
                Balance = wallet.Balance,
                CreatedAt = wallet.CreatedAt,
                UpdatedAt = wallet.UpdatedAt
            };
        }


        public async Task<List<WalletTransactionDto>> GetTransactionsAsync(string userId)
        {
            if (string.IsNullOrWhiteSpace(userId))
                throw new ArgumentException("User ID is required.");

            var transactions = await _transactionRepository
                .GetAllByUserIdAsync(userId);

            return transactions.Select(transaction => new WalletTransactionDto
            {
                Id = transaction.Id,
                Amount = transaction.Amount,
                Type = transaction.Type,
                Description = transaction.Description,
                BalanceAfter = transaction.BalanceAfter,
                CreatedAt = transaction.CreatedAt,
                ReferenceId = transaction.ReferenceId,
                IsSeen=transaction.IsSeen,
            }).ToList();
        }
    }
}
