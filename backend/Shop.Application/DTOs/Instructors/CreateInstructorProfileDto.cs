using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Shop.Application.DTOs.Instructors
{
    public class CreateInstructorProfileDto
    {

        [MaxLength(2000)]
        public string? Bio { get; set; }
        [MaxLength(500)]
        public string? Expertise { get; set; }
        public IFormFile? Avatar { get; set; }
        public List<InstructorSkillDto> Skills { get; set; } = new();
    }
}
