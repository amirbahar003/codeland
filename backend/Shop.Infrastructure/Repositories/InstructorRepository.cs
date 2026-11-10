using MongoDB.Bson;
using MongoDB.Driver;
using Shop.Application.Exceptions;
using Shop.Application.Interfaces.Instructors;
using Shop.Domain.Entities;
using Shop.Infrastructure.Data;

namespace Shop.Infrastructure.Repositories
{
    public class InstructorRepository : IInstructorRepository
    {
        private readonly IMongoCollection<InstructorProfile> _instructors;
        public InstructorRepository(MongoDbContext context)
        {
            _instructors = context.GetCollection<InstructorProfile>("instructorProfiles");
        }
        public async Task<InstructorProfile> CreateAsync(InstructorProfile instructorProfile)
        {
            await _instructors.InsertOneAsync(instructorProfile);
            return instructorProfile;
        }

        public async Task<bool> ExistsBySlugAsync(string slug)
        {
            return await _instructors.Find(i => i.Slug == slug).AnyAsync();
        }

        public async Task<List<InstructorProfile>> GetAllAsync()
        {
            return await _instructors.Find(_ => true).ToListAsync();
        }

        public async Task<InstructorProfile?> GetByIdAsync(string Id)
        {
            if (!ObjectId.TryParse(Id, out _))
                throw new InvalidObjectIdException("Invalid InstructorProfileId.");
            return await _instructors.Find(i => i.Id == Id).FirstOrDefaultAsync();
        }

        public async Task<InstructorProfile?> GetBySlugAsync(string slug)
        {
            return await _instructors.Find(i => i.Slug == slug).FirstOrDefaultAsync();

        }

        public async Task<InstructorProfile?> GetByUserIdAsync(string userId)
        {
            if (!ObjectId.TryParse(userId, out _))
                throw new InvalidObjectIdException("Invalid UserId.");
            return await _instructors.Find(i => i.UserId == userId).FirstOrDefaultAsync();
        }

        public async Task<InstructorProfile?> UpdateAsync(string Id, InstructorProfile instructorProfile)
        {
            if (!ObjectId.TryParse(Id, out _))
                throw new InvalidObjectIdException("Invalid InstructorProfileId.");
            return await _instructors.FindOneAndReplaceAsync(i => i.Id == Id, instructorProfile, new FindOneAndReplaceOptions<InstructorProfile>
            {
                ReturnDocument = ReturnDocument.After
            });
        }

        public async Task UpdateSlugAsync(string instructorId, string slug)
        {
            if (!ObjectId.TryParse(instructorId, out _))
                throw new InvalidObjectIdException("Invalid InstructorProfileId.");

            var update = Builders<InstructorProfile>.Update.Set(i => i.Slug, slug);

            await _instructors.UpdateOneAsync(i => i.Id == instructorId, update);
        }
    }
}
