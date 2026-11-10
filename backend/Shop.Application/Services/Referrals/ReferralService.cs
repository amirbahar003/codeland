using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shop.Application.DTOs.ReferralRewards;
using Shop.Application.Exceptions;
using Shop.Application.Interfaces.Referral.Services;
using Shop.Application.Interfaces.Users.Repositories;
using Shop.Application.Interfaces.Wallets.Repository;

namespace Shop.Application.Services.Referrals
{
    public class ReferralService : IReferralService
    {

        private readonly IUserRepository _userRepository;
        private readonly IWalletTransactionRepository _walletTransactionRepository;

        public ReferralService(IUserRepository userRepository, IWalletTransactionRepository walletTransactionRepository)
        {
            _userRepository = userRepository;
            _walletTransactionRepository = walletTransactionRepository;
        }

        public async Task<List<ReferralRewardDto>> GetRewardsAsync(string userId)
        {
            var transactions = await _walletTransactionRepository
                .GetReferralRewardsAsync(userId);

            var rewards = transactions.Select(transaction =>
            {
                var lastDashIndex = transaction.ReferenceId.LastIndexOf('-');

                var milestoneText = transaction.ReferenceId
                    [(lastDashIndex + 1)..];

                int.TryParse(milestoneText, out var milestone);

                return new ReferralRewardDto
                {
                    Milestone = milestone,
                    Amount = transaction.Amount,
                    CreatedAt = transaction.CreatedAt
                };
            }).ToList();

            return rewards;
        }

        public async Task<ReferralStatsDto> GetStatsAsync(string userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);

            if (user == null)
                throw new NotFoundException("User not found.");

            var totalRewards = user.SuccessfulReferrals / 10;

            return new ReferralStatsDto
            {
                ReferralCode = user.ReferralCode!,
                SuccessfulReferrals = user.SuccessfulReferrals,
                TotalRewards = totalRewards,
                TotalRewardAmount = totalRewards * 100000
            };
        }
    }
}
