using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Shop.Application.DTOs.Payments;
using Shop.Application.Interfaces.Payments.Service;

namespace Shop.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        private readonly IPaymentService _service;
        public PaymentsController(IPaymentService service)
        {
            _service = service;
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create(CreatePaymentDto paymentDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
                return Unauthorized();
            var payment = await _service.CreateAsync(userId, paymentDto);
            return Ok(payment);
        }

        [AllowAnonymous]
        [HttpGet("callback")]
        public async Task<IActionResult> Callback([FromQuery] string? Authority, [FromQuery] string? Status) 
        {
            if (string.IsNullOrWhiteSpace(Authority)) 
                return BadRequest("Payment authority is missing."); 
            if (!string.Equals(Status, "OK", StringComparison.OrdinalIgnoreCase)) 
            {
                return BadRequest("Payment was canceled or failed.");
            }
            var payment = await _service.VerifyAsync(new VerifyPaymentDto 
            {
                Authority = Authority 
            });
            return Ok(payment); 
        }



        [Authorize]
        [HttpGet("my")]
        public async Task<IActionResult> GetMyPayments()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
                return Unauthorized();

            var payments = await _service.GetMyPaymentsAsync(userId);

            return Ok(payments);
        }

    }
}
