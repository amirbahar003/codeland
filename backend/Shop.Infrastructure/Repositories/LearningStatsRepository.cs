using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MongoDB.Driver;
using Shop.Application.Interfaces.LearningStates.Repository;
using Shop.Domain.Entities;
using Shop.Infrastructure.Data;

namespace Shop.Infrastructure.Repositories
{
    public class LearningStatsRepository : ILearningStatsRepository
    {

        private readonly IMongoCollection<LearningStats> _learningStats;

        public LearningStatsRepository(MongoDbContext context)
        {
            _learningStats = context.GetCollection<LearningStats>("learningStats");
        }
        public async Task<LearningStats> CreateAsync(LearningStats stats)
        {
            await _learningStats.InsertOneAsync(stats);

            return stats;
        }

        public async Task<LearningStats?> GetByUserIdAsync(string userId)
        {
            return await _learningStats.Find(x => x.UserId == userId).FirstOrDefaultAsync();
        }

        public async Task UpdateAsync(LearningStats stats)
        {
            await _learningStats.ReplaceOneAsync(x => x.Id == stats.Id, stats);
        }
    }
}
