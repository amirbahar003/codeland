using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shop.Domain.Entities;

namespace Shop.Application.Interfaces.Notifications.Repository
{
    public interface INotificationRepository
    {
        Task CreateAsync(Notification notification);

        Task<List<Notification>> GetByUserIdAsync(string userId);

        Task<int> GetUnreadCountAsync(string userId);

        Task<bool> MarkAsReadAsync(string notificationId, string userId);

        Task MarkAllAsReadAsync(string userId);
    }

}

