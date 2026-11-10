using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shop.Application.DTOs.Courses;
using Shop.Application.Exceptions;
using Shop.Application.Interfaces.Courses.Repositories;
using Shop.Application.Interfaces.Enrollments.Repositories;
using Shop.Application.Interfaces.Enrollments.Services;
using Shop.Domain.Entities;

namespace Shop.Application.Services.Enrollments
{
    public class EnrollmentService : IEnrollmentService
    {
        private readonly IEnrollmentRepository _repository;
        private readonly ICourseRepository _courseRepository;
        public EnrollmentService(IEnrollmentRepository repository, ICourseRepository courseRepository)
        {
            _repository = repository;
            _courseRepository = courseRepository;
        }

        public async Task EnrollAsync(string userId, string courseId)
        {
            var course = await _courseRepository.GetByIdAsync(courseId);
            if (course == null)
                throw new NotFoundException("Course does not exist.");
            var existingEnrollment = await _repository.GetByUserAndCourseAsync(userId, courseId);
            if (existingEnrollment != null)
                throw new ConflictException("User is already enrolled in this course.");
            var enrollment = new Enrollment
            {
                UserId = userId,
                CourseId = courseId,
                EnrolledAt = DateTime.UtcNow
            };
            await _repository.CreateAsync(enrollment);
        }

        public async Task<List<MyCourseDto>> GetMyCourseAsync(string userId)
        {
            var enrollments = await _repository.GetAllByUserIdAsync(userId);
            var result = new List<MyCourseDto>();

            foreach (var enrollment in enrollments)
            {
                var course = await _courseRepository.GetByIdAsync(enrollment.CourseId);
                if (course == null)
                    continue;

                result.Add(new MyCourseDto
                {
                    CourseId = course.Id,
                    Title = course.Title,
                    ThumbnailId = course.ThumbnailId,
                    Price = course.Price,
                    Level = course.Level,
                    Slug = course.Slug,
                    DurationMinutes = course.DurationMinutes,
                    EnrolledAt = enrollment.EnrolledAt
                }); 
            }
            return result;
        }

        public async Task<bool> HasAccessAsync(string userId, string courseId)
        {
            var enrollment = await _repository.GetByUserAndCourseAsync(userId, courseId);
            return enrollment != null;
        }
    }
}
