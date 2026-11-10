using System;
using System.Collections.Generic;
using Shop.Domain.Enums;

namespace Shop.Application.DTOs.Discounts
{
    public class UpdateDiscountDto
    {
        public DiscountType Type { get; set; }

        public DiscountScope Scope { get; set; }

        public decimal Value { get; set; }

        public decimal? MinimumPrice { get; set; }

        public decimal? MaximumDiscount { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public int? UsageLimit { get; set; }

        public bool IsActive { get; set; }

        public List<string> CourseIds { get; set; } = new();
    }
}