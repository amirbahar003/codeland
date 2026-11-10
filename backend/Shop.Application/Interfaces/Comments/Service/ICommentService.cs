using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shop.Application.DTOs.Comments;

namespace Shop.Application.Interfaces.Comments.Service
{
    public interface ICommentService
    {
        Task<CommentDto> CreateAsync(string userId, CreateCommentDto dto);

        Task<List<CommentDto>> GetByCourseIdAsync(string courseId);

        Task DeleteAsync(string userId,string commentId );
    }
}
