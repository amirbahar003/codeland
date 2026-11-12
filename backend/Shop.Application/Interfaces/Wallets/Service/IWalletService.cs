using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shop.Application.DTOs.Wallets;

namespace Shop.Application.Interfaces.Wallets.Service
{
    public interface IWalletService
    {
        Task<WalletDto> GetOrCreateWalletAsync(string userId);
        Task<List<WalletTransactionDto>> GetTransactionsAsync(string userId);
        Task AddFundsAsync(string userId,long amount,string description,string referenceId);
        Task<long> GetUnseenCountAsync(string userId);
        Task MarkTransactionsAsSeenAsync(string userId);
    }
}
