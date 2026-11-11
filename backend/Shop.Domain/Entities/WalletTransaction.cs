
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace Shop.Domain.Entities
{
    public class WalletTransaction
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = null!;

        [BsonRepresentation(BsonType.ObjectId)]
        public string UserId { get; set; } = null!;

        [BsonRepresentation(BsonType.ObjectId)]
        public string WalletId { get; set; } = null!;

        public long Amount { get; set; }

        public string Type { get; set; } = null!;

        public string Description { get; set; } = null!;

        public long BalanceAfter { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string ReferenceId { get; set; } = null!;
        public bool IsSeen { get; set; }
    }
}
