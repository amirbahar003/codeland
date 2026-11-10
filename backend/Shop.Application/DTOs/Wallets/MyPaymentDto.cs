using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shop.Application.DTOs.Wallets
{
    public class MyPaymentDto
    {
        public string Id { get; set; } = null!;
        public string CourseId { get; set; } = null!;
        public string CourseTitle { get; set; } = null!;
        public decimal Amount { get; set; }
        public string Status { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public DateTime? PaidAt { get; set; }
    }
}
