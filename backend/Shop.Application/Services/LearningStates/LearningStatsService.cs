
using Shop.Application.DTOs.LearningStates;
using Shop.Application.Interfaces.LearningStates.Repository;
using Shop.Application.Interfaces.LearningStates.Service;
using Shop.Application.Mappers;
using Shop.Domain.Entities;

namespace Shop.Application.Services.LearningStates
{
    public class LearningStatsService : ILearningStatsService
    {
        private readonly ILearningStatsRepository _repository;

        public LearningStatsService(ILearningStatsRepository repository)
        {
            _repository = repository;
        }

        public async Task<LearningStatsDto> GetOrCreateAsync(string userId)
        {
            var stats = await _repository.GetByUserIdAsync(userId);

            if (stats == null)
            {
                stats = new LearningStats
                {
                    UserId = userId,
                    WeeklyGoalMinutes = 180,
                    Activities = new List<LearningActivity>(),
                    CreatedAtUtc = DateTime.UtcNow,
                    UpdatedAtUtc = DateTime.UtcNow
                };

                stats = await _repository.CreateAsync(stats);
            }

            return LearningStatsMapper.ToDto(stats);
        }

        public async Task<LearningStatsDto> UpdateWeeklyGoalAsync(
            string userId,
            int goalMinutes)
        {
            if (goalMinutes < 60 || goalMinutes > 420)
            {
                throw new ArgumentOutOfRangeException(
                    nameof(goalMinutes),
                    "هدف هفتگی باید بین ۶۰ تا ۴۲۰ دقیقه باشد.");
            }

            var stats = await _repository.GetByUserIdAsync(userId);

            if (stats == null)
            {
                stats = new LearningStats
                {
                    UserId = userId,
                    WeeklyGoalMinutes = goalMinutes,
                    Activities = new List<LearningActivity>(),
                    CreatedAtUtc = DateTime.UtcNow,
                    UpdatedAtUtc = DateTime.UtcNow
                };

                stats = await _repository.CreateAsync(stats);
            }
            else
            {
                stats.WeeklyGoalMinutes = goalMinutes;
                stats.UpdatedAtUtc = DateTime.UtcNow;

                await _repository.UpdateAsync(stats);
            }

            return LearningStatsMapper.ToDto(stats);
        }

       
    }
}
