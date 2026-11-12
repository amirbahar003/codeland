using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shop.Domain.Entities;

namespace Shop.Application.Interfaces.Notifications.Services
{
    public interface INotificationService
    {
        Task CreateAsync(string userId, string title, string message);

        Task<List<Notification>> GetByUserIdAsync(string userId);

        Task<int> GetUnreadCountAsync(string userId);

        Task<bool> MarkAsReadAsync(string notificationId, string userId);

        Task MarkAllAsReadAsync(string userId);
    }
}
