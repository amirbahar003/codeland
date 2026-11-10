using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shop.Application.DTOs.LessonProgreeses
{
    public class LessonProgressDto
    {
        public string Id { get; set; } = null!;
        public string UserId { get; set; } = null!;
        public string LessonId { get; set; } = null!;
        public bool IsCompleted { get; set; }
        public DateTime? CompletedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
