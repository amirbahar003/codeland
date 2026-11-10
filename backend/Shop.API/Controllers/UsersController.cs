using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Shop.Application.DTOs.Auth;
using Shop.Application.Interfaces.Users.Services;
using Shop.Domain.Entities;

namespace Shop.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _service;
        public UsersController(IUserService service)
        {
            _service = service;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await _service.GetAllAsync();

            return Ok(users);
        }

        [Authorize(Roles ="Admin")]
        [HttpGet("{Id}")]

        public async Task<IActionResult> GetById(string Id)
        {
            var user = await _service.GetByIdAsync(Id);
            return Ok(user);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{Id}/role")]
        public async Task<IActionResult> UpdateRole(string Id, UpdateUserRoleDto dto)
        {
            await _service.UpdateRoleAsync(Id, dto.Role);
            return NoContent();
        }


        [Authorize(Roles = "Admin")]
        [HttpPut("{Id}/status")]

        public async Task<IActionResult> UpdateStatus(string Id, [FromQuery] bool IsActive)
        {
            await _service.UpdateStatusAsync(Id, IsActive);
            return NoContent();
        }
    }
}
