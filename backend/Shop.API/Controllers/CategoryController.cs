using Microsoft.AspNetCore.Mvc;
using Shop.Application.DTOs.Categories;
using Shop.Application.Interfaces.Categories.Services;

namespace Shop.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoryController : ControllerBase
{
    private readonly ICategoryService _service;

    public CategoryController(ICategoryService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _service.GetAllAsync();

        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        CreateCategoryDto categoryDto)
    {
        var result = await _service.CreateAsync(categoryDto);

        return CreatedAtAction(
            nameof(GetById),
            new { id = result.Id },
            result
        );
    }

    [HttpGet("{Id}")]
    public async Task<IActionResult> GetById(string Id)
    {
        var result = await _service.GetByIdAsync(Id);

        return Ok(result);
    }

    [HttpPut("{Id}")]
    public async Task<IActionResult> Update(
        string Id,
        UpdateCategoryDto categoryDto)
    {
        var result = await _service.UpdateAsync(
            Id,
            categoryDto
        );

        return Ok(result);
    }

    [HttpDelete("{Id}")]
    public async Task<IActionResult> Delete(string Id)
    {
        await _service.DeleteAsync(Id);

        return NoContent();
    }
}