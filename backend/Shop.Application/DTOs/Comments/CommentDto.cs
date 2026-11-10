using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shop.Application.DTOs.Comments
{
    public class CommentDto
    {
        public string? Id { get; set; }

        public string CourseId { get; set; } = null!;

        public string UserId { get; set; } = null!;
        public string UserName { get; set; }

        public string Content { get; set; } = null!;

        public string? ParentCommentId { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
