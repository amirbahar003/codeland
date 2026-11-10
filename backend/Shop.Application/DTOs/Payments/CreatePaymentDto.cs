using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shop.Application.DTOs.Payments
{
    public class CreatePaymentDto
    {
        [Required] public string CourseId { get; set; } = null!;
    }
}
