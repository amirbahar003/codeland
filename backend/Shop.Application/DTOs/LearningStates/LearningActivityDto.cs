using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shop.Application.DTOs.LearningStates
{
    public class LearningActivityDto
    {
        public string LessonId { get; set; } = string.Empty;

        public int DurationMinutes { get; set; }

        public DateTime CompletedAtUtc { get; set; }
    }
}
