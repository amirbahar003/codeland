using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shop.Application.DTOs.Chaptres;
using Shop.Domain.Entities;

namespace Shop.Application.Mappers
{
    public static class ChapterMapper
    {
        public static ChapterDto ToDto(Chapter chapter)
        {
            return new ChapterDto
            {
                Id = chapter.Id,
                Title = chapter.Title,
                Description = chapter.Description,
                CourseId = chapter.CourseId,
                Order = chapter.Order,
                CreatedAt = chapter.CreatedAt,
                Lessons = chapter.Lessons.Select(LessonMapper.ToDto).ToList()
            };
        }
    }
}
