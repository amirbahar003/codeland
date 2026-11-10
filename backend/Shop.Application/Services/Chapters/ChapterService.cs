using Shop.Application.DTOs.Chapters;
using Shop.Application.DTOs.Chaptres;
using Shop.Application.Exceptions;
using Shop.Application.Interfaces.Chapters.Repositories;
using Shop.Application.Interfaces.Chapters.Services;
using Shop.Application.Mappers;
using Shop.Domain.Entities;

namespace Shop.Application.Services.Chapters
{
    public class ChapterService : IChapterService
    {
        private readonly IChapterRepository _repository;

        public ChapterService(IChapterRepository repository)
        {
            _repository = repository;
        }
        public async Task<ChapterDto> CreateAsync(CreateChapterDto chapterDto)
        {
            var courseExists = await _repository
    .CourseExistsAsync(chapterDto.CourseId);

            if (!courseExists)
                throw new NotFoundException("Course does not exist.");

            var chapter = new Chapter
            {
                Title = chapterDto.Title.Trim(),
                Description = chapterDto.Description?.Trim(),
                CourseId = chapterDto.CourseId,
                Order = chapterDto.Order,
                CreatedAt = DateTime.UtcNow
            };

            var createdChapter = await _repository
                .CreateAsync(chapter);

            return ChapterMapper.ToDto(createdChapter);
        }

        public async Task DeleteAsync(string Id)
        {
            var existingChapter = await _repository.GetByIdAsync(Id);
            if (existingChapter == null)
                throw new NotFoundException("Chapter does not exist.");
            var deleted = await _repository.DeleteAsync(Id);
            if (!deleted)
                throw new NotFoundException("Chapter does not exist.");
        }

        public async Task<List<ChapterDto>> GetAllByCourseIdAsync(string courseId)
        {
            var courseExists = await _repository.CourseExistsAsync(courseId);
            if (!courseExists)
                throw new NotFoundException("Course does not exist.");
            var chapters = await _repository.GetAllByCourseIdAsync(courseId);
            return chapters.Select(ChapterMapper.ToDto).ToList();
        }

        public async Task<ChapterDto> GetByIdAsync(string Id)
        {
            var chapter = await _repository.GetByIdAsync(Id);
            if (chapter == null)
                throw new NotFoundException("Chapter does not exist.");
            return ChapterMapper.ToDto(chapter);
        }

        public async Task<ChapterDto> UpdateAsync(string Id, UpdateChapterDto chapterDto)
        {
            var existingChapter = await _repository
        .GetByIdAsync(Id);

            if (existingChapter == null)
                throw new NotFoundException("Chapter does not exist.");

            var chapter = new Chapter
            {
                Id = Id,
                Title = chapterDto.Title.Trim(),
                Description = chapterDto.Description?.Trim(),
                CourseId = existingChapter.CourseId,
                Order = chapterDto.Order,
                CreatedAt = existingChapter.CreatedAt
            };

            var updatedChapter = await _repository
                .UpdateAsync(Id, chapter);

            if (updatedChapter == null)
                throw new NotFoundException(
                    "Chapter does not exist.");

            return ChapterMapper.ToDto(updatedChapter);
        }
    }
}
