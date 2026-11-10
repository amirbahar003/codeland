using Shop.Application.DTOs.Curriculum;
using Shop.Application.Interfaces.Chapters.Repositories;
using Shop.Application.Interfaces.Curriculum;
using Shop.Application.Interfaces.Lessons.Repositories;

namespace Shop.Application.Services.Curriculum
{
    public class CurriculumService : ICurriculumService

    {
        private readonly IChapterRepository _chapterRepository;
        private readonly ILessonRepository _lessonRepository;

        public CurriculumService(IChapterRepository chapterRepository,ILessonRepository lessonRepository)
        {
            _chapterRepository = chapterRepository;
            _lessonRepository = lessonRepository;
        }
        public async Task<List<ChapterCurriculumDto>> GetByCourseIdAsync(string courseId)
        {
            var chapters = await _chapterRepository.GetAllByCourseIdAsync(courseId);

            var result = new List<ChapterCurriculumDto>();

            foreach (var chapter in chapters)
            {
                var lessons = await _lessonRepository.GetAllByChapterIdAsync(chapter.Id!);

                var chapterDto = new ChapterCurriculumDto
                {
                    Id = chapter.Id,
                    Title = chapter.Title,
                    Description = chapter.Description,
                    Order = chapter.Order,

                    Lessons = lessons.Select(lesson => new LessonCurriculumDto
                    {
                        Id = lesson.Id,
                        Title = lesson.Title,
                        Description = lesson.Description,
                        Order = lesson.Order,
                        DurationMinutes = lesson.DurationMinutes,
                        IsFree = lesson.IsFree
                    }).ToList()
                };

                result.Add(chapterDto);
            }

            return result;
        }
    }
}
