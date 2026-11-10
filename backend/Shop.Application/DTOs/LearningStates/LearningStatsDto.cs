using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shop.Application.DTOs.LearningStates
{
    public class LearningStatsDto
    {
        public int WeeklyGoalMinutes { get; set; }

        public int CompletedMinutesThisWeek { get; set; }

        public double WeeklyProgressPercentage { get; set; }

        public int CurrentStreak { get; set; }

        public int BestStreak { get; set; }

        public List<LearningActivityDto> Activities { get; set; } = new();
    }
}
