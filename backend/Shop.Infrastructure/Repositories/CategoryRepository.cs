using System.Text.RegularExpressions;
using MongoDB.Driver;
using Shop.Application.Enums;
using Shop.Application.Interfaces;
using Shop.Application.Interfaces.Categories.Repositories;
using Shop.Domain.Entities;
using Shop.Infrastructure.Data;
using Shop.Infrastructure.Helpers;

namespace Shop.Infrastructure.Repositories;

public class CategoryRepository : ICategoryRepository
{
    private readonly IMongoCollection<Category> _categories;
    private readonly IMongoCollection<Course> _courses;

    public CategoryRepository(MongoDbContext context)
    {
        _categories = context.GetCollection<Category>("categories");
        _courses = context.GetCollection<Course>("courses");
    }

    public async Task<Category> CreateAsync(Category category)
    {
        await _categories.InsertOneAsync(category);

        return category;
    }

    public async Task<CategoryDeleteResult> DeleteAsync(string id)
    {
        ObjectIdValidator.Validate(id);

        var categoryExists = await _categories
            .Find(c => c.Id == id)
            .AnyAsync();

        if (!categoryExists)
            return CategoryDeleteResult.NotFound;

        var hasCourses = await _courses
            .Find(c => c.CategoryId == id)
            .AnyAsync();

        if (hasCourses)
            return CategoryDeleteResult.HasCourses;

        await _categories.DeleteOneAsync(
            c => c.Id == id
        );

        return CategoryDeleteResult.Deleted;
    }

    public async Task<bool> ExistsByNameAsync(
        string name,
        string? excludeId = null)
    {
        var filter = Builders<Category>.Filter.Regex(
            c => c.Name,
            new MongoDB.Bson.BsonRegularExpression(
                $"^{Regex.Escape(name)}$",
                "i"
            )
        );

        if (!string.IsNullOrWhiteSpace(excludeId))
        {
            filter &= Builders<Category>.Filter.Ne(
                c => c.Id,
                excludeId
            );
        }

        return await _categories
            .Find(filter)
            .AnyAsync();
    }

    public async Task<List<Category>> GetAllAsync()
    {
        var categories = await _categories
            .Find(_ => true)
            .ToListAsync();

        var categoryIds = categories
            .Select(c => c.Id)
            .ToList();

        var courses = await _courses
            .Find(c => categoryIds.Contains(c.CategoryId))
            .ToListAsync();

        var coursesByCategory = courses
            .GroupBy(c => c.CategoryId)
            .ToDictionary(
                g => g.Key,
                g => g.ToList()
            );

        foreach (var category in categories)
        {
            category.Courses =
                coursesByCategory.TryGetValue(
                    category.Id,
                    out var categoryCourses)
                    ? categoryCourses
                    : new List<Course>();
        }

        return categories;
    }

    public async Task<Category?> GetByIdAsync(string id)
    {
        ObjectIdValidator.Validate(id);

        var category = await _categories
            .Find(c => c.Id == id)
            .FirstOrDefaultAsync();

        if (category == null)
            return null;

        var courses = await _courses
            .Find(c => c.CategoryId == category.Id)
            .ToListAsync();

        category.Courses = courses;

        return category;
    }

    public async Task<Category?> UpdateAsync(
        string Id,
        Category category)
    {
        ObjectIdValidator.Validate(Id);

        category.Id = Id;

        var result = await _categories.ReplaceOneAsync(
            c => c.Id == Id,
            category
        );

        if (result.MatchedCount == 0)
            return null;

        var courses = await _courses
            .Find(c => c.CategoryId == Id)
            .ToListAsync();

        category.Courses = courses;

        return category;
    }
}