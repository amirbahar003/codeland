using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shop.Application.DTOs.Lessons;
using Shop.Domain.Entities;

namespace Shop.Application.Mappers
{
    public static class LessonMapper
    {
         public static LessonDto ToDto(Lesson lesson)
        {
            return new LessonDto
            {
                Id = lesson.Id,
                Title = lesson.Title,
                Description = lesson.Description,
                ChapterId = lesson.ChapterId,
                Order = lesson.Order,
                DurationMinutes = lesson.DurationMinutes,
                VideoId = lesson.VideoId,
                IsFree = lesson.IsFree,
                CreatedAt = lesson.CreatedAt
            };
        }
    }
}
