using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shop.Application.DTOs.Carts;
using Shop.Application.Exceptions;
using Shop.Application.Interfaces.Carts.Repository;
using Shop.Application.Interfaces.Carts.Service;
using Shop.Application.Interfaces.Courses.Repositories;
using Shop.Application.Interfaces.Users.Repositories;
using Shop.Domain.Entities;

namespace Shop.Application.Services.Carts
{
    public class CartService : ICartService
    {
        private readonly ICartRepository _cartRepository;
        private readonly ICourseRepository _courseRepository;
        public CartService(ICartRepository cartRepository, ICourseRepository courseRepository)
        {
            _cartRepository = cartRepository;
            _courseRepository = courseRepository;
        }


        public async Task<Cart> AddItemAsync(string userId, AddToCartDto dto)
        {
            var course = await _courseRepository.GetByIdAsync(dto.CourseId);
            if (course == null) 
                throw new NotFoundException("Course does not exist.");
            var cart = await _cartRepository.GetByUserIdAsync(userId);
            if (cart == null) 
            {
                cart = new Cart 
                
                {
                    UserId = userId
                }; 
            }
            var existingItem = cart.Items.FirstOrDefault(item => item.CourseId == dto.CourseId);
            if (existingItem == null)
            {
                cart.Items.Add(new CartItem 
                {
                    CourseId = dto.CourseId, Quantity = 1 
                });
            }
            if (string.IsNullOrWhiteSpace(cart.Id)) 
            {
                return await _cartRepository.CreateAsync(cart);
            }
            await _cartRepository.UpdateAsync(cart); return cart;
        }

        public async Task ClearCartAsync(string userId)
        {
            var cart = await _cartRepository.GetByUserIdAsync(userId);
            if (cart == null) throw new NotFoundException("Cart does not exist.");
            await _cartRepository.DeleteAsync(userId);
        }

        public async Task<Cart> GetCartAsync(string userId)
        {
            var cart = await _cartRepository.GetByUserIdAsync(userId);
            if (cart != null)
                return cart;
            var newCart = new Cart
            {
                UserId = userId
            };
            return await _cartRepository.CreateAsync(newCart);
        }

        public async Task<Cart> RemoveItemAsync(string userId, string courseId)
        {
            var cart = await _cartRepository.GetByUserIdAsync(userId);
            if (cart == null) 
                throw new NotFoundException("Cart does not exist."); 
            var item = cart.Items.FirstOrDefault(item => item.CourseId == courseId); 
            if (item == null) throw new NotFoundException("Course does not exist in cart.");
            cart.Items.Remove(item); await _cartRepository.UpdateAsync(cart);
            return cart;
        }

        public async Task<Cart> UpdateItemAsync(
        string userId,
        string courseId,
        UpdateCartItemDto dto)
        {
            var cart = await _cartRepository.GetByUserIdAsync(userId);

            if (cart == null)
                throw new NotFoundException("Cart does not exist.");

            var item = cart.Items.FirstOrDefault(item => item.CourseId == courseId);

            if (item == null)
                throw new NotFoundException("Course does not exist in cart.");

            if (dto.Quantity <= 0)
            {
                cart.Items.Remove(item);
            }
            else
            {
                item.Quantity = dto.Quantity;
            }

            await _cartRepository.UpdateAsync(cart);

            return cart;
        }
    }
}
