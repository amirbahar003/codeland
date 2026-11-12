
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shop.Application.Interfaces.Wallets.Service;

namespace Shop.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class WalletController : ControllerBase
    {
        private readonly IWalletService _walletService;

        public WalletController(IWalletService walletService)
        {
            _walletService = walletService;
        }

        [HttpGet]
        public async Task<IActionResult> GetWallet()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrWhiteSpace(userId))
                return Unauthorized();

            var wallet = await _walletService.GetOrCreateWalletAsync(userId);

            return Ok(wallet);
        }

        [HttpGet("transactions")]
        public async Task<IActionResult> GetTransactions()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrWhiteSpace(userId))
                return Unauthorized();

            var transactions = await _walletService.GetTransactionsAsync(userId);

            return Ok(transactions);
        }


        [HttpGet("transactions/unseen-count")]
        public async Task<IActionResult> GetUnseenTransactionsCount()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrWhiteSpace(userId))
                return Unauthorized();

            var count = await _walletService.GetUnseenCountAsync(userId);

            return Ok(count);
        }

        [HttpPatch("transactions/mark-as-seen")]
        public async Task<IActionResult> MarkTransactionsAsSeen()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrWhiteSpace(userId))
                return Unauthorized();

            await _walletService.MarkTransactionsAsSeenAsync(userId);

            return NoContent();
        }

    }
}
