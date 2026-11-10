using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Shop.Domain.Entities;

public class Category
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    public string Name { get; set; } = null!;

    [BsonIgnore]
    public ICollection<Course> Courses { get; set; } = new List<Course>();
}