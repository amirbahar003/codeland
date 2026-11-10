using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shop.Application.Interfaces.LearningStates.Repository
{
    public interface ILearningStatsRepository
    {
        Task<Shop.Domain.Entities.LearningStats?> GetByUserIdAsync(string userId);

        Task<Shop.Domain.Entities.LearningStats> CreateAsync(Shop.Domain.Entities.LearningStats stats);

        Task UpdateAsync(Shop.Domain.Entities.LearningStats stats);
    }
}
