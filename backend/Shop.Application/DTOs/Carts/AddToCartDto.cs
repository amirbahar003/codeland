using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shop.Application.DTOs.Carts
{
    public class AddToCartDto
    {
        public string CourseId { get; set; } = null!;
        public int Quantity { get; set; } = 1;
    }
}
