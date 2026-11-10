using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using Shop.Domain.Enums;

namespace Shop.Domain.Entities
{
    public class Discount
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        public string Code { get; set; } = string.Empty;

        public DiscountType Type { get; set; }

        public decimal Value { get; set; }

        public decimal? MinimumPrice { get; set; }

        public decimal? MaximumDiscount { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public DiscountScope Scope { get; set; }

        public List<string> CourseIds { get; set; } = new();

        public int? UsageLimit { get; set; }

        public int UsedCount { get; set; }

        public bool IsActive { get; set; } = true;
    }
}
