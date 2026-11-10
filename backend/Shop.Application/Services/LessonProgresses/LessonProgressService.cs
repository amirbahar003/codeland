using Shop.Application.DTOs.LessonProgreeses;
using Shop.Application.DTOs.LessonProgresses;
using Shop.Application.DTOs.Lessons;
using Shop.Application.Exceptions;
using Shop.Application.Interfaces.Chapters.Repositories;
using Shop.Application.Interfaces.Courses.Repositories;
using Shop.Application.Interfaces.Enrollments.Repositories;
using Shop.Application.Interfaces.Enrollments.Services;
using Shop.Application.Interfaces.LearningStates.Repository;
using Shop.Application.Interfaces.LessonProgreses.Services;
using Shop.Application.Interfaces.Lessons.Repositories;
using Shop.Application.Mappers;
using Shop.Domain.Entities;
using Shop.Infrastructure.Repositories;

namespace Shop.Application.Services.LessonProgresses
{

    public class LessonProgressService : ILessonProgressService
    {
        private readonly ILessonProgressRepository _progressRepository;
        private readonly ILessonRepository _lessonRepository;
        private readonly IChapterRepository _chapterRepository;
        private readonly IEnrollmentService _enrollmentService;
        private readonly ICourseRepository _courseRepository;
        private readonly IEnrollmentRepository _enrollmentRepository;
        private readonly ILearningStatsRepository _learningStatsRepository;
        public LessonProgressService(ILessonProgressRepository progressRepository, ILessonRepository lessonRepository, IChapterRepository chapterRepository, IEnrollmentService enrollmentService, ICourseRepository courseRepository, IEnrollmentRepository enrollmentRepository, ILearningStatsRepository learningStatsRepository)
        {
            _progressRepository = progressRepository;
            _lessonRepository = lessonRepository;
            _chapterRepository = chapterRepository;
            _enrollmentService = enrollmentService;
            _courseRepository = courseRepository;
            _enrollmentRepository = enrollmentRepository;
            _learningStatsRepository = learningStatsRepository;
        }


        public async Task CompleteLessonAsync(string userId, string lessonId)
        {
            var lesson = await _lessonRepository.GetByIdAsync(lessonId);

            if (lesson == null)
                throw new NotFoundException("Lesson does not exist.");

            var chapter = await _chapterRepository.GetByIdAsync(lesson.ChapterId);

            if (chapter == null)
                throw new NotFoundException("Chapter does not exist.");

            if (!lesson.IsFree)
            {
                var hasAccess = await _enrollmentService.HasAccessAsync(
                    userId,
                    chapter.CourseId
                );

                if (!hasAccess)
                    throw new ForbiddenException(
                        "You do not have access to this lesson."
                    );
            }

            var existingProgress = await _progressRepository
                .GetByUserAndLessonAsync(userId, lessonId);

            // زمان تکمیل درس
            var completionTime = DateTime.UtcNow;

            if (existingProgress == null)
            {
                var progress = new Domain.Entities.LessonProgress
                {
                    UserId = userId,
                    LessonId = lessonId,
                    IsCompleted = true,
                    CompletedAt = completionTime,
                    UpdatedAt = completionTime
                };

                await _progressRepository.CreateAsync(progress);
            }
            else
            {
                // اگر درس قبلاً تکمیل شده، فعالیت جدید ثبت نکن
                if (existingProgress.IsCompleted)
                    return;

                existingProgress.IsCompleted = true;
                existingProgress.CompletedAt = completionTime;
                existingProgress.UpdatedAt = completionTime;

                await _progressRepository.UpdateAsync(
                    existingProgress.Id,
                    existingProgress
                );
            }

            // دریافت آمار یادگیری کاربر
            var stats = await _learningStatsRepository.GetByUserIdAsync(userId);

            if (stats == null)
            {
                // اگر آمار وجود ندارد، آن را ایجاد کن
                stats = new LearningStats
                {
                    UserId = userId,
                    Activities = new List<LearningActivity>
            {
                new LearningActivity
                {
                    LessonId = lessonId,
                    DurationMinutes = lesson.DurationMinutes,
                    CompletedAtUtc = completionTime
                }
            },
                    CreatedAtUtc = completionTime,
                    UpdatedAtUtc = completionTime
                };

                await _learningStatsRepository.CreateAsync(stats);
            }
            else
            {
                // جلوگیری از ثبت دوباره فعالیت یک درس
                var alreadyRecorded = stats.Activities.Any(
                    activity => activity.LessonId == lessonId
                );

                if (!alreadyRecorded)
                {
                    stats.Activities.Add(new LearningActivity
                    {
                        LessonId = lessonId,
                        DurationMinutes = lesson.DurationMinutes,
                        CompletedAtUtc = completionTime
                    });

                    stats.UpdatedAtUtc = completionTime;
                    await _learningStatsRepository.UpdateAsync(stats);
                }
            }
        }


        public async Task<LessonProgressDto?> GetByLessonAsync(string userId, string lessonId)
        {
            var progress = await _progressRepository.GetByUserAndLessonAsync(userId, lessonId);

            if (progress == null)
                return null;
            return new LessonProgressDto
            {
                Id = progress.Id,
                UserId = progress.UserId,
                LessonId = progress.LessonId,
                IsCompleted = progress.IsCompleted,
                CompletedAt = progress.CompletedAt,
                UpdatedAt = progress.UpdatedAt,
            };

        }

        public async Task<CourseProgressDto> GetCourseProgressAsync(string userId, string courseId)
        {
            var lessons = await _lessonRepository
            .GetAllByCourseIdAsync(courseId);

            var totalLessons = lessons.Count;

            if (totalLessons == 0)
            {
                return new CourseProgressDto
                {
                    CourseId = courseId,
                    TotalLessons = 0,
                    CompletedLessons = 0,
                    ProgressPercentage = 0
                };
            }

            var lessonIds = lessons
                .Select(l => l.Id)
                .ToList();

            var completedLessons = await _progressRepository
                .CountCompletedAsync(
                    userId,
                    lessonIds
                );

            var progressPercentage =
                (double)completedLessons
                / totalLessons
                * 100;

            return new CourseProgressDto
            {
                CourseId = courseId,
                TotalLessons = totalLessons,
                CompletedLessons = completedLessons,
                ProgressPercentage = progressPercentage
            };
        }

        public async Task<LessonDto?> GetLatestCompletedLessonAsync(
           string userId,
           string courseId)
        {
            var lessons = await _lessonRepository
                .GetAllByCourseIdAsync(courseId);

            if (lessons.Count == 0)
                return null;

            var lessonIds = lessons
                .Select(l => l.Id)
                .ToList();

            var latestProgress = await _progressRepository
                .GetLatestCompletedAsync(
                    userId,
                    lessonIds
                );

            if (latestProgress == null)
                return null;

            var lesson = await _lessonRepository
                .GetByIdAsync(latestProgress.LessonId);

            if (lesson == null)
                throw new NotFoundException(
                    "Lesson does not exist."
                );

            return LessonMapper.ToDto(lesson);
        }

        public async Task<List<MyCourseProgressDto>> GetMyCoursesProgressAsync(string userId)
        {
            var enrollments = await _enrollmentRepository.GetAllByUserIdAsync(userId); var result = new List<MyCourseProgressDto>(); foreach (var enrollment in enrollments) { var course = await _courseRepository.GetByIdAsync(enrollment.CourseId); if (course == null) continue; var progress = await GetCourseProgressAsync(userId, enrollment.CourseId); var lastCompletedLesson = await GetLatestCompletedLessonAsync(userId, enrollment.CourseId); result.Add(new MyCourseProgressDto { CourseId = course.Id, CourseTitle = course.Title, TotalLessons = progress.TotalLessons, CompletedLessons = progress.CompletedLessons, ProgressPercentage = progress.ProgressPercentage, LastCompletedLesson = lastCompletedLesson }); }
            return result;
        }
    }
}
