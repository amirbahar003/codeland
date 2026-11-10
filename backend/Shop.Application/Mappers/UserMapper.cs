using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shop.Application.DTOs.Users;
using Shop.Domain.Entities;

namespace Shop.Application.Mappers
{
    public static class UserMapper
    {
        public static UserDto ToDto(User user)
        {
            return new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role,
                IsActive = user.IsActive,
                AvatarId = user.AvatarId,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt

            };
        }

    }
}
