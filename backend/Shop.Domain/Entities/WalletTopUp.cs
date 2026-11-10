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
    public class WalletTopUp
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = null!;

        [BsonRepresentation(BsonType.ObjectId)]
        public string UserId { get; set; } = null!;

        [BsonRepresentation(BsonType.ObjectId)]
        public string WalletId { get; set; } = null!;
        public long Amount { get; set; }
        public WalletTopUpStatus Status { get; set; } = WalletTopUpStatus.Pending;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? PaidAt { get; set; }
        public string? Authority { get; set; }
        public string? ReferenceId { get; set; }

    }
}
