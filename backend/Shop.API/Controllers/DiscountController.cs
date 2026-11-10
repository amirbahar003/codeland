using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Shop.Application.DTOs.Discounts;
using Shop.Application.Interfaces.Discounts.Service;

namespace Shop.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DiscountController : ControllerBase
    {

        private readonly IDiscountService _discountService;

        public DiscountController(IDiscountService discountService)
        {
            _discountService = discountService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var discounts = await _discountService.GetAllAsync();

            return Ok(discounts);
        }


        [HttpPost]
        public async Task<IActionResult> Create(CreateDiscountDto dto)
        {
            var discount = await _discountService.CreateAsync(dto);

            return Ok(discount);
        }

        [HttpPost("apply")]
        public async Task<IActionResult> ApplyDiscount(ApplyDiscountDto dto)
        {
            var result = await _discountService.ApplyAsync(dto);

            return Ok(result);
        }

        [HttpGet("code/{code}")]
        public async Task<IActionResult> GetByCode(string code)
        {
            var discount = await _discountService.GetByCodeAsync(code);

            if (discount == null)
                return NotFound("کد تخفیف پیدا نشد.");

            return Ok(discount);
        }

        [HttpGet("global")]
        public async Task<IActionResult> GetGlobal()
        {
            var discount = await _discountService.GetGlobalAsync();

            if (discount == null)
                return NotFound("تخفیف سراسری فعالی پیدا نشد.");

            return Ok(discount);
        }

        [HttpGet("course/{courseId}")]
        public async Task<IActionResult> GetForCourse(string courseId)
        {
            var discount = await _discountService.GetForCourseAsync(courseId);

            if (discount == null)
                return NotFound("تخفیف فعالی برای این دوره پیدا نشد.");

            return Ok(discount);
        }

        [HttpPut("{Id}")]
        public async Task<IActionResult> Update(string Id,UpdateDiscountDto dto)
        {
            var discount = await _discountService.UpdateAsync(Id, dto);

            return Ok(discount);
        }

        [HttpDelete("{Id}")]
        public async Task<IActionResult> Delete(string Id)
        {
            var result = await _discountService.DeleteAsync(Id);

            if (!result)
                return NotFound("کد تخفیف پیدا نشد.");

            return Ok("کد تخفیف با موفقیت حذف شد.");
        }

    }
}
