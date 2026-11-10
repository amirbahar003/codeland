using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MongoDB.Driver;
using Shop.Domain.Entities;

namespace Shop.Application.Interfaces.Wallets.Repository
{
    public interface IWalletTopUpRepository
    {
        Task CreateAsync(WalletTopUp topUp);
        Task<WalletTopUp?> GetByIdAsync(string topUpId);
        Task<bool> TryStartProcessingAsync(string topUpId);
        Task<List<WalletTopUp>> GetAllByUserIdAsync(string userId);
        Task UpdateAsync(WalletTopUp topUp, IClientSessionHandle? session = null);
        Task<WalletTopUp?> GetByAuthorityAsync(string authority);
    }
}
