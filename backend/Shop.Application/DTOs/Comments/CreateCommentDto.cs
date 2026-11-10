using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shop.Application.DTOs.Comments
{
    public class CreateCommentDto
    {
        public string CourseId { get; set; } = null!;

        public string Content { get; set; } = null!;

        public string? ParentCommentId { get; set; }
    }
}
