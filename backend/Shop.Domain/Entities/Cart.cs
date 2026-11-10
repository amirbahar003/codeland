
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace Shop.Domain.Entities
{
    public  class Cart
    {
        [BsonId][BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public string UserId { get; set; } = null!;
        public List<CartItem> Items { get; set; } = new();
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
