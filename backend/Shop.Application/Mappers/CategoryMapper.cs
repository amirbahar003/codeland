using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shop.Application.DTOs.Categories;
using Shop.Application.DTOs.Courses;
using Shop.Domain.Entities;

namespace Shop.Application.Mappers
{
    public static class CategoryMapper
    {
        public static CategoryDto ToDto(Category category)
        {
            return new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,

                Courses= category.Courses
                    .Select(course => new CourseSummaryDto
                    {
                        Id = course.Id,
                        Title = course.Title,
                        Price = course.Price,
                        ThumbnailId = course.ThumbnailId
                    })
                    .ToList()
            };
        }
    }
}
