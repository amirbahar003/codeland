using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shop.Domain.Entities;

namespace Shop.Application.Interfaces.Courses.Repositories
{
    public interface ICourseRepository
    {
        Task<(List<Course> Items, long TotalItems)> GetAllAsync(int page, int pageSize, string? search, string? categoryId, decimal? minPrice, decimal? maxPrice, string? sortBy, string? sortOrder);
        Task<bool> CoursesExistAsync(List<string> courseIds);
        Task<Course?> GetByIdAsync(string Id);
        Task<List<Course>> GetByIdsAsync(List<string> courseIds);
        Task<Course?> GetBySlugAsync(string slug);
        Task<List<Course>> GetPrerequisiteCoursesAsync(List<string> courseIds);
        Task<Course> CreateAsync(Course course);
        Task<Course?> UpdateAsync(string Id, Course course);
        Task<bool> DeleteAsync(string Id);
        Task<bool> CategoryExistsAsync(string categoryId);
    }
}
