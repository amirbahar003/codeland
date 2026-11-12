
using Shop.Application.Interfaces.Notifications;
using Shop.Application.Interfaces.Notifications.Repository;
using Shop.Application.Interfaces.Notifications.Services;
using Shop.Domain.Entities;

namespace Shop.Application.Services.Notifications;

public class NotificationService : INotificationService
{
    private readonly INotificationRepository _repository;

    public NotificationService(INotificationRepository repository)
    {
        _repository = repository;
    }

    public async Task CreateAsync(
        string userId,
        string title,
        string message)
    {
        var notification = new Notification
        {
            UserId = userId,
            Title = title,
            Message = message,
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        };

        await _repository.CreateAsync(notification);
    }

    public async Task<List<Notification>> GetByUserIdAsync(string userId)
    {
        return await _repository.GetByUserIdAsync(userId);
    }

    public async Task<int> GetUnreadCountAsync(string userId)
    {
        return await _repository.GetUnreadCountAsync(userId);
    }

    public async Task<bool> MarkAsReadAsync(
        string notificationId,
        string userId)
    {
        return await _repository.MarkAsReadAsync(notificationId, userId);
    }

    public async Task MarkAllAsReadAsync(string userId)
    {
        await _repository.MarkAllAsReadAsync(userId);
    }
}
