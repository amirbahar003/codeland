using Microsoft.AspNetCore.Mvc;
using Shop.Infrastructure.Data;

namespace Shop.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MongoTestController : ControllerBase
{
    private readonly MongoDbContext _context;

    public MongoTestController(MongoDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> Test()
    {
        await _context.PingAsync();

        return Ok("MongoDB connection is working!");
    }
}