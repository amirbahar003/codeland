using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shop.Domain.Entities;

namespace Shop.Infrastructure.Repositories
{
    public interface ILessonProgressRepository
    {
        Task<LessonProgress?> GetByUserAndLessonAsync(string userId, string lessonId); 
        Task<LessonProgress> CreateAsync(LessonProgress progress);
        Task<LessonProgress?> UpdateAsync(string Id, LessonProgress progress);
        Task<int> CountCompletedAsync(string userId, IEnumerable<string> lessonIds);
        Task<LessonProgress?> GetLatestCompletedAsync(string userId, IEnumerable<string> lessonIds);
    }
}
