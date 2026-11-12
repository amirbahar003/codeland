using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Shop.Application.Interfaces.Notifications.Services;

namespace Shop.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationsController : ControllerBase
    {
        private readonly INotificationService _service;

        public NotificationsController(INotificationService service)
        {
            _service = service;
        }

        // دریافت تمام اعلان‌های کاربر
        [HttpGet]
        public async Task<IActionResult> GetMyNotifications()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var notifications = await _service.GetByUserIdAsync(userId);

            return Ok(notifications);
        }

        // تعداد اعلان‌های خوانده‌نشده
        [HttpGet("unread-count")]
        public async Task<IActionResult> GetUnreadCount()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var count = await _service.GetUnreadCountAsync(userId);

            return Ok(count);
        }

        // خوانده‌شده کردن یک اعلان
        [HttpPatch("{notificationId}/read")]
        public async Task<IActionResult> MarkAsRead(string notificationId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var result = await _service.MarkAsReadAsync(notificationId, userId);

            if (!result)
                return NotFound(new { message = "اعلان پیدا نشد یا قبلاً خوانده شده است." });

            return NoContent();
        }

        // خوانده‌شده کردن تمام اعلان‌ها
        [HttpPatch("read-all")]
        public async Task<IActionResult> MarkAllAsRead()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            await _service.MarkAllAsReadAsync(userId);

            return NoContent();
        }

    }
}
