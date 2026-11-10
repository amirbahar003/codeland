using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shop.Domain.Entities;

namespace Shop.Application.Interfaces.Enrollments.Repositories
{
    public interface IEnrollmentRepository
    {
        Task<Enrollment?> GetByUserAndCourseAsync(string userId, string courseId);
        Task<Enrollment> CreateAsync(Enrollment enrollment);
        Task<List<Enrollment>> GetAllByUserIdAsync(string userId);
    }
}
