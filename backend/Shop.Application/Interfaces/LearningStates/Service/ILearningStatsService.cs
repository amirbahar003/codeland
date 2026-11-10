using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shop.Application.DTOs.LearningStates;
using Shop.Domain.Entities;

namespace Shop.Application.Interfaces.LearningStates.Service
{
    public interface ILearningStatsService
    {
        Task<LearningStatsDto> GetOrCreateAsync(string userId);

        Task<LearningStatsDto> UpdateWeeklyGoalAsync(string userId,int goalMinutes);
    }
}
