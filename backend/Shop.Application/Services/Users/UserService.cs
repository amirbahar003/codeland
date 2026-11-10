using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shop.Application.DTOs.Users;
using Shop.Application.Exceptions;
using Shop.Application.Interfaces.Users.Repositories;
using Shop.Application.Interfaces.Users.Services;
using Shop.Application.Mappers;
using Shop.Domain.Enums;

namespace Shop.Application.Services.Users
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _repository;
        public UserService(IUserRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<UserDto>> GetAllAsync()
        {
            var users = await _repository.GetAllAsync();
            return users.Select(UserMapper.ToDto).ToList();
        }

        public async Task<UserDto> GetByIdAsync(string userId)
        {
            var user = await _repository.GetByIdAsync(userId);
            if(user==null)
                throw new NotFoundException("User does not exist.");
            return UserMapper.ToDto(user);
        }

        public async Task UpdateRoleAsync(string userId, UserRole role)
        {
            var existingUser = await _repository.GetByIdAsync(userId);
            if (existingUser == null)
                throw new NotFoundException("User does not exist.");
            var updatedUser = await _repository.UpdateRoleAsync(userId, role);
            if (updatedUser == null)
                throw new NotFoundException("User does not exist.");
        }


        public async Task UpdateStatusAsync(
            string userId,
            bool IsActive)
        {
            var existingUser = await _repository
                .GetByIdAsync(userId);

            if (existingUser == null)
                throw new NotFoundException(
                    "User does not exist."
                );

            var updatedUser = await _repository
                .UpdateStatusAsync(
                    userId,
                    IsActive
                );

            if (updatedUser == null)
                throw new NotFoundException(
                    "User does not exist."
                );
        }
    }
}
