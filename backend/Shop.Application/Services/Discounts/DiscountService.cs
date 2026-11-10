using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shop.Application.DTOs.Discounts;
using Shop.Application.Interfaces.Discounts.Repository;
using Shop.Application.Interfaces.Discounts.Service;
using Shop.Domain.Entities;

namespace Shop.Application.Services.Discounts
{
    public class DiscountService : IDiscountService
    {
        private readonly IDiscountRepository _discountRepository;

        public DiscountService(IDiscountRepository discountRepository)
        {
            _discountRepository = discountRepository;
        }

        public async Task<DiscountResultDto> ApplyAsync(ApplyDiscountDto dto)
        {
            var discount = await _discountRepository.GetByCodeAsync(dto.Code.Trim().ToUpper());

            if (discount == null)
            {
                return new DiscountResultDto
                {
                    IsValid = false,
                    Message = "کد تخفیف نامعتبر است."
                };
            }
            if (discount.Scope != Shop.Domain.Enums.DiscountScope.Code)
            {
                return new DiscountResultDto
                {
                    IsValid = false,
                    Message = "این تخفیف از نوع کد تخفیف نیست."
                };
            }

            if (!discount.IsActive)
            {
                return new DiscountResultDto
                {
                    IsValid = false,
                    Message = "این کد تخفیف غیرفعال است."
                };
            }

            var now = DateTime.UtcNow;

            if (now < discount.StartDate)
            {
                return new DiscountResultDto
                {
                    IsValid = false,
                    Message = "زمان استفاده از این کد تخفیف هنوز شروع نشده است."
                };
            }

            if (now > discount.EndDate)
            {
                return new DiscountResultDto
                {
                    IsValid = false,
                    Message = "این کد تخفیف منقضی شده است."
                };
            }

            if (discount.UsageLimit.HasValue &&
                discount.UsedCount >= discount.UsageLimit.Value)
            {
                return new DiscountResultDto
                {
                    IsValid = false,
                    Message = "ظرفیت استفاده از این کد تخفیف تمام شده است."
                };
            }

            if (discount.MinimumPrice.HasValue &&
                dto.Price < discount.MinimumPrice.Value)
            {
                return new DiscountResultDto
                {
                    IsValid = false,
                    Message = $"حداقل مبلغ خرید برای استفاده از این کد {discount.MinimumPrice.Value:N0} است."
                };
            }

            decimal discountAmount;

            if (discount.Type == Shop.Domain.Enums.DiscountType.Percentage)
            {
                discountAmount = dto.Price * discount.Value / 100;

                if (discount.MaximumDiscount.HasValue &&
                    discountAmount > discount.MaximumDiscount.Value)
                {
                    discountAmount = discount.MaximumDiscount.Value;
                }
            }
            else
            {
                discountAmount = discount.Value;
            }

            if (discountAmount > dto.Price)
            {
                discountAmount = dto.Price;
            }

            var finalPrice = dto.Price - discountAmount;

            return new DiscountResultDto
            {
                IsValid = true,
                DiscountAmount = discountAmount,
                FinalPrice = finalPrice,
                Message = "کد تخفیف با موفقیت اعمال شد."
            };
        }

        public async Task<Discount> CreateAsync(CreateDiscountDto dto)
        {
            if (dto.Scope == Shop.Domain.Enums.DiscountScope.Code)
            {
                var existingDiscount = await _discountRepository.GetByCodeAsync(
                    dto.Code.Trim().ToUpper()
                );

                if (existingDiscount != null)
                    throw new Exception("این کد تخفیف قبلاً ثبت شده است.");
            }

            var discount = new Discount
            {
                Code = dto.Scope == Shop.Domain.Enums.DiscountScope.Code
                    ? dto.Code.Trim().ToUpper()
                    : string.Empty,

                Type = dto.Type,
                Scope = dto.Scope,
                Value = dto.Value,
                MinimumPrice = dto.MinimumPrice,
                MaximumDiscount = dto.MaximumDiscount,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                UsageLimit = dto.UsageLimit,
                UsedCount = 0,
                IsActive = true,
                CourseIds = dto.CourseIds ?? new List<string>()
            };

            await _discountRepository.CreateAsync(discount);

            return discount;
        }
        public async Task<bool> DeleteAsync(string Id)
        {
            var discount = await _discountRepository.GetByIdAsync(Id);

            if (discount == null)
                return false;

            await _discountRepository.DeleteAsync(Id);

            return true;
        }

        public async Task<List<Discount>> GetAllAsync()
        {
            return await _discountRepository.GetAllAsync();
        }

        public async Task<Discount?> GetByCodeAsync(string code)
        {
            return await _discountRepository.GetByCodeAsync(code.Trim().ToUpper());
        }

        public async Task<Discount?> GetForCourseAsync(string courseId)
        {
            return await _discountRepository.GetForCourseAsync(courseId);
        }

        public async Task<Discount?> GetGlobalAsync()
        {
            return await _discountRepository.GetGlobalAsync();
        }

        public async Task<Discount> UpdateAsync(string Id, UpdateDiscountDto dto)
        {
            var discount = await _discountRepository.GetByIdAsync(Id);

            if (discount == null)
                throw new Exception("کد تخفیف پیدا نشد.");

            discount.Type = dto.Type;
            discount.Value = dto.Value;
            discount.Scope = dto.Scope;
            discount.MinimumPrice = dto.MinimumPrice;
            discount.MaximumDiscount = dto.MaximumDiscount;
            discount.StartDate = dto.StartDate;
            discount.EndDate = dto.EndDate;
            discount.UsageLimit = dto.UsageLimit;
            discount.IsActive = dto.IsActive;
            discount.CourseIds = dto.CourseIds ?? new List<string>();
            await _discountRepository.UpdateAsync(discount);

            return discount;
        }
    }
}
