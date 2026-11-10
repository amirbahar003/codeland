using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shop.Application.DTOs.Curriculum
{
    public class LessonCurriculumDto
    {
        public string? Id { get; set; }

        public string Title { get; set; } = null!;

        public string? Description { get; set; }

        public int Order { get; set; }

        public int DurationMinutes { get; set; }

        public bool IsFree { get; set; }
    }
}
