using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shop.Application.DTOs.Chapters;
using Shop.Application.DTOs.Chaptres;

namespace Shop.Application.Interfaces.Chapters.Services
{
    public interface IChapterService
    {
        Task<ChapterDto> CreateAsync(CreateChapterDto chapterDto);

        Task<List<ChapterDto>> GetAllByCourseIdAsync(string courseId);

        Task<ChapterDto> GetByIdAsync(string Id);

        Task<ChapterDto> UpdateAsync(string Id, UpdateChapterDto chapterDto);

        Task DeleteAsync(string Id);
    }
}
