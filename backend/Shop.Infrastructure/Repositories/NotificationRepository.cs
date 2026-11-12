
using MongoDB.Driver;
using Shop.Application.Interfaces.Notifications.Repository;
using Shop.Domain.Entities;
using Shop.Infrastructure.Data;

namespace Shop.Infrastructure.Repositories;

public class NotificationRepository : INotificationRepository
{
    private readonly IMongoCollection<Notification> _notifications;

    public NotificationRepository(MongoDbContext context)
    {
        _notifications = context.GetCollection<Notification>(
            "notifications"
        );
    }

    public async Task CreateAsync(Notification notification)
    {
        await _notifications.InsertOneAsync(notification);
    }

    public async Task<List<Notification>> GetByUserIdAsync(string userId)
    {
        return await _notifications.Find(n => n.UserId == userId).SortByDescending(n => n.CreatedAt).ToListAsync();
    }

    public async Task<int> GetUnreadCountAsync(string userId)
    {
        var filter = Builders<Notification>.Filter.And(
            Builders<Notification>.Filter.Eq(n => n.UserId, userId),
            Builders<Notification>.Filter.Eq(n => n.IsRead, false)
        );

        return (int)await _notifications.CountDocumentsAsync(filter);
    }

    public async Task<bool> MarkAsReadAsync(
        string notificationId,
        string userId)
    {
        var filter = Builders<Notification>.Filter.And(
            Builders<Notification>.Filter.Eq(n => n.Id, notificationId),
            Builders<Notification>.Filter.Eq(n => n.UserId, userId),
            Builders<Notification>.Filter.Eq(n => n.IsRead, false)
        );

        var update = Builders<Notification>.Update
            .Set(n => n.IsRead, true);

        var result = await _notifications.UpdateOneAsync(filter, update);

        return result.ModifiedCount > 0;
    }

    public async Task MarkAllAsReadAsync(string userId)
    {
        var filter = Builders<Notification>.Filter.And(
            Builders<Notification>.Filter.Eq(n => n.UserId, userId),
            Builders<Notification>.Filter.Eq(n => n.IsRead, false)
        );

        var update = Builders<Notification>.Update
            .Set(n => n.IsRead, true);

        await _notifications.UpdateManyAsync(filter, update);
    }
}
