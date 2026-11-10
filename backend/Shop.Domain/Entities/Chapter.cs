using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace Shop.Domain.Entities
{

    public class Chapter
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string Title { get; set; } = null!;

        public string? Description { get; set; }

        public string CourseId { get; set; } = null!;

        public int Order { get; set; }

        [BsonIgnore]
        public Course? Course { get; set; }

        [BsonIgnore]
        public ICollection<Lesson> Lessons { get; set; } = new List<Lesson>();

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
