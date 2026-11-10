using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shop.Application.DTOs.Lessons
{
    public class LessonDto
    {
        public string? Id { get; set; }
        public string Title { get; set; } = null!; 
        public string? Description { get; set; }
        public string ChapterId { get; set; } = null!; 
        public int Order { get; set; }
        public int DurationMinutes { get; set; }
        public string? VideoId { get; set; }
        public bool IsFree { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
