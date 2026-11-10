using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shop.Domain.Entities;

namespace Shop.Application.Interfaces.Lessons.Repositories
{
    public interface ILessonRepository
    {
        Task<Lesson> CreateAsync(Lesson lesson);

        Task<List<Lesson>> GetAllByChapterIdAsync(string chapterId);

        Task<Lesson?> GetByIdAsync(string Id );

        Task<Lesson?> UpdateAsync(string Id, Lesson lesson);

        Task<Lesson?> UpdateVideoAsync(string lessonId, string videoId);
        
Task<bool> DeleteAsync(string Id);

        Task<bool> ChapterExistsAsync(string chapterId);

        Task<List<Lesson>> GetAllByCourseIdAsync(string courseId);
    }
}
