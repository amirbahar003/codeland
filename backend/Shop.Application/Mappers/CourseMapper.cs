using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shop.Application.DTOs.Categories;
using Shop.Application.DTOs.Courses;
using Shop.Application.DTOs.Instructors;
using Shop.Domain.Entities;

namespace Shop.Application.Mappers
{
    public static class CourseMapper
    {

        public static CourseDto ToDto(Course course)
        {
            return new CourseDto
            {
                Id = course.Id,
                Title = course.Title,
                Description = course.Description,
                Price = course.Price,
                ThumbnailId = course.ThumbnailId,
                CategoryId = course.CategoryId,

                Instructor = course.Instructor == null
               ? null
                : new InstructorSummaryDto
                {
                    Id = course.Instructor.Id,
                    UserId = course.Instructor.UserId,
                    Bio = course.Instructor.Bio,
                    Expertise = course.Instructor.Expertise,
                    AvatarId = course.Instructor.AvatarId
                },



                InstructorId = course.InstructorId,
                Level = course.Level,
                DurationMinutes = course.DurationMinutes,
                CreatedAt = course.CreatedAt,
                Slug = course.Slug,
                PrerequisiteCourseIds = course.PrerequisiteCourseIds,

                Category = course.Category == null
                    ? null
                    : new CategorySummaryDto
                    {
                        Id = course.Category.Id,
                        Name = course.Category.Name
                    }

            };
        }


        public static CourseDto ToDto(Course course,User? user)
        {
            var dto = ToDto(course);
            if (dto.Instructor != null)
            {
                dto.Instructor.UserName = user?.Username ?? "";
            }

            return dto;
        }
    }
}
