using MongoDB.Bson;
using MongoDB.Driver;
using Shop.Application.Exceptions;
using Shop.Application.Interfaces.Users.Repositories;
using Shop.Domain.Entities;
using Shop.Domain.Enums;
using Shop.Infrastructure.Data;

namespace Shop.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly IMongoCollection<User> _users;

    public UserRepository(MongoDbContext context)
    {
        _users = context.GetCollection<User>("users");
    }

    public async Task<long> CountReferralsAsync(string userId)
    {
        return await _users.CountDocumentsAsync(u => u.ReferredByUserId == userId);
    }

    public async Task<User> CreateAsync(User user)
    {
        await _users.InsertOneAsync(user);

        return user;
    }

    public async Task<bool> ExistsByEmailAsync(string email)
    {
        return await _users
            .Find(u => u.Email == email)
            .AnyAsync();
    }

    public async Task<bool> ExistsByReferralCodeAsync(string referralCode)
    {
        return await _users.Find(u => u.ReferralCode == referralCode).AnyAsync();
    }

    public async Task<List<User>> GetAllAsync()
    {
        return await _users.Find(_ => true).ToListAsync();
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _users
            .Find(u => u.Email == email)
            .FirstOrDefaultAsync();
    }

    public async Task<User?> GetByIdAsync(string Id)
    {
        if (!ObjectId.TryParse(Id, out _))
            throw new InvalidObjectIdException(
                "Invalid ObjectId."
            );

        return await _users
            .Find(u => u.Id == Id)
            .FirstOrDefaultAsync();
    }

    public async Task<User?> GetByMobileAsync(string mobile)
    {
        return await _users.Find(u => u.Mobile == mobile).FirstOrDefaultAsync();
    }

    public async Task<User?> GetByReferralCodeAsync(string referralCode)
    {
        return await _users.Find(u => u.ReferralCode == referralCode).FirstOrDefaultAsync();
    }

    public async Task<User?> GetByUsernameAsync(string username)
    {
        return await _users.Find(u => u.Username == username).FirstOrDefaultAsync();
    }

    public async Task<User?> IncrementSuccessfulReferralsAsync(string userId)
    {
        var filter = Builders<User>.Filter.Eq(u => u.Id, userId);

        var update = Builders<User>.Update.Inc(u => u.SuccessfulReferrals, 1);

        var options = new FindOneAndUpdateOptions<User>
        {
            ReturnDocument = ReturnDocument.After
        };

        return await _users.FindOneAndUpdateAsync(
            filter,
            update,
            options
        );
    }

    public async Task<User?> UpdatePasswordAsync(string userId, string passwordHash)
    {
        if (!ObjectId.TryParse(userId, out _))
            throw new InvalidObjectIdException("Invalid ObjectId.");

        var update = Builders<User>.Update
            .Set(u => u.PasswordHash, passwordHash)
            .Set(u => u.UpdatedAt, DateTime.UtcNow);

        return await _users.FindOneAndUpdateAsync(
            u => u.Id == userId,
            update,
            new FindOneAndUpdateOptions<User>
            {
                ReturnDocument = ReturnDocument.After
            }
        );
    }

    public async Task<User?> UpdateRoleAsync(
        string Id,
        UserRole role)
    {
        if (!ObjectId.TryParse(Id, out _))
            throw new InvalidObjectIdException(
                "Invalid ObjectId."
            );

        var update = Builders<User>.Update
            .Set(u => u.Role, role)
            .Set(u => u.UpdatedAt, DateTime.UtcNow);

        return await _users.FindOneAndUpdateAsync(
            u => u.Id == Id,
            update,
            new FindOneAndUpdateOptions<User>
            {
                ReturnDocument = ReturnDocument.After
            }
        );
    }

    public async Task<User?> UpdateStatusAsync(string Id, bool IsActive)
    {
        if (!ObjectId.TryParse(Id, out _))
            throw new InvalidObjectIdException("Invalid ObjectId.");

        var update = Builders<User>.Update.Set(u => u.IsActive, IsActive).Set(u => u.UpdatedAt, DateTime.UtcNow);
        return await _users.FindOneAndUpdateAsync(u => u.Id == Id, update, new FindOneAndUpdateOptions<User>
        {
            ReturnDocument = ReturnDocument.After
        });
    }
}