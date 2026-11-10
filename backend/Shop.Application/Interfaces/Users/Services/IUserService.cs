using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shop.Application.DTOs.Users;
using Shop.Domain.Enums;

namespace Shop.Application.Interfaces.Users.Services
{
    public interface IUserService
    {
        Task UpdateRoleAsync(string userId, UserRole role);
        Task<List<UserDto>> GetAllAsync();

        Task<UserDto> GetByIdAsync(string userId);

        Task UpdateStatusAsync(string userId, bool IsActive);
    }
}
