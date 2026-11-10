using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MongoDB.Driver;
using Shop.Domain.Entities;

namespace Shop.Application.Interfaces.Wallets.Repository
{
    public interface IWalletRepository
    {
        Task<Wallet?> GetByUserIdAsync(string userId);
        Task<Wallet?> GetByIdAsync(string walletId);
        Task CreateAsync(Wallet wallet);
        Task UpdateAsync(Wallet wallet,IClientSessionHandle? session = null);
        Task<Wallet?> AddBalanceAsync(string userId,long amount,IClientSessionHandle? session = null);

    }
}
