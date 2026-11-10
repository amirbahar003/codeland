using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shop.Application.DTOs.Instructors
{
    public class InstructorProfileDto
    {
        public string? Id { get; set; }
        public string UserId { get; set; } = null!;
        public string UserName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? Bio { get; set; }
        public string? Expertise { get; set; }
        public string? AvatarId { get; set; }
        public string Slug { get; set; } = null!;
        public List<InstructorSkillDto> Skills { get; set; } = new();
        public DateTime CreatedAt { get; set; }
    }
}
