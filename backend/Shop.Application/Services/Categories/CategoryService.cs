using Shop.Application.DTOs.Categories;
using Shop.Application.Enums;
using Shop.Application.Exceptions;
using Shop.Application.Interfaces.Categories.Repositories;
using Shop.Application.Interfaces.Categories.Services;
using Shop.Application.Mappers;
using Shop.Domain.Entities;

namespace Shop.Application.Services.Categories;

public class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _repository;

    public CategoryService(ICategoryRepository repository)
    {
        _repository = repository;
    }

    public async Task<CategoryDto> CreateAsync(
        CreateCategoryDto categoryDto)
    {
        var name = categoryDto.Name.Trim();

        var exists = await _repository.ExistsByNameAsync(name);

        if (exists)
        {
            throw new ConflictException(
                "Category with this name already exists.");
        }

        var category = new Category
        {
            Name = name
        };

        var createdCategory = await _repository.CreateAsync(category);

        return CategoryMapper.ToDto(createdCategory);
    }

    public async Task DeleteAsync(string Id)
    {
        var result = await _repository.DeleteAsync(Id);

        if (result == CategoryDeleteResult.NotFound)
        {
            throw new NotFoundException(
                "Category does not exist.");
        }

        if (result == CategoryDeleteResult.HasCourses)
        {
            throw new ConflictException(
                "Cannot delete category because it has courses.");
        }
    }

    public async Task<List<CategoryDto>> GetAllAsync()
    {
        var categories = await _repository.GetAllAsync();

        return categories
            .Select(CategoryMapper.ToDto)
            .ToList();
    }

    public async Task<CategoryDto> GetByIdAsync(string Id)
    {
        var category = await _repository.GetByIdAsync(Id);

        if (category == null)
        {
            throw new NotFoundException(
                "Category does not exist.");
        }

        return CategoryMapper.ToDto(category);
    }

    public async Task<CategoryDto> UpdateAsync(
        string Id,
        UpdateCategoryDto categoryDto)
    {
        var name = categoryDto.Name.Trim();

        var exists = await _repository
            .ExistsByNameAsync(name, Id);

        if (exists)
        {
            throw new ConflictException(
                "Category with this name already exists.");
        }

        var category = new Category
        {
            Name = name
        };

        var updatedCategory = await _repository.UpdateAsync(
            Id,
            category);

        if (updatedCategory == null)
        {
            throw new NotFoundException(
                "Category does not exist.");
        }

        return CategoryMapper.ToDto(updatedCategory);
    }


}

