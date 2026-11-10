using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shop.Application.DTOs.Lessons;

namespace Shop.Application.DTOs.LessonProgresses
{
    public class MyCourseProgressDto
    {
        public string CourseId { get; set; } = null!;

        public string CourseTitle { get; set; } = null!;

        public int TotalLessons { get; set; }

        public int CompletedLessons { get; set; }

        public double ProgressPercentage { get; set; }

        public LessonDto? LastCompletedLesson { get; set; }
    }
}
