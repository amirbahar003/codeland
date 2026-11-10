using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shop.Application.DTOs.Carts;
using Shop.Domain.Entities;

namespace Shop.Application.Interfaces.Carts.Service
{
    public interface ICartService
    {
        Task<Cart> GetCartAsync(string userId);
        Task<Cart> AddItemAsync(string userId, AddToCartDto dto); 
        Task<Cart> UpdateItemAsync(string userId, string courseId, UpdateCartItemDto dto);
        Task<Cart> RemoveItemAsync(string userId, string courseId); Task ClearCartAsync(string userId);
    }
}
