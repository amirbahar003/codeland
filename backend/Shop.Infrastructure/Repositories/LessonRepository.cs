using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using MongoDB.Driver;
using Shop.Application.Interfaces.Lessons.Repositories;
using Shop.Domain.Entities;
using Shop.Infrastructure.Data;
using Shop.Infrastructure.Helpers;

namespace Shop.Infrastructure.Repositories
{
    public class LessonRepository : ILessonRepository
    {
        private readonly IMongoCollection<Lesson> _lessons;
        private readonly IMongoCollection<Chapter> _chapters;
        public LessonRepository(MongoDbContext context)
        {
            _lessons = context.GetCollection<Lesson>("lessons");
            _chapters = context.GetCollection<Chapter>("chapters");
        }
        public async Task<bool> ChapterExistsAsync(string chapterId)
        {
            ObjectIdValidator.Validate(chapterId);
            return await _chapters.Find(c => c.Id == chapterId).AnyAsync();
        }

        public async Task<Lesson> CreateAsync(Lesson lesson)
        {
            await _lessons.InsertOneAsync(lesson);
            return lesson;
        }

        public async Task<bool> DeleteAsync(string Id)
        {
            ObjectIdValidator.Validate(Id);
            var result = await _lessons.DeleteOneAsync(l => l.Id == Id);
            return result.DeletedCount > 0;
        }

        public async Task<List<Lesson>> GetAllByChapterIdAsync(string chapterId)
        {
            ObjectIdValidator.Validate(chapterId);
            return await _lessons.Find(l => l.ChapterId == chapterId).SortBy(l => l.Order).ToListAsync();
        }

        public async Task<List<Lesson>> GetAllByCourseIdAsync(string courseId)
        {
            ObjectIdValidator.Validate(courseId);

            var chapters = await _chapters.Find(c => c.CourseId == courseId).ToListAsync();
            var chapterIds = chapters.Select(c => c.Id).ToList();
            if (chapterIds.Count == 0)
                return new List<Lesson>();

            return await _lessons.Find(l => chapterIds.Contains(l.ChapterId)).SortBy(l => l.Order).ToListAsync();
        }

        public async Task<Lesson?> GetByIdAsync(string Id)
        {
            ObjectIdValidator.Validate(Id);
            return await _lessons.Find(l => l.Id == Id).FirstOrDefaultAsync();
        }

        public async Task<Lesson?> UpdateAsync(string Id, Lesson lesson)
        {
            ObjectIdValidator.Validate(Id);
            lesson.Id = Id;
            var result = await _lessons.ReplaceOneAsync(l => l.Id == Id, lesson);
            if (result.MatchedCount == 0)
                return null;
            return lesson;
        }

        public async Task<Lesson?> UpdateVideoAsync(string lessonId, string videoId)
        {
            ObjectIdValidator.Validate(lessonId);
            var update = Builders<Lesson>.Update.Set(l => l.VideoId, videoId);
            return await _lessons.FindOneAndUpdateAsync(l => l.Id == lessonId, update,
                new FindOneAndUpdateOptions<Lesson>
                {
                    ReturnDocument = ReturnDocument.After
                });
        }
    }
}
