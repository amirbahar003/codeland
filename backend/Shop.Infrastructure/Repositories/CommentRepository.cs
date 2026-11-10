using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MongoDB.Driver;
using Shop.Application.Interfaces.Comments.Repository;
using Shop.Domain.Entities;
using Shop.Infrastructure.Data;

namespace Shop.Infrastructure.Repositories
{
    public class CommentRepository : ICommentRepository
    {

        private readonly IMongoCollection<Comment> _comments;

        public CommentRepository(MongoDbContext context)
        {
            _comments = context.GetCollection<Comment>("Comments");
        }
        public async Task<Comment> CreateAsync(Comment comment)
        {
            await _comments.InsertOneAsync(comment);

            return comment;
        }

        public async Task DeleteAsync(string Id)
        {
            await _comments.DeleteOneAsync(x => x.Id == Id);
        }

        public async Task<bool> ExistsAsync(string Id)
        {
            return await _comments.Find(x => x.Id == Id).AnyAsync();
        }

        public async Task<List<Comment>> GetByCourseIdAsync(string courseId)
        {
            return await _comments.Find(x => x.CourseId == courseId).SortByDescending(x => x.CreatedAt).ToListAsync();
        }

        public async Task<Comment?> GetByIdAsync(string Id)
        {
            return await _comments.Find(x => x.Id == Id).FirstOrDefaultAsync();
        }
    }
}
