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
    public class Payment
    {
        [BsonId][BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = null!;
        [BsonRepresentation(BsonType.ObjectId)]
        public string UserId { get; set; } = null!; 
        [BsonRepresentation(BsonType.ObjectId)] 
        public string CourseId { get; set; } = null!;
        public decimal Amount { get; set; }
        public PaymentStatus Status { get; set; } = PaymentStatus.Pending; 
        public string? Authority { get; set; }
        public string? ReferenceId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? PaidAt { get; set; }
    }
}
