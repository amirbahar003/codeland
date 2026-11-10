using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Shop.Application.DTOs.Lessons;

namespace Shop.Application.Interfaces.Lessons.Services
{
    public interface ILessonService
    {

        Task<(Stream Stream, string ContentType, string FileName)> GetVideoAsync(string userId, string lessonId);
        Task<LessonDto> CreateAsync(CreateLessonDto lessonDto);
        Task<List<LessonDto>> GetAllByChapterIdAsync(string chapterId);
        Task<LessonDto> GetByIdAsync(string lessonId, string? userId);
        Task<LessonDto> UpdateAsync(string Id, UpdateLessonDto lessonDto);
        Task<LessonDto> UploadVideoAsync(string userId, string lessonId, IFormFile file);
        Task DeleteAsync(string Id);
    }
}
