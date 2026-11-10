using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shop.Application.DTOs.Courses;
using Shop.Application.Interfaces.Courses.Services;

namespace Shop.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CoursesController : ControllerBase
{
    private readonly ICourseService _service;

    public CoursesController(ICourseService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] CourseQueryDto query)
    {
        var result = await _service.GetAllAsync(
            query.Page,
            query.PageSize,
            query.Search,
            query.CategoryId,
            query.MinPrice,
            query.MaxPrice,
            query.SortBy,
            query.SortOrder
        );

        return Ok(result);
    }

    [Authorize(Roles = "Admin,Instructor")]
    [HttpPost]
    public async Task<IActionResult> Create(
        [FromForm] CreateCourseDto courseDto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); 
        if (userId == null) 
            return Unauthorized();
        var result = await _service.CreateAsync(userId, courseDto);
        return CreatedAtAction(nameof(GetById),
            new { Id = result.Id },
            result
            );
    }

    [HttpGet("{Id}")]
    public async Task<IActionResult> GetById(string Id)
    {
        var result = await _service.GetByIdAsync(Id);

        return Ok(result);
    }

    [HttpGet("slug/{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var result = await _service.GetBySlugAsync(slug);
        if (result == null)
            return NotFound("Course does not exist.");
        return Ok(result);
    }

    [Authorize(Roles =("Admin"))]
    [HttpPut("{courseId}/instructor/{instructorId}")]
    public async Task<IActionResult> AssignInstructor(string courseId,string instructorId)
    {
        var result = await _service.AssignInstructorAsync(courseId, instructorId);
        return Ok(result);
    }



    [Authorize(Roles = "Admin")]
    [HttpPut("{Id}")]
    public async Task<IActionResult> Update(
        string Id,
        [FromForm] UpdateCourseDto courseDto)
    {
        var result = await _service.UpdateAsync(Id, courseDto);

        return Ok(result);
    }


    [Authorize(Roles = "Admin")]
    [HttpDelete("{Id}")]
    public async Task<IActionResult> Delete(string Id)
    {
        await _service.DeleteAsync(Id);

        return NoContent();
    }
}