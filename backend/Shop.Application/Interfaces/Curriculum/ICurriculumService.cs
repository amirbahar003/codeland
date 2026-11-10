using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shop.Application.DTOs.Curriculum;

namespace Shop.Application.Interfaces.Curriculum
{
    public interface ICurriculumService
    {
        Task<List<ChapterCurriculumDto>> GetByCourseIdAsync(string courseId);
    }
}
