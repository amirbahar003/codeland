using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace Shop.Domain.Entities
{
    public class LessonProgress
    {
        [BsonId][BsonRepresentation(BsonType.ObjectId)] 
        public string Id { get; set; } = null!;
        [BsonRepresentation(BsonType.ObjectId)]
        public string UserId { get; set; } = null!; 
        [BsonRepresentation(BsonType.ObjectId)]
        public string LessonId { get; set; } = null!; 
        public bool IsCompleted { get; set; }
        public DateTime? CompletedAt { get; set; }
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
