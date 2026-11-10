using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Shop.Application.Interfaces.Enrollments.Services;

namespace Shop.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EnrollmentsController : ControllerBase
    {
        private readonly IEnrollmentService _service;
        public EnrollmentsController(IEnrollmentService service)
        {
            _service = service;
        }



        [Authorize]
        [HttpPost("{courseId}")]

        public async Task<IActionResult> Enroll(string courseId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
                return Unauthorized();

            await _service.EnrollAsync(userId, courseId);

            return NoContent();
        }

        [Authorize]
        [HttpGet("my-course")]

        public async Task<IActionResult> GetMyCourses()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
                return Unauthorized();

            var courses = await _service.GetMyCourseAsync(userId);
            return Ok(courses);
        }

    }
}
