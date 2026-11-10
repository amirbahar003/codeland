using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shop.Application.DTOs.Common;
using Shop.Application.DTOs.Courses;

namespace Shop.Application.Interfaces.Courses.Services
{
    public interface ICourseService
    {
        Task<PagedResultDto<CourseDto>> GetAllAsync(
    int page,
    int pageSize,
    string? search,
    string? categoryId,
    decimal? minPrice,
    decimal? maxPrice,
    string? sortBy,
    string? sortOrder);

        Task<CourseDto> AssignInstructorAsync(string courseId, string instructorId);

        Task<CourseDto> CreateAsync(string userId,CreateCourseDto courseDto);

        Task<CourseDto> UpdateAsync(string Id, UpdateCourseDto courseDto);
        Task<CourseDto?> GetBySlugAsync(string slug);
        Task<CourseDto?> GetByIdAsync(string Id);

        Task DeleteAsync(string Id);
    }
}
