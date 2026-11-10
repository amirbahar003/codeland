using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Shop.Application.DTOs.Lessons;
using Shop.Application.Interfaces.Lessons.Services;

namespace Shop.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LessonController : ControllerBase
    {
        private readonly ILessonService _service;

        public LessonController(ILessonService service)
        {
            _service = service;
        }
        [Authorize(Roles ="Admin")]
        [HttpPost]
        public async Task<IActionResult> Create(CreateLessonDto dto)
        {
            var createdLesson = await _service.CreateAsync(dto);
            return
                CreatedAtAction(nameof(GetById),
                new
                {
                    Id = createdLesson.Id
                }, createdLesson);
        }
        [HttpGet("chapter/{chapterId}")]
        public async Task<IActionResult> GetAllByChapterId(string chapterId)
        {
            var lessons = await _service.GetAllByChapterIdAsync(chapterId);
            return Ok(lessons);
        }


        [HttpGet("{Id}")]
        public async Task<IActionResult> GetById(string Id)
        {
            var userId = User.FindFirstValue(
                ClaimTypes.NameIdentifier
            );

            var lesson = await _service.GetByIdAsync(
                Id,
                userId
            );

            return Ok(lesson);
        }


        [Authorize(Roles = "Admin")]
        [HttpPut("{Id}")]
        public async Task<IActionResult> Update(string Id, UpdateLessonDto dto)
        {
            var updatedLesson = await _service.UpdateAsync(Id, dto);
            return Ok(updatedLesson);           
        }
        //[Authorize]
        //[HttpGet("{lessonId}/video")]
        //public async Task<IActionResult> GetVideo(string lessonId)
        //{
        //    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        //    if (userId == null) return Unauthorized();
        //    var video = await _service.GetVideoAsync(userId, lessonId);
        //    return File(video.Stream, video.ContentType, video.FileName);
        //}




        [HttpGet("{lessonId}/video")]
        public async Task<IActionResult> GetVideo(string lessonId)
        {
            var userId = User.FindFirstValue(
                ClaimTypes.NameIdentifier
            );

            var video = await _service.GetVideoAsync(
                userId,
                lessonId
            );

            return File(
                video.Stream,
                video.ContentType,
                enableRangeProcessing: true
            );
        }
        [Authorize(Roles = "Admin")]
        [RequestSizeLimit(500 * 1024 * 1024)]
        [HttpPost("{lessonId}/video")]
        public async Task<IActionResult> UploadVideo(string lessonId, IFormFile file)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
                return Unauthorized();
            var lesson = await _service.UploadVideoAsync(userId, lessonId, file);
            return Ok(lesson);
        }


        [Authorize(Roles = "Admin")]
        [HttpDelete("{Id}")]
        public async Task<IActionResult> Delete(string Id)
        {
            await _service.DeleteAsync(Id);
            return NoContent();
        }

    }
}