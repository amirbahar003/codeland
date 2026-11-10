
using Shop.Application.DTOs.Wallets;
using Shop.Domain.Entities;

namespace Shop.Application.Mappers
{
    public static class WalletTopUpMapper
    {
        public static WalletTopUpDto MapToDto(WalletTopUp topUp)
        {
            return new WalletTopUpDto
            {
                Id = topUp.Id,
                Amount = topUp.Amount,
                Status = topUp.Status,
                CreatedAt = topUp.CreatedAt,
                PaidAt = topUp.PaidAt
            };
        }
    }
}
