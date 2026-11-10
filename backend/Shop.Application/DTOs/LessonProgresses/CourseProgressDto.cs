using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shop.Application.DTOs.LessonProgresses
{
    public class CourseProgressDto
    {
        public string CourseId { get; set; } = null;
        public int TotalLessons { get; set; }
        public int CompletedLessons { get; set; }
        public double ProgressPercentage { get; set; }
    }
}
