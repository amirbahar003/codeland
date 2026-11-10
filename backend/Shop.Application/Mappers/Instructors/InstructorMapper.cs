using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shop.Application.DTOs.Instructors;
using Shop.Domain.Entities;

namespace Shop.Application.Mappers.Instructors
{
    public static class InstructorMapper
    {
        public static InstructorProfileDto ToDto(InstructorProfile instructorProfile,User user)
        {
            return new InstructorProfileDto 
            {
                Id = instructorProfile.Id,
                UserId = instructorProfile.UserId, 
                Bio = instructorProfile.Bio,
                Expertise = instructorProfile.Expertise,
                UserName=user.Username,
                Email=user.Email,
                AvatarId = instructorProfile.AvatarId,
                Slug=instructorProfile.Slug,
                Skills = instructorProfile.Skills
                    .Select(skill => new InstructorSkillDto
                    {
                        Name = skill.Name,
                        Value = skill.Value
                    })
                    .ToList(),
                CreatedAt = instructorProfile.CreatedAt
            }; 
        }
    }
}
