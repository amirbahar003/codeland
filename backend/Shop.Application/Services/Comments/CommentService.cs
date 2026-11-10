using Shop.Application.DTOs.Comments;
using Shop.Application.Exceptions;
using Shop.Application.Interfaces.Comments.Repository;
using Shop.Application.Interfaces.Comments.Service;
using Shop.Application.Interfaces.Courses.Repositories;
using Shop.Application.Interfaces.Enrollments.Services;
using Shop.Application.Interfaces.Users.Repositories;

namespace Shop.Application.Services.Comments
{
    public class CommentService : ICommentService
    {
        private readonly ICommentRepository _commentRepository;
        private readonly ICourseRepository _courseRepository;
        private readonly IUserRepository _userRepository;
        private readonly IEnrollmentService _enrollmentService;

        public CommentService(
            ICommentRepository commentRepository,
            ICourseRepository courseRepository,
            IUserRepository userRepository,
            IEnrollmentService enrollmentService)
        {
            _commentRepository = commentRepository;
            _courseRepository = courseRepository;
            _userRepository = userRepository;
            _enrollmentService = enrollmentService;
        }

        public async Task<CommentDto> CreateAsync(
            string userId,
            CreateCommentDto dto)
        {
            var user = await _userRepository
                .GetByIdAsync(userId);

            if (user == null)
                throw new NotFoundException(
                    "User does not exist."
                );

            var course = await _courseRepository
                .GetByIdAsync(dto.CourseId);

            if (course == null)
                throw new NotFoundException(
                    "Course does not exist."
                );

            var isAdmin =
                user.Role == Shop.Domain.Enums.UserRole.Admin;

            var isInstructor =
                user.Role == Shop.Domain.Enums.UserRole.Instructor &&
                course.InstructorId == userId;

            var hasAccess = await _enrollmentService
                .HasAccessAsync(
                    userId,
                    dto.CourseId
                );

            // فقط کاربرانی که اجازه دسترسی به دوره دارند
            // می‌توانند کامنت یا Reply ثبت کنند.
            if (!isAdmin && !isInstructor && !hasAccess)
                throw new ForbiddenException(
                    "You do not have access to comment on this course."
                );

            // اگر Reply باشد
            if (!string.IsNullOrWhiteSpace(dto.ParentCommentId))
            {
                var parentComment = await _commentRepository
                    .GetByIdAsync(dto.ParentCommentId);

                if (parentComment == null)
                    throw new NotFoundException(
                        "Parent comment does not exist."
                    );

                // کامنت والد باید متعلق به همین دوره باشد
                if (parentComment.CourseId != dto.CourseId)
                    throw new ConflictException(
                        "Parent comment does not belong to this course."
                    );
            }

            var comment = new Shop.Domain.Entities.Comment
            {
                CourseId = dto.CourseId,
                UserId = userId,
                Content = dto.Content,
                ParentCommentId = dto.ParentCommentId,
                CreatedAt = DateTime.UtcNow
            };

            var createdComment = await _commentRepository
                .CreateAsync(comment);

            return new CommentDto
            {
                Id = createdComment.Id,
                CourseId = createdComment.CourseId,
                UserId = createdComment.UserId,
                UserName = user.Username,
                Content = createdComment.Content,
                ParentCommentId = createdComment.ParentCommentId,
                CreatedAt = createdComment.CreatedAt
            };
        }

        public async Task DeleteAsync(
            string userId,
            string commentId)
        {
            var user = await _userRepository
                .GetByIdAsync(userId);

            if (user == null)
                throw new NotFoundException(
                    "User does not exist."
                );

            var comment = await _commentRepository
                .GetByIdAsync(commentId);

            if (comment == null)
                throw new NotFoundException(
                    "Comment does not exist."
                );

            var course = await _courseRepository
                .GetByIdAsync(comment.CourseId);

            if (course == null)
                throw new NotFoundException(
                    "Course does not exist."
                );

            var isAdmin =
                user.Role == Shop.Domain.Enums.UserRole.Admin;

            var isInstructor =
                user.Role == Shop.Domain.Enums.UserRole.Instructor &&
                course.InstructorId == userId;

            var isOwner =
                comment.UserId == userId;

            if (!isAdmin && !isInstructor && !isOwner)
                throw new ForbiddenException(
                    "You do not have permission to delete this comment."
                );

            await _commentRepository
                .DeleteAsync(commentId);
        }

        public async Task<List<CommentDto>> GetByCourseIdAsync(
            string courseId)
        {
            var course = await _courseRepository
                .GetByIdAsync(courseId);

            if (course == null)
                throw new NotFoundException(
                    "Course does not exist."
                );

            var comments = await _commentRepository
                .GetByCourseIdAsync(courseId);

            var result = new List<CommentDto>();

            foreach (var comment in comments)
            {
                var user = await _userRepository
                    .GetByIdAsync(comment.UserId);

                if (user == null)
                    continue;

                result.Add(new CommentDto
                {
                    Id = comment.Id,
                    CourseId = comment.CourseId,
                    UserId = comment.UserId,
                    UserName = user.Username,
                    Content = comment.Content,
                    ParentCommentId = comment.ParentCommentId,
                    CreatedAt = comment.CreatedAt
                });
            }

            return result;
        }
    }
}