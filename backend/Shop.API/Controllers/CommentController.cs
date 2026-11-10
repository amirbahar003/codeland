using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shop.Application.DTOs.Comments;
using Shop.Application.Interfaces.Comments.Service;

namespace Shop.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CommentController : ControllerBase
    {
        private readonly ICommentService _commentService;

        public CommentController(ICommentService commentService)
        {
            _commentService = commentService;
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create(
            [FromBody] CreateCommentDto dto)
        {
            var userId = User.FindFirstValue(
                ClaimTypes.NameIdentifier
            );

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var comment = await _commentService.CreateAsync(
                userId,
                dto
            );

            return Ok(comment);
        }

        [HttpGet("course/{courseId}")]
        public async Task<IActionResult> GetByCourse(
            string courseId)
        {
            var comments = await _commentService
                .GetByCourseIdAsync(courseId);

            return Ok(comments);
        }

        [Authorize]
        [HttpDelete("{commentId}")]
        public async Task<IActionResult> Delete(
            string commentId)
        {
            var userId = User.FindFirstValue(
                ClaimTypes.NameIdentifier
            );

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            await _commentService.DeleteAsync(
                userId,
                commentId
            );

            return NoContent();
        }
    }
}