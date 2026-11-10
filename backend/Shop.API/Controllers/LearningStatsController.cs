using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Shop.Application.Interfaces.LearningStates.Service;
using Shop.Application.DTOs.LearningStates;

namespace Shop.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LearningStatsController : ControllerBase
    {
        private readonly ILearningStatsService _learningStatsService;

        public LearningStatsController(ILearningStatsService learningStatsService)
        {
            _learningStatsService = learningStatsService;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetMyStats()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var stats = await _learningStatsService.GetOrCreateAsync(userId);

            return Ok(stats);
        }


        [HttpPut("goal")]
        [Authorize]
        public async Task<IActionResult> UpdateWeeklyGoal(
            [FromBody] UpdateWeeklyGoalDto request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            try
            {
                var stats = await _learningStatsService.UpdateWeeklyGoalAsync(
                    userId,
                    request.GoalMinutes
                );

                return Ok(stats);
            }
            catch (ArgumentOutOfRangeException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


    }
}
