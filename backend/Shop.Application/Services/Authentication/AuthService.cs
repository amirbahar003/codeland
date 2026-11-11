using System.Security.Cryptography;
using Microsoft.Extensions.Logging;
using Shop.Application.DTOs.Auth;
using Shop.Application.Exceptions;
using Shop.Application.Interfaces.Authentication;

using Shop.Application.Interfaces.Users.Repositories;
using Shop.Application.Interfaces.Wallets.Service;
using Shop.Domain.Entities;
using Shop.Domain.Enums;

namespace Shop.Application.Services.Authentication
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _repository;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IJwtTokenService _jwtTokenService;
        private readonly IWalletService _walletService;
        private readonly ILogger<AuthService> _logger;


        public AuthService(IUserRepository repository, IPasswordHasher passwordHasher, IJwtTokenService jwtTokenService, IWalletService walletService, ILogger<AuthService> logger)
        {
            _repository = repository;
            _passwordHasher = passwordHasher;
            _jwtTokenService = jwtTokenService;
            _walletService = walletService;
            _logger = logger;
        }
        public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
        {
            var emailOrMobile = dto.EmailOrMobile.Trim();

            User? user;

            if (emailOrMobile.Contains("@"))
            {
                var email = emailOrMobile.ToLowerInvariant();

                user = await _repository.GetByEmailAsync(email);
            }
            else
            {
                user = await _repository.GetByMobileAsync(emailOrMobile);
            }

            if (user == null)
                throw new UnauthorizedAccessException("Invalid email or password.");
            if (!user.IsActive)
                throw new UnauthorizedAccessException("User account is inactive.");

            var passwordValid = _passwordHasher.Verify(dto.Password, user.PasswordHash);

            if (!passwordValid)
                throw new UnauthorizedAccessException("Invalid email or password.");

            var jwt = _jwtTokenService.GenerateToken(user);

            return new AuthResponseDto
            {
                Token = jwt.Token,
                ExpiresAt = jwt.ExpiresAt,
                UserId = user.Id,
                Username = user.Username,
                Mobile = user.Mobile,
                Role = user.Role.ToString()
            };


        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
        {
            var email = dto.Email.Trim().ToLowerInvariant();
            var userName = dto.Username.Trim();

            // 1. Check duplicate email
            var exists = await _repository.ExistsByEmailAsync(email);

            if (exists)
                throw new ConflictException(
                    "User with this email already exists.");

            // 2. Validate referral code
            User? referrer = null;

            if (!string.IsNullOrWhiteSpace(dto.ReferralCode))
            {
                var inputCode = dto.ReferralCode.Trim().ToUpperInvariant();

                referrer = await _repository.GetByReferralCodeAsync(inputCode);

                if (referrer == null)
                    throw new ConflictException("Invalid referral code.");
            }

            // 3. Generate referral code for new user
            var referralCode = await GenerateReferralCodeAsync();

            // 4. Hash password
            var passwordHash = _passwordHasher.Hash(dto.Password);

            // 5. Create user
            var user = new User
            {
                Username = userName,
                Email = email,
                Mobile = dto.Mobile.Trim(),
                PasswordHash = passwordHash,
                Role = UserRole.Student,
                CreatedAt = DateTime.UtcNow,

                ReferralCode = referralCode,
                ReferredByUserId = referrer?.Id
            };

            // 6. Save user
            var createdUser = await _repository.CreateAsync(user);

            // 7. Generate JWT
            var jwt = _jwtTokenService.GenerateToken(createdUser);

            // 8. Calculate successful referrals
            // 8. Increase successful referrals
            if (referrer != null)
            {
                var updatedReferrer =
                    await _repository.IncrementSuccessfulReferralsAsync(referrer.Id);

                if (updatedReferrer == null)
                    throw new NotFoundException("Referrer not found.");

                var referralCount = updatedReferrer.SuccessfulReferrals;

                // 9. Reward every 10 successful referrals
                var totalRewards = referralCount / 10;

                for (int i = 1; i <= totalRewards; i++)
                {
                    var referenceId = $"REFERRAL-{referrer.Id}-{i}";

                    try
                    {
                        await _walletService.AddFundsAsync(
                            referrer.Id,
                            100000,
                            $"Referral reward number {i}",
                            referenceId
                        );
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(
                            ex,
                            "Referral reward failed. ReferrerId: {ReferrerId}, RewardNumber: {RewardNumber}",
                            referrer.Id,
                            i
                        );

                        break;
                    }
                }
            }
            return new AuthResponseDto
            {
                Token = jwt.Token,
                ExpiresAt = jwt.ExpiresAt,
                UserId = createdUser.Id,
                Username = createdUser.Username,
                Mobile = createdUser.Mobile,
                Role = createdUser.Role.ToString()
            };
        }



        private async Task<string> GenerateReferralCodeAsync()
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

            while (true)
            {
                var randomBytes = RandomNumberGenerator.GetBytes(10);

                var code = new string(randomBytes.Select(b => chars[b % chars.Length]).ToArray()
                );

                if (!await _repository.ExistsByReferralCodeAsync(code))
                    return code;
            }
        }


    }
}
