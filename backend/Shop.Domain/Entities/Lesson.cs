using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace Shop.Domain.Entities
{
    public class Lesson
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string Title { get; set; } = null!;

        public string? Description { get; set; }

        public string ChapterId { get; set; } = null!;

        public int Order { get; set; }

        public int DurationMinutes { get; set; }

        public string? VideoId { get; set; }

        public bool IsFree { get; set; } = false;

        [BsonIgnore]
        public Chapter? Chapter { get; set; }
 
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
