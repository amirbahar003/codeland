using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shop.Application.DTOs.ReferralRewards;

namespace Shop.Application.Interfaces.Referral.Services
{
    public interface IReferralService
    {
        Task<ReferralStatsDto> GetStatsAsync(string userId);
        Task<List<ReferralRewardDto>> GetRewardsAsync(string userId);
    }
}
