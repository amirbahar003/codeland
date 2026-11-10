using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shop.Application.DTOs.Courses;

namespace Shop.Application.DTOs.Categories
{
    public class CategoryDto
    {
        public string? Id { get; set; }

        public string Name { get; set; } = null!;

        public List<CourseSummaryDto> Courses { get; set; } = new List<CourseSummaryDto>();
    }
}
