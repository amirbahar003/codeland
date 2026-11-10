using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shop.Domain.Enums;

namespace Shop.Application.DTOs.Auth
{
    public class UpdateUserRoleDto
    {
        [Required]
        public UserRole Role { get; set; }
    }
}
