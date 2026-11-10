using Microsoft.AspNetCore.Identity;
using Shop.Application.Interfaces.Authentication;
using Shop.Domain.Entities;

namespace Shop.Infrastructure.Services
{
    public class PasswordHasherService : IPasswordHasher
    {
        private readonly PasswordHasher<User> _passwordHasher;

        public PasswordHasherService()
        {
            _passwordHasher = new PasswordHasher<User>();
        }
        public string Hash(string password)
        {
            var user = new User();
            return _passwordHasher.HashPassword(user, password);
        }

        public bool Verify(string password, string passwordHash)
        {
            var user = new User();
            var result = _passwordHasher.VerifyHashedPassword(user, passwordHash, password);
            return result == PasswordVerificationResult.Success ||
                result == PasswordVerificationResult.SuccessRehashNeeded;
        }
    }
}
