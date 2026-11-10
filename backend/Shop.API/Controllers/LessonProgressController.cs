using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Shop.Application.Interfaces.LessonProgreses.Services;

namespace Shop.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LessonProgressController : ControllerBase
    {
        private readonly ILessonProgressService _service;
        public LessonProgressController(ILessonProgressService service)
        {
            _service = service;
        }
        [HttpPost("{lessonId}/complete")]
        public async Task<IActionResult> CompleteLesson(string lessonId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
                return Unauthorized();
            await _service.CompleteLessonAsync(userId, lessonId);
            return NoContent();
        }
        [HttpGet("{lessonId}")]
        public async Task<IActionResult> GetByLesson(string lessonId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();
            var progress = await _service.GetByLessonAsync(userId, lessonId);
            if (progress == null)
                return NotFound();
            return Ok(progress);
        }

        [HttpGet("course/{courseId}")]
        public async Task<IActionResult> GetCourseProgress(string courseId)
        {
            var userId = User.FindFirstValue(
                ClaimTypes.NameIdentifier
            );

            if (userId == null)
                return Unauthorized();

            var progress = await _service
                .GetCourseProgressAsync(
                    userId,
                    courseId
                );

            return Ok(progress);
        }

        [HttpGet("course/{courseId}/latest")]
        public async Task<IActionResult> GetLatestCompletedLesson(string courseId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
                return Unauthorized();
            var lesson = await _service.GetLatestCompletedLessonAsync(userId, courseId);
            if (lesson == null)
                return NotFound();
            return Ok(lesson);
        }


        [HttpGet("my-courses")]
        public async Task<IActionResult> GetMyCoursesProgress()
        {
            var userId = User.FindFirstValue(
                ClaimTypes.NameIdentifier
            );

            if (userId == null)
                return Unauthorized();

            var courses = await _service
                .GetMyCoursesProgressAsync(userId);

            return Ok(courses);
        }

    }
}
