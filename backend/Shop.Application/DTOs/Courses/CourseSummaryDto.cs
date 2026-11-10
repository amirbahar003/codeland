using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shop.Application.DTOs.Courses
{
    public class CourseSummaryDto
    {
        public string? Id { get; set; }
        public string Title { get; set; } = null!;
        public decimal Price { get; set; }
        public string? ThumbnailId { get; set; }
    }
}
