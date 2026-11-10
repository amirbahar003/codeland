using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shop.Domain.Enums;

namespace Shop.Application.DTOs.Payments
{
    public class PaymentDto
    {
        public string? Id { get; set; }
        public string UserId { get; set; } = null!;
        public string CourseId { get; set; } = null!;
        public decimal Amount { get; set; }
        public PaymentStatus Status { get; set; }
        public string? Authority { get; set; }
        public string? ReferenceId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? PaidAt { get; set; }
        public string?  PaymentUrl { get; set; }
    }
}
