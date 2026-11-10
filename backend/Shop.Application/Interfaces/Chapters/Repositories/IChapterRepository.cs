using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shop.Domain.Entities;

namespace Shop.Application.Interfaces.Chapters.Repositories
{
    public interface IChapterRepository
    {
        Task<Chapter> CreateAsync(Chapter chapter);
        Task<List<Chapter>> GetAllByCourseIdAsync(string courseId);
        Task<Chapter?> GetByIdAsync(string Id);
        Task<Chapter?> UpdateAsync(string Id, Chapter chapter);
        Task<bool> DeleteAsync(string Id);
        Task<bool> CourseExistsAsync(string courseId);
    }
}
