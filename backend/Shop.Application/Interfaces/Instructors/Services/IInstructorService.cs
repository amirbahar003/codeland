using Shop.Application.DTOs.Instructors;

namespace Shop.Application.Interfaces.Instructors.Services
{
    public interface IInstructorService
    {
        Task<List<InstructorProfileDto>> GetAllAsync();
        Task<InstructorProfileDto?> GetByIdAsync(string Id);
        Task<InstructorProfileDto> CreateAsync(string userId, CreateInstructorProfileDto instructorDto);
        Task<InstructorProfileDto> CreateByAdminAsync(string userId,CreateInstructorProfileDto instructorDto);
        Task<InstructorProfileDto?> GetByUserIdAsync(string userId);
        Task<InstructorProfileDto?> GetBySlugAsync(string slug);
        Task<InstructorProfileDto> UpdateAsync(string userId, UpdateInstructorProfileDto instructorDto);
        Task<InstructorProfileDto> UpdateByAdminAsync(string instructorId,UpdateInstructorProfileDto instructorDto);
        Task<InstructorProfileDto> UpdateAvatarAsync(string userId, string avatarId);


    }
}
