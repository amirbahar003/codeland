using Shop.Application.DTOs.Categories;
using Shop.Application.DTOs.Instructors;

namespace Shop.Application.DTOs.Courses
{
    public class CourseDto
    {
        public string? Id { get; set; }
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public decimal Price { get; set; }
        public string? ThumbnailId { get; set; }
        public string? CategoryId { get; set; }
        public string? Slug { get; set; }
        public string? InstructorId { get; set; }
        public InstructorSummaryDto? Instructor { get; set; }
        public string Level { get; set; } = null!;
        public int DurationMinutes { get; set; }
        public List<string> PrerequisiteCourseIds { get; set; } = new();
        public List<CoursePrerequisiteDto> Prerequisites { get; set; } = new();
        public DateTime CreatedAt { get; set; }
        public CategorySummaryDto? Category { get; set; }
    }
}
