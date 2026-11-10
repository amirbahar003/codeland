using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shop.Domain.Entities
{
    public class LearningActivity
    {
        public string LessonId { get; set; } = null!;

        public int DurationMinutes { get; set; }

        public DateTime CompletedAtUtc { get; set; }
    }
}
