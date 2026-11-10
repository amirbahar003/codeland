using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using Shop.Domain.Enums;

namespace Shop.Domain.Entities
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = null!;

        public string Username { get; set; } = null!;

        public string Email { get; set; } = null!;
        public string Mobile { get; set; } = null!;

        public string PasswordHash { get; set; } = null!;

        public UserRole Role { get; set; } = UserRole.Student;

        public bool IsActive { get; set; } = true;

        public string? AvatarId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }                     

        // Referral System
        public string? ReferralCode { get; set; }

        [BsonRepresentation(BsonType.ObjectId)]
        public string? ReferredByUserId { get; set; }
        public int SuccessfulReferrals { get; set; } = 0;
                                                                 
    }
}
