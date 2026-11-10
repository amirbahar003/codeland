using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shop.Application.DTOs.ReferralRewards
{
    public class ReferralRewardDto
    {
        public int Milestone { get; set; }

        public long Amount { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
