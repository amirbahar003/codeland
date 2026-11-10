using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shop.Application.DTOs.Lessons;

namespace Shop.Application.DTOs.Chaptres
{
    public class ChapterDto
    {
        public string? Id { get; set; }
        public string Title { get; set; } = null!; public string? Description { get; set; }
        public string CourseId { get; set; } = null!; public int Order { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<LessonDto> Lessons { get; set; } = new();
    }
}
