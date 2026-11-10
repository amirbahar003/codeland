using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shop.Domain.Entities;

namespace Shop.Application.Interfaces.Payments.Repository
{
    public interface IPaymentRepository
    {
        Task<Payment> CreateAsync(Payment payment);
        Task<Payment?> GetByIdAsync(string Id);
        Task<List<Payment>> GetByUserIdAsync(string userId);
        Task<Payment?> GetByAuthorityAsync(string authority);
        Task<Payment?> UpdateAsync(string Id, Payment payment);
    }
}
