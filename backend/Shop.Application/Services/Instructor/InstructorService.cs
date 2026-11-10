using Shop.Application.DTOs.Instructors;
using Shop.Application.Exceptions;
using Shop.Application.Helpers;
using Shop.Application.Interfaces.File;
using Shop.Application.Interfaces.Instructors;
using Shop.Application.Interfaces.Instructors.Services;
using Shop.Application.Interfaces.Users.Repositories;
using Shop.Application.Mappers.Instructors;
using Shop.Domain.Entities;
using Shop.Domain.Enums;

namespace Shop.Application.Services.Instructor
{
    public class InstructorService : IInstructorService
    {
        private readonly IInstructorRepository _repository;
        private readonly IUserRepository _userRepository;
        private readonly IFileStorageService _fileStorage;
        public InstructorService(
                IInstructorRepository repository,
                IUserRepository userRepository,
                IFileStorageService fileStorage)
        {
            _repository = repository;
            _userRepository = userRepository;
            _fileStorage = fileStorage;
        }

        private async Task<string> GenerateUniqueSlugAsync(string username)
        {
            var baseSlug = SlugHelper.Slugify(username);

            var slug = baseSlug;
            var counter = 2;

            while (await _repository.ExistsBySlugAsync(slug))
            {
                slug = $"{baseSlug}-{counter}";
                counter++;
            }

            return slug;
        }

        public async Task<InstructorProfileDto> CreateAsync(
            string userId,
            CreateInstructorProfileDto instructorDto)
        {
            var user = await _userRepository.GetByIdAsync(userId);

            if (user == null)
                throw new NotFoundException("User does not exist.");

            if (user.Role != UserRole.Instructor)
                throw new ForbiddenException("User is not an instructor.");

            var existingProfile = await _repository.GetByUserIdAsync(userId);

            if (existingProfile != null)
                throw new ConflictException(
                    "Instructor profile already exists."
                );

            string? avatarId = null;

            if (instructorDto.Avatar != null &&
                instructorDto.Avatar.Length > 0)
            {
                avatarId = await _fileStorage.UploadFileAsync(
                    instructorDto.Avatar
                );
            }
            var slug = await GenerateUniqueSlugAsync(user.Username);
            var profile = new InstructorProfile
            {
                UserId = userId,
                Bio = instructorDto.Bio?.Trim(),
                Expertise = instructorDto.Expertise?.Trim(),
                AvatarId = avatarId,
                Slug = slug,
                Skills = instructorDto.Skills
               .Select(skill => new InstructorSkill
               {
                   Name = skill.Name.Trim(),
                   Value = skill.Value
               })
               .ToList(),

                CreatedAt = DateTime.UtcNow
            };

            var createdProfile = await _repository.CreateAsync(profile);

            return InstructorMapper.ToDto(
                createdProfile,
                user
            );
        }

        public async Task<List<InstructorProfileDto>> GetAllAsync()
        {
            var instructors = await _repository.GetAllAsync();

            var result = new List<InstructorProfileDto>();

            foreach (var instructor in instructors)
            {
                var user = await _userRepository.GetByIdAsync(
                    instructor.UserId
                );

                if (user == null)
                    continue;

                result.Add(
                    InstructorMapper.ToDto(
                        instructor,
                        user
                    )
                );
            }

            return result;
        }

        public async Task<InstructorProfileDto?> GetBySlugAsync(string slug)
        {
            var normalizedSlug = SlugHelper.Slugify(slug);

            var instructor = await _repository.GetBySlugAsync(normalizedSlug);

            if (instructor == null)
            {
                var user = await _userRepository.GetByUsernameAsync(normalizedSlug);

                if (user == null)
                    return null;

                instructor = await _repository.GetByUserIdAsync(user.Id);

                if (instructor == null)
                    return null;

                if (string.IsNullOrWhiteSpace(instructor.Slug))
                {
                    instructor.Slug = await GenerateUniqueSlugAsync(user.Username);

                    await _repository.UpdateSlugAsync(
                        instructor.Id,
                        instructor.Slug
                    );
                }

                return InstructorMapper.ToDto(instructor, user);
            }

            var instructorUser = await _userRepository.GetByIdAsync(
                instructor.UserId
            );

            if (instructorUser == null)
                throw new NotFoundException("User does not exist.");

            return InstructorMapper.ToDto(
                instructor,
                instructorUser
            );
        }


        public async Task<InstructorProfileDto?> GetByUserIdAsync(
            string userId)
        {
            var profile = await _repository.GetByUserIdAsync(userId);

            if (profile == null)
                return null;

            var user = await _userRepository.GetByIdAsync(userId);

            if (user == null)
                throw new NotFoundException("User does not exist.");

            return InstructorMapper.ToDto(
                profile,
                user
            );
        }

        public async Task<InstructorProfileDto> UpdateAsync(
            string userId,
            UpdateInstructorProfileDto instructorDto)
        {
            var user = await _userRepository.GetByIdAsync(userId);

            if (user == null)
                throw new NotFoundException("User does not exist.");

            if (user.Role != UserRole.Instructor)
                throw new ForbiddenException(
                    "User is not an instructor."
                );

            var existingProfile =
                await _repository.GetByUserIdAsync(userId);

            if (existingProfile == null)
                throw new NotFoundException(
                    "Instructor profile does not exist."
                );

            var slug = existingProfile.Slug;

            if (string.IsNullOrWhiteSpace(slug))
            {
                slug = await GenerateUniqueSlugAsync(user.Username);
            }

            var profile = new InstructorProfile
            {
                Id = existingProfile.Id,
                UserId = existingProfile.UserId,
                Bio = instructorDto.Bio?.Trim(),
                Expertise = instructorDto.Expertise?.Trim(),
                AvatarId = instructorDto.AvatarId?.Trim(),
                Slug = slug,
                Skills = instructorDto.Skills
                  .Select(skill => new InstructorSkill
                  {
                      Name = skill.Name.Trim(),
                      Value = skill.Value
                  })
                  .ToList(),

                CreatedAt = existingProfile.CreatedAt
            };

            var updatedProfile = await _repository.UpdateAsync(
                existingProfile.Id,
                profile
            );

            if (updatedProfile == null)
                throw new NotFoundException(
                    "Instructor profile does not exist."
                );

            return InstructorMapper.ToDto(
                updatedProfile,
                user
            );
        }

        public async Task<InstructorProfileDto> UpdateByAdminAsync(string instructorId, UpdateInstructorProfileDto instructorDto)
        {
            var existingProfile = await _repository.GetByIdAsync(instructorId);

            if (existingProfile == null)
                throw new NotFoundException(
                    "Instructor profile does not exist."
                );

            var user = await _userRepository.GetByIdAsync(
                existingProfile.UserId
            );

            if (user == null)
                throw new NotFoundException(
                    "User does not exist."
                );

            if (user.Role != UserRole.Instructor)
                throw new ConflictException(
                    "The selected user is not an instructor."
                );

            var profile = new InstructorProfile
            {
                Id = existingProfile.Id,
                UserId = existingProfile.UserId,
                Bio = instructorDto.Bio?.Trim(),
                Expertise = instructorDto.Expertise?.Trim(),
                Slug = existingProfile.Slug,
                AvatarId = instructorDto.AvatarId?.Trim(),

                Skills = instructorDto.Skills
                    .Select(skill => new InstructorSkill
                    {
                        Name = skill.Name.Trim(),
                        Value = skill.Value
                    })
                    .ToList(),

                CreatedAt = existingProfile.CreatedAt
            };

            var updatedProfile = await _repository.UpdateAsync(
                existingProfile.Id,
                profile
            );

            if (updatedProfile == null)
                throw new NotFoundException(
                    "Instructor profile does not exist."
                );

            return InstructorMapper.ToDto(
                updatedProfile,
                user
            );
        }

        public async Task<InstructorProfileDto> CreateByAdminAsync(string userId, CreateInstructorProfileDto instructorDto)
        {
            var user = await _userRepository.GetByIdAsync(userId);

            if (user == null)
                throw new NotFoundException(
                    "User does not exist."
                );

            if (user.Role != UserRole.Instructor)
                throw new ConflictException(
                    "The selected user is not an instructor."
                );

            var existingProfile = await _repository.GetByUserIdAsync(userId);

            if (existingProfile != null)
                throw new ConflictException(
                    "Instructor profile already exists."
                );

            var slug = await GenerateUniqueSlugAsync(user.Username);

            var profile = new InstructorProfile
            {
                UserId = userId,
                Bio = instructorDto.Bio?.Trim(),
                Expertise = instructorDto.Expertise?.Trim(),
                Slug = slug,
                AvatarId = null,

                Skills = instructorDto.Skills
                    .Select(skill => new InstructorSkill
                    {
                        Name = skill.Name.Trim(),
                        Value = skill.Value
                    })
                    .ToList(),

                CreatedAt = DateTime.UtcNow
            };

            var createdProfile = await _repository.CreateAsync(profile);

            return InstructorMapper.ToDto(
                createdProfile,
                user
            );
        }

        public async Task<InstructorProfileDto?> GetByIdAsync(string Id)
        {
            var instructor = await _repository.GetByIdAsync(Id);

            if (instructor == null)
                return null;

            var user = await _userRepository.GetByIdAsync(
                instructor.UserId
            );

            if (user == null)
                throw new NotFoundException(
                    "User does not exist."
                );

            return InstructorMapper.ToDto(
                instructor,
                user
            );
        }

        public async Task<InstructorProfileDto> UpdateAvatarAsync(string userId, string avatarId)
        {
            var user = await _userRepository.GetByIdAsync(userId);

            if (user == null)
                throw new NotFoundException("User does not exist.");

            if (user.Role != UserRole.Instructor)
                throw new ForbiddenException("User is not an instructor.");

            var profile = await _repository.GetByUserIdAsync(userId);

            if (profile == null)
                throw new NotFoundException(
                    "Instructor profile does not exist."
                );

            profile.AvatarId = avatarId;

            var updatedProfile = await _repository.UpdateAsync(
                profile.Id,
                profile
            );

            if (updatedProfile == null)
                throw new NotFoundException(
                    "Instructor profile does not exist."
                );

            return InstructorMapper.ToDto(updatedProfile, user);
        }
    }
}