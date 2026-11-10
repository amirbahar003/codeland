using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shop.Application.DTOs.Lessons
{
    public class CreateLessonDto
    {
        [Required]
        [MaxLength(200)] 
        public string Title { get; set; } = null!; 
        [MaxLength(1000)]
        public string? Description { get; set; }
        [Required]
        public string ChapterId { get; set; } = null!; 
        [Range(1, int.MaxValue)]
        public int Order { get; set; }
        [Range(0, int.MaxValue)]
        public int DurationMinutes { get; set; }
        public bool IsFree { get; set; } = false;
    }
}
