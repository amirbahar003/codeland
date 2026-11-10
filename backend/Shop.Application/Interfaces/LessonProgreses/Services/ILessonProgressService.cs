using Shop.Application.DTOs.LessonProgreeses;
using Shop.Application.DTOs.LessonProgresses;
using Shop.Application.DTOs.Lessons;


namespace Shop.Application.Interfaces.LessonProgreses.Services
{
    public interface ILessonProgressService
    {
        Task CompleteLessonAsync(string userId, string lessonId);
        Task<LessonProgressDto?> GetByLessonAsync(string userId, string lessonId);
        Task<CourseProgressDto> GetCourseProgressAsync(string userId, string courseId);
        Task<LessonDto?> GetLatestCompletedLessonAsync(string userId, string courseId);
        Task<List<MyCourseProgressDto>> GetMyCoursesProgressAsync(string userId);
    }
}
