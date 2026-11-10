using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shop.Application.DTOs.Chapters;
using Shop.Application.Interfaces.Chapters.Services;

namespace Shop.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChapterController : ControllerBase
{
    private readonly IChapterService _service;

    public ChapterController(IChapterService service)
    {
        _service = service;
    }

    // POST: api/Chapter
    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create(CreateChapterDto dto)
    {
        var createdChapter = await _service.CreateAsync(dto);

        return CreatedAtAction(
            nameof(GetById),
            new { Id = createdChapter.Id },
            createdChapter
        );
    }

    // GET: api/Chapter/course/{courseId}
    [HttpGet("course/{courseId}")]
    public async Task<IActionResult> GetAllByCourseId(string courseId)
    {
        var chapters = await _service
            .GetAllByCourseIdAsync(courseId);

        return Ok(chapters);
    }

    // GET: api/Chapter/{id}
    [HttpGet("{Id}")]
    public async Task<IActionResult> GetById(string Id)
    {
        var chapter = await _service
            .GetByIdAsync(Id);

        return Ok(chapter);
    }

    // PUT: api/Chapter/{id}
    [Authorize]
    [HttpPut("{Id}")]
    public async Task<IActionResult> Update(
        string Id,
        UpdateChapterDto dto)
    {
        var updatedChapter = await _service
            .UpdateAsync(Id, dto);

        return Ok(updatedChapter);
    }

    // DELETE: api/Chapter/{id}
    [Authorize]
    [HttpDelete("{Id}")]
    public async Task<IActionResult> Delete(string Id)
    {
        await _service.DeleteAsync(Id);

        return NoContent();
    }
}

