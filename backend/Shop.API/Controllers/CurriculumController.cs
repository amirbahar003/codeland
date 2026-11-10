using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Shop.Application.Interfaces.Curriculum;

namespace Shop.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CurriculumController : ControllerBase
    {
        private readonly ICurriculumService _service;

        public CurriculumController(ICurriculumService service)
        {
            _service = service;
        }

        [HttpGet("course/{courseId}")]
        public async Task<IActionResult>GetByCourseId(string courseId)
        {
            var result = await _service.GetByCourseIdAsync(courseId);

            return Ok(result);
        }


    }
}
