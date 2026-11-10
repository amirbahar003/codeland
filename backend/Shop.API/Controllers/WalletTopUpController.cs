
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shop.Application.DTOs.Wallets;
using Shop.Application.Interfaces.Wallets.Service;

namespace Shop.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class WalletTopUpController : ControllerBase
    {
        private readonly IWalletTopUpService _topUpService;

        public WalletTopUpController(
            IWalletTopUpService topUpService)
        {
            _topUpService = topUpService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateTopUp(
            [FromBody] CreateWalletTopUpDto dto)
        {
            var userId = User.FindFirstValue(
                ClaimTypes.NameIdentifier);

            if (string.IsNullOrWhiteSpace(userId))
                return Unauthorized();

            var topUp = await _topUpService.CreateAsync(
                userId,
                dto);

            return Ok(topUp);
        }

        [HttpGet("my")]
        public async Task<IActionResult> GetMyTopUps()
        {
            var userId = User.FindFirstValue(
                ClaimTypes.NameIdentifier);

            if (string.IsNullOrWhiteSpace(userId))
                return Unauthorized();

            var topUps = await _topUpService
                .GetMyTopUpsAsync(userId);

            return Ok(topUps);
        }


        [AllowAnonymous]
        [HttpGet("callback")]
        public async Task<IActionResult> Callback([FromQuery] string? Authority,[FromQuery] string? Status)
        {
            if (string.IsNullOrWhiteSpace(Authority))
                return BadRequest("Payment authority is missing.");

            if (!string.Equals(
                Status,
                "OK",
                StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest("Payment was not successful.");
            }

            var result = await _topUpService.VerifyAsync(Authority);

            return Ok(result);
        }

    }
}
