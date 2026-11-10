using MongoDB.Bson;
using MongoDB.Driver;
using Shop.Application.Exceptions;
using Shop.Domain.Entities;
using Shop.Infrastructure.Data;


namespace Shop.Infrastructure.Repositories
{
    public class LessonProgressRepository : ILessonProgressRepository
    {
        private readonly IMongoCollection<LessonProgress> _progresses;
        public LessonProgressRepository(MongoDbContext context)
        {
            _progresses = context.GetCollection<LessonProgress>("lessonProgresses");
        }


        public async Task<int> CountCompletedAsync(
            string userId,
            IEnumerable<string> lessonIds)
        {
            if (!ObjectId.TryParse(userId, out _))
                throw new InvalidObjectIdException(
                    "Invalid UserId."
                );

            var ids = lessonIds.ToList();

            if (ids.Count == 0)
                return 0;

            var count = await _progresses
                .CountDocumentsAsync(
                    p =>
                        p.UserId == userId &&
                        p.IsCompleted &&
                        ids.Contains(p.LessonId)
                );

            return (int)count;
        }




        public async Task<LessonProgress> CreateAsync(LessonProgress progress)
        {
            await _progresses.InsertOneAsync(progress);
            return progress;
        }

        public async Task<LessonProgress?> GetByUserAndLessonAsync(string userId, string lessonId)
        {
            if (!ObjectId.TryParse(userId, out _))
                throw new InvalidObjectIdException("Invalid UserId.");
            if (!ObjectId.TryParse(lessonId, out _))
                throw new InvalidObjectIdException("Invalid LessonId.");
            return await _progresses.Find(p => p.UserId == userId && p.LessonId == lessonId).FirstOrDefaultAsync();
        }

        public async Task<LessonProgress?> GetLatestCompletedAsync(string userId, IEnumerable<string> lessonIds)
        {
            if (!ObjectId.TryParse(userId, out _)) 
                throw new InvalidObjectIdException("Invalid UserId.");
            var ids = lessonIds.ToList();
            if (ids.Count == 0) 
                return null;
            return await _progresses.Find(p => p.UserId == userId && p.IsCompleted && ids.Contains(p.LessonId)).SortByDescending(p => p.CompletedAt).FirstOrDefaultAsync();
        }

        public async Task<LessonProgress?> UpdateAsync(string Id, LessonProgress progress)
        {
            if (!ObjectId.TryParse(Id, out _))
                throw new InvalidObjectIdException("Invalid ProgressId.");
            return await _progresses.FindOneAndReplaceAsync(p => p.Id == Id, progress, new FindOneAndReplaceOptions<LessonProgress> { ReturnDocument = ReturnDocument.After });
        }
    }
}
                                        