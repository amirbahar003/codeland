using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shop.Application.DTOs.Payments
{
    public class VerifyPaymentDto
    {
        [Required] public string Authority { get; set; } = null!;
    }
}
