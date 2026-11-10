using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace Shop.Domain.Entities
{
    public class Course
    {

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string Title { get; set; } = null!;

        public string Description { get; set; } = null!;

        public decimal Price { get; set; }

        public string? ThumbnailId { get; set; }

        public string? CategoryId { get; set; }

        public string? InstructorId { get; set; }

        public string Level { get; set; } = "Beginner";

        public int DurationMinutes { get; set; }
        public string Slug { get; set; } = null!;
        public List<string> PrerequisiteCourseIds { get; set; } = new();
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public int EnrollmentCount { get; set; } = 0;
        [BsonIgnore]
        public Category? Category { get; set; }
        [BsonIgnore]
        public InstructorProfile? Instructor { get; set; }
    }
}
