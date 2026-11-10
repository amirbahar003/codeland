using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;
using Shop.Application.Validation;

namespace Shop.Application.DTOs.Courses;

public class UpdateCourseDto
{
    [Required]
    [StringLength(200)]
    public string Title { get; set; } = null!;

    [Required]
    [StringLength(2000)]
    public string Description { get; set; } = null!;

    [Range(typeof(decimal), "0", "79228162514264337593543950335",
        ErrorMessage = "Price must be greater than or equal to 0.")]
    public decimal Price { get; set; }

    [FileValidation]
    public IFormFile? Thumbnail { get; set; }

    [Required]
    [RegularExpression(
        "^[a-fA-F0-9]{24}$",
        ErrorMessage = "CategoryId must be a valid MongoDB ObjectId."
    )]
    public string CategoryId { get; set; } = null!;

    [Required]
    [RegularExpression(
        "^(Beginner|Intermediate|Advanced)$",
        ErrorMessage = "Level must be Beginner, Intermediate, or Advanced."
    )]
    public string Level { get; set; } = "Beginner";

    [Range(1, int.MaxValue,
        ErrorMessage = "DurationMinutes must be greater than 0.")]
    public int DurationMinutes { get; set; }

    public List<string> PrerequisiteCourseIds { get; set; } = new();
}