using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shop.Application.DTOs.Discounts;
using Shop.Domain.Entities;

namespace Shop.Application.Interfaces.Discounts.Service
{
    public interface IDiscountService
    {
        Task<Discount> CreateAsync(CreateDiscountDto dto);
        Task<Discount?> GetGlobalAsync();

        Task<Discount?> GetForCourseAsync(string courseId);
        Task<Discount?> GetByCodeAsync(string code);

        Task<Discount> UpdateAsync(string Id, UpdateDiscountDto dto);
        Task<bool> DeleteAsync(string Id);
        Task<List<Discount>> GetAllAsync();

        Task<DiscountResultDto> ApplyAsync(ApplyDiscountDto dto);
    }
}
