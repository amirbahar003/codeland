using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shop.Domain.Entities;

namespace Shop.Application.Interfaces.Discounts.Repository
{
    public interface IDiscountRepository
    {
        Task<Discount?> GetByIdAsync(string Id);

        Task<Discount?> GetByCodeAsync(string code);

        Task<Discount?> GetGlobalAsync();
        Task<Discount?> GetForCourseAsync(string courseId);
        Task<List<Discount>> GetAllAsync();

        Task CreateAsync(Discount discount);

        Task UpdateAsync(Discount discount);

        Task DeleteAsync(string Id);
    }
}
