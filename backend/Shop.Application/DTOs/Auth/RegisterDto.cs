using System.ComponentModel.DataAnnotations;

namespace Shop.Application.DTOs.Auth
{
    public class RegisterDto
    {
        [Required]
        [StringLength(50)]
        public string Username { get; set; } = null!;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = null!;

        [Required]
        [MinLength(6)]
        public string Password { get; set; } = null!;

        [Required]
        [Phone]
        public string Mobile { get; set; } = null!;

        [StringLength(20)]
        public string? ReferralCode { get; set; }
    }
}