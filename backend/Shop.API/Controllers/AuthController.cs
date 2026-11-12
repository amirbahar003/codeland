using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Shop.Application.DTOs.Auth;
using Shop.Application.Interfaces.Authentication;

namespace Shop.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _service;

    public AuthController(IAuthService service)
    {
        _service = service;
    }



    [Authorize]
    [HttpGet("me")]
    public IActionResult Me()
    {


        return Ok(new
        {
            UserId = User.FindFirstValue(ClaimTypes.NameIdentifier),
            Username = User.FindFirstValue(ClaimTypes.Name),
            Email = User.FindFirstValue(ClaimTypes.Email),
            Mobile = User.FindFirstValue("Mobile"),
            Role = User.FindFirstValue(ClaimTypes.Role),
            AvatarId = User.FindFirstValue("AvatarId"),
        });
    }


    [Authorize]
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword(ChangePasswordDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        await _service.ChangePasswordAsync(userId, dto);

        return Ok(new
        {
            message = "رمز عبور با موفقیت تغییر کرد."
        });
    }



    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        var result = await _service.RegisterAsync(dto);

        Response.Cookies.Append(
            "accessToken",
            result.Token,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = result.ExpiresAt
            }
        );

        return Ok(new
        {
            result.UserId,
            result.Username,
            result.Mobile,
            result.Role,
            result.ExpiresAt
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var result = await _service.LoginAsync(dto);

        Response.Cookies.Append(
            "accessToken",
            result.Token,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = result.ExpiresAt
            }
        );

        return Ok(new
        {
            result.UserId,
            result.Username,
            result.Role,
            result.ExpiresAt
        });
    }


    [Authorize]
    [HttpPost("logout")]
    public IActionResult Logout()
    {
        Response.Cookies.Delete(
            "accessToken",
            new CookieOptions
            {
                Secure = true,
                SameSite = SameSiteMode.None,
                Path = "/"
            }
        );

        return Ok(new
        {
            message = "با موفقیت از حساب کاربری خارج شدید."
        });
    }
}