using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shop.Domain.Entities;

namespace Shop.Application.Interfaces.Carts.Repository
{
    public interface ICartRepository
    {
        Task<Cart?> GetByUserIdAsync(string userId);
        Task<Cart> CreateAsync(Cart cart);
        Task UpdateAsync(Cart cart); 
        Task DeleteAsync(string userId);
    }
}
