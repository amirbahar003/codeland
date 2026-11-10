using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;
using Shop.Application.Exceptions;
using Shop.Application.Interfaces.Enrollments.Repositories;
using Shop.Domain.Entities;
using Shop.Infrastructure.Data;

namespace Shop.Infrastructure.Repositories
{
    public class EnrollmentRepository : IEnrollmentRepository
    {
        private readonly IMongoCollection<Enrollment> _enrollments;
        public EnrollmentRepository(MongoDbContext context) 
        {
            _enrollments = context.GetCollection<Enrollment>("enrollments"); 
        }
        public async Task<Enrollment> CreateAsync(Enrollment enrollment)
        {
            await _enrollments.InsertOneAsync(enrollment);
            return enrollment;
        }

        public async Task<List<Enrollment>> GetAllByUserIdAsync(string userId)
        {
            if (!ObjectId.TryParse(userId, out _))
                throw new InvalidObjectIdException(
                    "Invalid UserId."
                );

            return await _enrollments
                .Find(e => e.UserId == userId)
                .ToListAsync();
        }

        public async Task<Enrollment?> GetByUserAndCourseAsync(string userId, string courseId)
        {
            if (!ObjectId.TryParse(userId, out _))
                throw new InvalidObjectIdException("Invalid UserId.");
            if (!ObjectId.TryParse(courseId, out _))
                throw new InvalidObjectIdException("Invalid CourseId.");
            return await _enrollments.Find(e => e.UserId == userId && e.CourseId == courseId).FirstOrDefaultAsync();
        }
    }
}
