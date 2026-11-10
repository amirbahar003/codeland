
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Shop.Domain.Entities
{
    public class LearningStats
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string UserId { get; set; } = null!;

        public int WeeklyGoalMinutes { get; set; } = 180;

        public List<LearningActivity> Activities { get; set; } = new();

        public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;
    }

}
