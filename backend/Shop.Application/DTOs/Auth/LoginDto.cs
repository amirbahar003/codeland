using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shop.Application.DTOs.Auth
{
    public class LoginDto
    {
        [Required]
        public string EmailOrMobile { get; set; } = null!;

        [Required]
        public string Password { get; set; } = null!;
    }
}
