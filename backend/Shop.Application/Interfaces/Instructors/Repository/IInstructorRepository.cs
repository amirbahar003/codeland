using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shop.Domain.Entities;

namespace Shop.Application.Interfaces.Instructors
{
    public interface IInstructorRepository
    {
        Task<List<InstructorProfile>>GetAllAsync();
        Task<InstructorProfile> CreateAsync(InstructorProfile instructorProfile);
        Task<InstructorProfile?> GetByIdAsync(string Id);
        Task<InstructorProfile?> GetByUserIdAsync(string userId);
        Task<InstructorProfile?> GetBySlugAsync(string slug);
        Task<bool> ExistsBySlugAsync(string slug);
        Task<InstructorProfile?> UpdateAsync(string Id, InstructorProfile instructorProfile);
        Task UpdateSlugAsync(string instructorId, string slug);
    }
}
