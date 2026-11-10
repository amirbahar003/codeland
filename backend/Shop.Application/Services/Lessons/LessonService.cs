using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Shop.Application.DTOs.Lessons;
using Shop.Application.Exceptions;
using Shop.Application.Interfaces.Chapters.Repositories;
using Shop.Application.Interfaces.Enrollments.Services;
using Shop.Application.Interfaces.File;
using Shop.Application.Interfaces.Lessons.Repositories;
using Shop.Application.Interfaces.Lessons.Services;
using Shop.Application.Mappers;
using Shop.Application.Services.Enrollments;
using Shop.Domain.Entities;

namespace Shop.Application.Services.Lessons
{
    public class LessonService : ILessonService
    {
        private readonly ILessonRepository _repository;

        private readonly IChapterRepository _chapterRepository;
        private readonly IEnrollmentService _service;
        private readonly IFileStorageService _fileStorageService;
        public LessonService(ILessonRepository repository, IEnrollmentService service, IChapterRepository chapterRepository, IFileStorageService fileStorageService)
        {
            _repository = repository;
            _service = service;
            _chapterRepository = chapterRepository;
            _fileStorageService = fileStorageService;
        }
        public async Task<LessonDto> CreateAsync(CreateLessonDto lessonDto)
        {
            var chapterExists = await _repository
     .ChapterExistsAsync(lessonDto.ChapterId);

            if (!chapterExists)
                throw new NotFoundException("Chapter does not exist.");

            var lesson = new Lesson
            {
                Title = lessonDto.Title.Trim(),
                Description = lessonDto.Description?.Trim(),
                ChapterId = lessonDto.ChapterId,
                Order = lessonDto.Order,
                DurationMinutes = lessonDto.DurationMinutes,
                IsFree = lessonDto.IsFree,
                CreatedAt = DateTime.UtcNow
            };

            var createdLesson = await _repository
                .CreateAsync(lesson);

            return LessonMapper.ToDto(createdLesson);
        }

        public async Task DeleteAsync(string Id)
        {
            var existingLesson = await _repository
     .GetByIdAsync(Id);

            if (existingLesson == null)
                throw new NotFoundException(
                    "Lesson does not exist.");

            var deleted = await _repository
                .DeleteAsync(Id);

            if (!deleted)
                throw new NotFoundException(
                    "Lesson does not exist.");
        }

        public async Task<List<LessonDto>> GetAllByChapterIdAsync(string chapterId)
        {
            var chapterExists = await _repository.ChapterExistsAsync(chapterId);
            if (!chapterExists)
                throw new NotFoundException("Chapter does not exist.");
            var lessons = await _repository.GetAllByChapterIdAsync(chapterId);
            return lessons.Select(LessonMapper.ToDto).ToList();
        }

        public async Task<LessonDto> GetByIdAsync(
       string lessonId,
       string? userId)
        {
            var lesson = await _repository
                .GetByIdAsync(lessonId);

            if (lesson == null)
                throw new NotFoundException(
                    "Lesson does not exist."
                );

            if (lesson.IsFree)
                return LessonMapper.ToDto(lesson);

            var chapter = await _chapterRepository
                .GetByIdAsync(lesson.ChapterId);

            if (chapter == null)
                throw new NotFoundException(
                    "Chapter does not exist."
                );

            if (userId == null)
                throw new UnauthorizedAccessException(
                    "Authentication is required to access this lesson."
                );

            var hasAccess = await _service
                .HasAccessAsync(
                    userId,
                    chapter.CourseId
                );

            if (!hasAccess)
                throw new ForbiddenException(
                    "You do not have access to this lesson."
                );

            return LessonMapper.ToDto(lesson);
        }

        public async Task<(Stream Stream, string ContentType, string FileName)> GetVideoAsync(
       string userId,
       string lessonId)
        {
            var lesson = await _repository
                .GetByIdAsync(lessonId);

            if (lesson == null)
                throw new NotFoundException(
                    "Lesson does not exist."
                );

            if (string.IsNullOrEmpty(lesson.VideoId))
                throw new NotFoundException(
                    "Video does not exist."
                );


            if (!lesson.IsFree)
            {
                var chapter = await _chapterRepository
                    .GetByIdAsync(lesson.ChapterId);

                if (chapter == null)
                    throw new NotFoundException(
                        "Chapter does not exist."
                    );

                var hasAccess = await _service
                    .HasAccessAsync(
                        userId,
                        chapter.CourseId
                    );

                if (!hasAccess)
                    throw new ForbiddenException(
                        "You do not have access to this video."
                    );
            }

            return await _fileStorageService
                .GetFileAsync(lesson.VideoId);
        }

        public async Task<LessonDto> UpdateAsync(string Id, UpdateLessonDto lessonDto)
        {
            var existingLesson = await _repository.GetByIdAsync(Id);
            if (existingLesson == null)
                throw new NotFoundException("Lesson does not exist.");
            var lesson = new Lesson
            {
                Id = Id,
                Title = lessonDto.Title.Trim(),
                Description = lessonDto.Description?.Trim(),
                ChapterId = existingLesson.ChapterId,
                Order = lessonDto.Order,
                DurationMinutes = lessonDto.DurationMinutes,
                IsFree = lessonDto.IsFree,
                VideoId = existingLesson.VideoId,
                CreatedAt = existingLesson.CreatedAt
            };
            var updatedLesson = await _repository.UpdateAsync(Id, lesson);
            if (updatedLesson == null)
                throw new NotFoundException("Lesson does not exist.");
            return LessonMapper.ToDto(updatedLesson);
        }

        public async Task<LessonDto> UploadVideoAsync(string userId, string lessonId, IFormFile file)
        {
            var lesson = await _repository.GetByIdAsync(lessonId);
            if (lesson == null)
                throw new NotFoundException("Lesson does not exist.");
            if (file == null || file.Length == 0)
                throw new ArgumentException("Video file is empty.");
            var videoId = await _fileStorageService.UploadFileAsync(file);

            var updatedLesson = await _repository.UpdateVideoAsync(lessonId, videoId);
            if (updatedLesson == null)
            {
                await _fileStorageService.DeleteAsync(videoId);
                throw new NotFoundException("Lesson does not exist.");
            }
            return LessonMapper.ToDto(updatedLesson);
        }
    }
}
