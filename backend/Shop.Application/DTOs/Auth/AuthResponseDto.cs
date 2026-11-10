using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shop.Application.DTOs.Auth
{
    public class AuthResponseDto
    {
        public string Token { get; set; } = null!;

        public DateTime ExpiresAt { get; set; }

        public string UserId { get; set; } = null!;

        public string Username { get; set; } = null!;
        public string Mobile { get; set; } = null!;

        public string Role { get; set; } = null!;
    }
}
