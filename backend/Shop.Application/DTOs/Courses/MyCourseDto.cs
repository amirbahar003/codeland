using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shop.Application.DTOs.Courses
{
    public class MyCourseDto
    {

        public string CourseId { get; set; } = null!;
        public string Title { get; set; } = null!;
        public string? ThumbnailId { get; set; }
        public decimal Price { get; set; }
        public string Level { get; set; } = null!;
        public int DurationMinutes { get; set; }
        public DateTime EnrolledAt { get; set; }
        public string Slug { get; set; } = null!;
    }
}
