using Microsoft.AspNetCore.Mvc;
using Shop.Application.Interfaces.File;

namespace Shop.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FilesController : ControllerBase
    {
        private readonly IFileStorageService _fileStorage;

        public FilesController(IFileStorageService fileStorage)
        {
            _fileStorage = fileStorage;
        }

        [HttpGet("{imageId}")]
        public async Task<IActionResult> GetFile(string imageId)
        {
            var file = await _fileStorage.GetFileAsync(imageId);

            return File(
           file.Stream,
           file.ContentType
       );
        }
    }
}