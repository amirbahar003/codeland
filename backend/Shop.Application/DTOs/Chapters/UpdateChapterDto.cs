using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shop.Application.DTOs.Chapters
{
    public class UpdateChapterDto
    {
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = null;
        [MaxLength(1000)]
        public string? Description { get; set; }
        [Range(1, int.MaxValue)]
        public int Order { get; set; } 
    }
}
