using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shop.Application.DTOs.Discounts
{
    public class DiscountResultDto
    {
        public bool IsValid { get; set; }

        public decimal DiscountAmount { get; set; }

        public decimal FinalPrice { get; set; }

        public string Message { get; set; } = string.Empty;
    }
}
