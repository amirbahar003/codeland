using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shop.Application.DTOs.Categories;

namespace Shop.Application.Interfaces.Categories.Services
{
    public interface ICategoryService
    {
        Task<List<CategoryDto>> GetAllAsync();
        Task<CategoryDto> CreateAsync(CreateCategoryDto categoryDto);
        Task<CategoryDto> GetByIdAsync(string Id);
        Task<CategoryDto> UpdateAsync(string Id, UpdateCategoryDto categoryDto);
        Task DeleteAsync(string Id);
    }
}
