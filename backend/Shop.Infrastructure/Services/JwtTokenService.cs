using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Shop.Application.Interfaces.Authentication;
using Shop.Domain.Entities;
using Shop.Infrastructure.Data;

namespace Shop.Infrastructure.Services;

public class JwtTokenService : IJwtTokenService
{
    private readonly JwtSettings _settings;

    public JwtTokenService(IOptions<JwtSettings> options)
    {
        _settings = options.Value;
    }

    public (string Token, DateTime ExpiresAt) GenerateToken(User user)
    {
        var expiresAt = DateTime.UtcNow
            .AddMinutes(_settings.ExpirationMinutes);

        var claims = new List<Claim>
{
    new(JwtRegisteredClaimNames.Sub, user.Id),
    new(ClaimTypes.NameIdentifier, user.Id),
    new(JwtRegisteredClaimNames.Email, user.Email),
    new(ClaimTypes.Name, user.Username),
    new(ClaimTypes.Role, user.Role.ToString()),
    new("Mobile", user.Mobile),
    new("AvatarId", user.AvatarId ?? "")
};
        //sign + validate
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_settings.SecretKey)
        );

        //JWT را با این Key و الگوریتم HMAC-SHA256 امضا کن.

        var credentials = new SigningCredentials(
            key,
            SecurityAlgorithms.HmacSha256
        );

        var token = new JwtSecurityToken(
            issuer: _settings.Issuer,
            audience: _settings.Audience,
            claims: claims,
            expires: expiresAt,
            signingCredentials: credentials
        );

        var tokenString = new JwtSecurityTokenHandler()
            .WriteToken(token);

        return (tokenString, expiresAt);
    }
}