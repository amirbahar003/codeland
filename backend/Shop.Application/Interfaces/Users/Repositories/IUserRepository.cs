using Shop.Domain.Entities;
using Shop.Domain.Enums;

namespace Shop.Application.Interfaces.Users.Repositories
{
    public interface IUserRepository
    {
        Task<List<User>> GetAllAsync();
        Task<User?> GetByEmailAsync(string email);
        Task<User?> GetByMobileAsync(string mobile);
        Task<User?> GetByUsernameAsync(string username);
        Task<bool> ExistsByEmailAsync(string email);
        Task<User> CreateAsync(User user);
        Task<User?> GetByIdAsync(string Id);
        Task<User?> UpdateRoleAsync(string Id, UserRole role);
        Task<User?> UpdateStatusAsync(string Id, bool IsActive);
        Task<User?> GetByReferralCodeAsync(string referralCode);
        Task<bool> ExistsByReferralCodeAsync(string referralCode);
        Task<long> CountReferralsAsync(string userId);
        Task<User?> IncrementSuccessfulReferralsAsync(string userId);
    }
}
