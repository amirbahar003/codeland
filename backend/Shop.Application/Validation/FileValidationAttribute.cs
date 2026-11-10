using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace Shop.Application.Validation
{
    public class FileValidationAttribute : ValidationAttribute
    {
        private readonly string[] _allowedExtensions =
        {
            ".jpg",
            ".jpeg",
            ".png",
            ".webp"
        };

        private const long MaxFileSize = 5 * 1024 * 1024; // 5 MB

        protected override ValidationResult? IsValid(
            object? value,
            ValidationContext validationContext)
        {
            if (value is not IFormFile file)
                return ValidationResult.Success;

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

            if (!_allowedExtensions.Contains(extension))
            {
                return new ValidationResult(
                    "Only JPG, JPEG, PNG and WEBP images are allowed.");
            }

            if (file.Length > MaxFileSize)
            {
                return new ValidationResult(
                    "Image size must not exceed 5 MB.");
            }

            using var stream = file.OpenReadStream();

            var buffer = new byte[12];

            var bytesRead = stream.Read(buffer, 0, buffer.Length);

            if (!IsValidImageSignature(buffer, bytesRead))
            {
                return new ValidationResult(
                    "The uploaded file is not a valid image.");
            }

            return ValidationResult.Success;
        }

        private static bool IsValidImageSignature(byte[] buffer, int length)
        {
            // JPEG
            if (length >= 3 &&
                buffer[0] == 0xFF &&
                buffer[1] == 0xD8 &&
                buffer[2] == 0xFF)
            {
                return true;
            }

            // PNG
            if (length >= 8 &&
                buffer[0] == 0x89 &&
                buffer[1] == 0x50 &&
                buffer[2] == 0x4E &&
                buffer[3] == 0x47 &&
                buffer[4] == 0x0D &&
                buffer[5] == 0x0A &&
                buffer[6] == 0x1A &&
                buffer[7] == 0x0A)
            {
                return true;
            }

            // WEBP
            if (length >= 12 &&
                buffer[0] == 'R' &&
                buffer[1] == 'I' &&
                buffer[2] == 'F' &&
                buffer[3] == 'F' &&
                buffer[8] == 'W' &&
                buffer[9] == 'E' &&
                buffer[10] == 'B' &&
                buffer[11] == 'P')
            {
                return true;
            }

            return false;
        }
    }
}