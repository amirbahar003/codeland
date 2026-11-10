using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shop.Domain.Entities;

namespace Shop.Application.Interfaces.Comments.Repository
{
    public interface ICommentRepository
    {
        Task<Comment> CreateAsync(Comment comment);

        Task<Comment?> GetByIdAsync(string Id);

        Task<List<Comment>> GetByCourseIdAsync(string courseId);

        Task<bool> ExistsAsync(string Id);

        Task DeleteAsync(string Id);
    }
}
