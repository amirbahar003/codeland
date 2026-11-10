
using MongoDB.Driver;
using Shop.Domain.Entities;

namespace Shop.Application.Interfaces.Wallets.Repository
{
    public interface IWalletTransactionRepository
    {
        Task CreateAsync(WalletTransaction transaction, IClientSessionHandle? session = null);
        Task<List<WalletTransaction>> GetAllByUserIdAsync(string userId);
        Task<bool> ExistsByReferenceIdAsync(string referenceId,IClientSessionHandle? session = null);
        Task<List<WalletTransaction>> GetReferralRewardsAsync(string userId);
    }
}
