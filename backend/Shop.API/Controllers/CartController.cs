using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Shop.Application.DTOs.Carts;
using Shop.Application.Interfaces.Carts.Service;

namespace Shop.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly ICartService _service;

        public CartController(ICartService service)
        {
            _service = service;
        }


        [HttpGet]
        public async Task<IActionResult> GetCart()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            Console.WriteLine($"CART USER ID: {userId}");
            if (userId == null)
                return Unauthorized(); 
            var cart = await _service.GetCartAsync(userId);
            return Ok(cart);
        }

        [HttpPost("items")]

        public async Task<IActionResult> AddItem(AddToCartDto dto)
        {

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);   

            if (userId == null)
                return Unauthorized();

            var cart = await _service.AddItemAsync(userId, dto);

            return Ok(cart);
        }

        [HttpPut("items/{courseId}")] 
        public async Task<IActionResult> UpdateItem(string courseId, UpdateCartItemDto dto) 
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) 
                return Unauthorized(); 
            var cart = await _service.UpdateItemAsync(userId, courseId, dto); 
            return Ok(cart); 
        }

        [HttpDelete("items/{courseId}")] 
        public async Task<IActionResult> RemoveItem(string courseId) 
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();
            var cart = await _service.RemoveItemAsync(userId, courseId);
            return Ok(cart); 
        }

        [HttpDelete] 
        public async Task<IActionResult> ClearCart() 
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) 
                return Unauthorized();
            await _service.ClearCartAsync(userId);
            return NoContent(); 
        }

    }
}
