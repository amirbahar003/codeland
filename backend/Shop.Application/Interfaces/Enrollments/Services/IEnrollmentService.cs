using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shop.Application.DTOs.Courses;

namespace Shop.Application.Interfaces.Enrollments.Services
{
    public interface IEnrollmentService
    {
        Task EnrollAsync(string userId, string courseId);

        Task<bool> HasAccessAsync(string userId, string courseId);
        Task<List<MyCourseDto>> GetMyCourseAsync(string userId);
    }
}
