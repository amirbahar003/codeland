using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shop.Application.DTOs.ReferralRewards
{
    public class ReferralStatsDto
    {
        public string ReferralCode { get; set; } = null!;

        public int SuccessfulReferrals { get; set; }

        public int TotalRewards { get; set; }

        public long TotalRewardAmount { get; set; }
    }
}
