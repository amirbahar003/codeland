using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace Shop.Domain.Entities
{
    public class Enrollment
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = null!;
        [BsonRepresentation(BsonType.ObjectId)]
        public string UserId { get; set; } = null!;
        [BsonRepresentation(BsonType.ObjectId)]
        public string CourseId { get; set; } = null!;
        public DateTime EnrolledAt { get; set; } = DateTime.UtcNow;
    }
}
