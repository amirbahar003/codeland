using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shop.Application.Enums;
using Shop.Domain.Entities;

namespace Shop.Application.Interfaces.Categories.Repositories
{
    public interface ICategoryRepository
    {
        Task<List<Category>> GetAllAsync();

        Task<bool> ExistsByNameAsync(string name, string? excludeId = null);
        Task<Category?> GetByIdAsync(string Id);

        Task<Category> CreateAsync(Category category);

        Task<Category?> UpdateAsync(string Id, Category category);

        Task<CategoryDeleteResult> DeleteAsync(string Id);
    }
}
