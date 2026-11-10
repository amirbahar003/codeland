using MongoDB.Driver;
using Shop.Application.Interfaces.Chapters.Repositories;
using Shop.Domain.Entities;
using Shop.Infrastructure.Data;
using Shop.Infrastructure.Helpers;
namespace Shop.Infrastructure.Repositories
{
    public class ChapterRepository : IChapterRepository
    {
        private readonly IMongoCollection<Chapter> _chapters;
        private readonly IMongoCollection<Course> _courses;

        public ChapterRepository(MongoDbContext context)
        {
            _chapters = context.GetCollection<Chapter>("chapters");
            _courses = context.GetCollection<Course>("courses");
        }
        public async Task<bool> CourseExistsAsync(string courseId)
        {
            ObjectIdValidator.Validate(courseId);
            return await _courses
      .Find(c => c.Id == courseId)
      .AnyAsync();
        }

        public async Task<Chapter> CreateAsync(Chapter chapter)
        {
            await _chapters.InsertOneAsync(chapter);
            return chapter;
        }

        public async Task<bool> DeleteAsync(string Id)
        {
            ObjectIdValidator.Validate(Id);

            var result = await _chapters.DeleteOneAsync(c => c.Id == Id);
            return result.DeletedCount > 0;
        }

        public async Task<List<Chapter>> GetAllByCourseIdAsync(string courseId)
        {
            return await _chapters.Find(c => c.CourseId == courseId).SortBy(c => c.Order).ToListAsync();
        }
        public async Task<Chapter?> GetByIdAsync(string Id)
        {
            ObjectIdValidator.Validate(Id); 
            return await _chapters. Find(c => c.Id == Id).FirstOrDefaultAsync();

        }

        public async Task<Chapter?> UpdateAsync(string Id, Chapter chapter)
        {
            ObjectIdValidator.Validate(Id);
            chapter.Id = Id;
            var result = await _chapters.ReplaceOneAsync(c => c.Id == Id, chapter);
            if (result.MatchedCount == 0)
                return null;
            return chapter;
        }
    }
}
