
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shop.Application.DTOs.Instructors;
using Shop.Application.Interfaces.File;
using Shop.Application.Interfaces.Instructors.Services;

namespace Shop.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class InstructorController : ControllerBase
{
    private readonly IInstructorService _service;
    private readonly IFileStorageService _fileStorage;
    public InstructorController(
     IInstructorService service,
     IFileStorageService fileStorage)
    {
        _service = service;
        _fileStorage = fileStorage;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var instructors = await _service.GetAllAsync();

        return Ok(instructors);
    }

    [Authorize(Roles = "Instructor")]
    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        var userId = User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

        if (userId == null)
            return Unauthorized();

        var profile = await _service.GetByUserIdAsync(userId);

        if (profile == null)
            return NotFound(
                "Instructor profile does not exist."
            );

        return Ok(profile);
    }

    [HttpGet("{Id}")]
    public async Task<IActionResult> GetById(string Id)
    {
        var instructor = await _service.GetByIdAsync(Id);

        if (instructor == null)
            return NotFound(
                "Instructor profile does not exist."
            );

        return Ok(instructor);
    }

    [HttpGet("slug/{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var instructor = await _service.GetBySlugAsync(slug);

        if (instructor == null)
            return NotFound(
                "Instructor profile does not exist."
            );

        return Ok(instructor);
    }

    [Authorize(Roles = "Instructor")]
    [HttpPost("profile")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> CreateProfile(
        [FromForm] CreateInstructorProfileDto instructorDto)
    {
        var userId = User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

        if (userId == null)
            return Unauthorized();

        var profile = await _service.CreateAsync(
            userId,
            instructorDto
        );

        return Ok(profile);
    }
    [Authorize(Roles = "Admin")]
    [HttpPost("{userId}")]
    public async Task<IActionResult> CreateInstructorByAdmin(
    string userId,
    CreateInstructorProfileDto instructorDto)
    {
        var profile = await _service.CreateByAdminAsync(
            userId,
            instructorDto
        );

        return Ok(profile);
    }

    [Authorize(Roles = "Instructor")]
    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile(
        UpdateInstructorProfileDto instructorDto)
    {
        var userId = User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

        if (userId == null)
            return Unauthorized();

        var profile = await _service.UpdateAsync(
            userId,
            instructorDto
        );

        return Ok(profile);
    }



    [Authorize(Roles = "Instructor")]
    [HttpPost("profile/avatar")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UploadAvatar(
        IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("Please select an image.");

        var userId = User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

        if (userId == null)
            return Unauthorized();

        var avatarId = await _fileStorage.UploadFileAsync(file);

        var profile = await _service.UpdateAvatarAsync(
            userId,
            avatarId
        );

        return Ok(profile);
    }



    [Authorize(Roles = "Admin")]
    [HttpPut("{instructorId}")]
    public async Task<IActionResult> UpdateInstructor(
    string instructorId,
    UpdateInstructorProfileDto instructorDto)
    {
        var profile = await _service.UpdateByAdminAsync(
            instructorId,
            instructorDto
        );

        return Ok(profile);
    }
}

