using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shop.Application.DTOs.Payments;
using Shop.Domain.Entities;

namespace Shop.Application.Mappers
{
    public static class PaymentMapper
    {
        public static PaymentDto ToDto(
     Payment payment,
     string? paymentUrl = null)
        {
            return new PaymentDto
            {
                Id = payment.Id,
                UserId = payment.UserId,
                CourseId = payment.CourseId,
                Amount = payment.Amount,
                Status = payment.Status,
                Authority = payment.Authority,
                ReferenceId = payment.ReferenceId,
                CreatedAt = payment.CreatedAt,
                PaidAt = payment.PaidAt,
                PaymentUrl=paymentUrl
 
            };
        }
    }
}
