using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shop.Domain.Enums;

namespace Shop.Application.DTOs.Discounts
{
    public class CreateDiscountDto
    {
        public string Code { get; set; } = string.Empty;

        public DiscountType Type { get; set; }

        public DiscountScope Scope { get; set; }

        public List<string> CourseIds { get; set; } = new();

        public decimal Value { get; set; }

        public decimal? MinimumPrice { get; set; }

        public decimal? MaximumDiscount { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public int? UsageLimit { get; set; }
    }
}
