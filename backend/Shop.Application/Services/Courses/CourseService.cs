using Microsoft.Extensions.Logging;
using Shop.Application.DTOs.Common;
using Shop.Application.DTOs.Courses;
using Shop.Application.Interfaces.Courses.Repositories;
using Shop.Application.Interfaces.Courses.Services;
using Shop.Application.Exceptions;
using Shop.Domain.Entities;
using Shop.Application.Mappers;
using Shop.Application.Interfaces.File;
using Shop.Application.Interfaces.Enrollments.Services;
using Shop.Application.Interfaces.Users.Repositories;
using Shop.Domain.Enums;
using System.Text.RegularExpressions;
using System;

namespace Shop.Application.Services.Courses
{
    public class CourseService : ICourseService
    {
        private readonly ICourseRepository _repository;
        private readonly IFileStorageService _fileStorage;
        private readonly ILogger<CourseService> _logger;
        private readonly IUserRepository _userRepository;

        public CourseService(ICourseRepository repository, IFileStorageService fileStorage, ILogger<CourseService> logger, IUserRepository userRepository)
        {
            _repository = repository;
            _fileStorage = fileStorage;
            _logger = logger;
            _userRepository = userRepository;
        }

        public static string GenerateSlug(string title)
        {
            var slug = title
       .Trim()
       .ToLowerInvariant();

            slug = Regex.Replace(
                slug,
                @"[^a-z0-9]+",
                "-"
            );

            slug = slug.Trim('-');

            return slug;
        }

        public async Task<CourseDto> AssignInstructorAsync(string courseId, string instructorId)
        {
            var course = await _repository.GetByIdAsync(courseId);
            if (course == null)
                throw new NotFoundException("Course does not exist.");
            var instructor = await _userRepository.GetByIdAsync(instructorId);
            if (instructor == null)
                throw new NotFoundException("Instructor does not exist.");
            if (instructor.Role != UserRole.Instructor)
                throw new ForbiddenException("User is not an instructor.");
            course.InstructorId = instructorId;
            var updatedCourse = await _repository.UpdateAsync(courseId, course);
            if (updatedCourse == null)
                throw new NotFoundException("Course does not exist.");
            return CourseMapper.ToDto(updatedCourse);
        }

        public async Task<CourseDto> CreateAsync(string userId, CreateCourseDto courseDto)
        {
            var categoryExists = await _repository.CategoryExistsAsync(courseDto.CategoryId);
            if (!categoryExists)
                throw new NotFoundException("Category does not exist.");

            var prerequisitesExist = await _repository.CoursesExistAsync(courseDto.PrerequisiteCourseIds);

            if (!prerequisitesExist)
                throw new NotFoundException(
                    "One or more prerequisite courses do not exist."
                );

            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                throw new NotFoundException("User does not exist.");

            string? instructorId = null;
            if (user.Role == UserRole.Instructor)
            {
                instructorId = userId;
            }
            else if (user.Role == UserRole.Admin)
            {
                instructorId = courseDto.InstructorId;
            }

            if (user.Role == UserRole.Admin &&
                !string.IsNullOrWhiteSpace(instructorId))
            {
                var instructor = await _userRepository
                    .GetByIdAsync(instructorId);

                if (instructor == null)
                    throw new NotFoundException(
                        "Instructor does not exist."
                    );

                if (instructor.Role != UserRole.Instructor)
                    throw new ForbiddenException(
                        "Selected user is not an instructor."
                    );
            }


            var slug = GenerateSlug(courseDto.Title);

            var existingCourse = await _repository.GetBySlugAsync(slug);

            if (existingCourse != null)

                throw new ConflictException("A course with this title already exists.");

            string? thumbnailId = null;

            bool courseCreated = false;

            try
            {
                thumbnailId = await _fileStorage.UploadFileAsync(courseDto.Thumbnail);
                var course = new Course
                {
                    Title = courseDto.Title,
                    Description = courseDto.Description,
                    Price = courseDto.Price,
                    ThumbnailId = thumbnailId,
                    CategoryId = courseDto.CategoryId,
                    Level = courseDto.Level,
                    DurationMinutes = courseDto.DurationMinutes,
                    CreatedAt = DateTime.UtcNow,
                    Slug = slug,
                    InstructorId = instructorId,
                    PrerequisiteCourseIds = courseDto.PrerequisiteCourseIds,
                };
                var createdCourse = await _repository.CreateAsync(course);
                courseCreated = true;
                return CourseMapper.ToDto(createdCourse);
            }
            catch
            {
                if (!courseCreated && thumbnailId != null)
                {
                    try
                    {
                        await _fileStorage.DeleteAsync(thumbnailId);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Failed to rollback thumbnail {ThumbnailId} after course creation failed.", thumbnailId);
                    }
                }
                throw;
            }
        }

        public async Task DeleteAsync(string Id)
        {
            var existingCourse = await _repository.GetByIdAsync(Id);
            if (existingCourse == null)
                throw new NotFoundException("Course does not exist.");
            var deleted = await _repository.DeleteAsync(Id);
            if (!deleted)
                throw new NotFoundException("Course does not exist.");
            if (!string.IsNullOrEmpty(existingCourse.ThumbnailId))
            {
                try
                {
                    await _fileStorage.DeleteAsync(existingCourse.ThumbnailId);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to delete thumbnail {ThumbnailId} after course {CourseId} was deleted.", existingCourse.ThumbnailId, Id);
                }
            }
        }

        public async Task<PagedResultDto<CourseDto>> GetAllAsync(int page, int pageSize, string? search, string? categoryId, decimal? minPrice, decimal? maxPrice, string? sortBy, string? sortOrder)
        {
            var result = await _repository.GetAllAsync(page, pageSize, search, categoryId, minPrice, maxPrice, sortBy, sortOrder);
            var courses = result.Items.Select(CourseMapper.ToDto).ToList();
            return new PagedResultDto<CourseDto>
            {
                Items = courses,
                Page = page,
                PageSize = pageSize,
                TotalItems = result.TotalItems
            };
        }

        public async Task<CourseDto?> GetByIdAsync(string Id)
        {
            var course = await _repository.GetByIdAsync(Id);
            if (course == null)
                throw new NotFoundException("Course does not exist.");
            return CourseMapper.ToDto(course);
        }

        public async Task<CourseDto?> GetBySlugAsync(string slug)
        {
            var course = await _repository.GetBySlugAsync(slug);

            if (course == null)
                throw new NotFoundException("Course does not exist.");

            var prerequisiteCourses = await _repository
                .GetPrerequisiteCoursesAsync(course.PrerequisiteCourseIds);

            var dto = CourseMapper.ToDto(course);

            dto.Prerequisites = prerequisiteCourses
                .Select(c => new CoursePrerequisiteDto
                {
                    Id = c.Id,
                    Title = c.Title
                })
                .ToList();

            return dto;
        }



        public async Task<CourseDto> UpdateAsync(
      string Id,
      UpdateCourseDto courseDto)
        {
            var categoryExists = await _repository
                .CategoryExistsAsync(courseDto.CategoryId);

            if (!categoryExists)
                throw new NotFoundException(
                    "Category does not exist."
                );

            var prerequisitesExist = await _repository.CoursesExistAsync(courseDto.PrerequisiteCourseIds);

            if (!prerequisitesExist)
                throw new NotFoundException(
                    "One or more prerequisite courses do not exist."
                );

            var existingCourse = await _repository
                .GetByIdAsync(Id);

            if (existingCourse == null)
                throw new NotFoundException(
                    "Course does not exist."
                );

            var slug = GenerateSlug(courseDto.Title);

            if (slug != existingCourse.Slug)
            {
                var existingSlugCourse = await _repository
                    .GetBySlugAsync(slug);

                if (existingSlugCourse != null &&
                    existingSlugCourse.Id != existingCourse.Id)
                {
                    throw new ConflictException(
                        "A course with this slug already exists."
                    );
                }
            }

            string? thumbnailId =
                existingCourse.ThumbnailId;

            string? newThumbnailId = null;

            bool updateSucceeded = false;

            try
            {
                if (courseDto.Thumbnail != null)
                {
                    newThumbnailId = await _fileStorage
                        .UploadFileAsync(
                            courseDto.Thumbnail
                        );

                    thumbnailId = newThumbnailId;
                }

                var course = new Course
                {
                    Id = Id,
                    Title = courseDto.Title,
                    Description = courseDto.Description,
                    Price = courseDto.Price,
                    ThumbnailId = thumbnailId,
                    CategoryId = courseDto.CategoryId,
                    InstructorId = existingCourse.InstructorId,
                    Level = courseDto.Level,
                    DurationMinutes = courseDto.DurationMinutes,
                    CreatedAt = existingCourse.CreatedAt,
                    Slug = slug,
                    PrerequisiteCourseIds = courseDto.PrerequisiteCourseIds,
                };

                var updatedCourse = await _repository
                    .UpdateAsync(
                        Id,
                        course
                    );

                if (updatedCourse == null)
                    throw new NotFoundException(
                        "Course does not exist."
                    );

                updateSucceeded = true;

                if (newThumbnailId != null &&
                    !string.IsNullOrEmpty(
                        existingCourse.ThumbnailId
                    ))
                {
                    try
                    {
                        await _fileStorage.DeleteAsync(
                            existingCourse.ThumbnailId
                        );
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(
                            ex,
                            "Failed to delete old thumbnail {ThumbnailId} after course {CourseId} was updated.",
                            existingCourse.ThumbnailId,
                            Id
                        );
                    }
                }

                return CourseMapper.ToDto(
                    updatedCourse
                );
            }
            catch
            {
                if (!updateSucceeded &&
                    newThumbnailId != null)
                {
                    try
                    {
                        await _fileStorage.DeleteAsync(
                            newThumbnailId
                        );
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(
                            ex,
                            "Failed to rollback new thumbnail {ThumbnailId} after course update failed.",
                            newThumbnailId
                        );
                    }                                   
                }

                throw;
            }
        }


    }
}
