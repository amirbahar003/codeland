
using MongoDB.Bson;
using MongoDB.Driver;
using Shop.Domain.Entities;

namespace Shop.Infrastructure.Data;

public class MongoDbContext
{
    private readonly MongoClient _client;
    private readonly IMongoDatabase _database;

    public MongoDbContext(MongoDbSettings settings)
    {
        _client = new MongoClient(settings.ConnectionString);

        _database = _client.GetDatabase(settings.DatabaseName);
    }

    // دسترسی به MongoClient برای شروع Session و Transaction
    public IMongoClient Client => _client;

    public IMongoDatabase DataBase => _database;

    public async Task PingAsync()
    {
        await _database.RunCommandAsync<MongoDB.Bson.BsonDocument>(
            new MongoDB.Bson.BsonDocument("ping", 1)


        );


        var result = await _database.RunCommandAsync<BsonDocument>(
    new BsonDocument("hello", 1)
);

        Console.WriteLine(result);
    }

    public IMongoCollection<T> GetCollection<T>(string name)
    {
        return _database.GetCollection<T>(name);
    }




    public async Task EnsureIndexesAsync()
    {
        // =========================
        // Category Collection
        // =========================

        var categories = GetCollection<Category>("categories");

        var categoryIndexKeys = Builders<Category>.IndexKeys
            .Ascending(c => c.Name);

        var categoryIndexOptions = new CreateIndexOptions
        {
            Unique = true,
            Collation = new Collation(
                locale: "en",
                strength: CollationStrength.Secondary
            )
        };

        var categoryIndexModel = new CreateIndexModel<Category>(
            categoryIndexKeys,
            categoryIndexOptions
        );

        await categories.Indexes.CreateOneAsync(categoryIndexModel);

        // =========================
        // Course Collection
        // =========================

        var courses = GetCollection<Course>("courses");

        var coursePriceIndex = new CreateIndexModel<Course>(
            Builders<Course>.IndexKeys
                .Ascending(c => c.Price)
        );

        var courseCategoryPriceIndex = new CreateIndexModel<Course>(
            Builders<Course>.IndexKeys
                .Ascending(c => c.CategoryId)
                .Ascending(c => c.Price)
        );

        await courses.Indexes.CreateManyAsync(new[]
        {
            coursePriceIndex,
            courseCategoryPriceIndex
        });



        var wallets = GetCollection<Wallet>("wallets");

        var walletUserIndex = new CreateIndexModel<Wallet>(
            Builders<Wallet>.IndexKeys
                .Ascending(w => w.UserId),
            new CreateIndexOptions
            {
                Unique = true,
                Name = "ux_wallets_user_id"
            }
        );

        await wallets.Indexes.CreateOneAsync(walletUserIndex);

        var walletTransactions = GetCollection<WalletTransaction>("walletTransactions");

        var referenceIdFilter = Builders<WalletTransaction>.Filter
            .Type(t => t.ReferenceId, BsonType.String);

        var referenceIdIndex = new CreateIndexModel<WalletTransaction>(
            Builders<WalletTransaction>.IndexKeys
                .Ascending(t => t.ReferenceId),
            new CreateIndexOptions<WalletTransaction>
            {
                Unique = true,
                Name = "ux_wallet_transactions_reference_id",
                PartialFilterExpression = referenceIdFilter
            }
        );

        await walletTransactions.Indexes.CreateOneAsync(referenceIdIndex);


        // =========================
        // User Referral Code Index
        // =========================

        var users = GetCollection<User>("users");

        var referralCodeFilter = Builders<User>.Filter
            .Type(u => u.ReferralCode, BsonType.String);

        var referralCodeIndex = new CreateIndexModel<User>(
            Builders<User>.IndexKeys
                .Ascending(u => u.ReferralCode),
            new CreateIndexOptions<User>
            {
                Unique = true,
                Name = "ux_users_referral_code",
                PartialFilterExpression = referralCodeFilter
            }
        );

        await users.Indexes.CreateOneAsync(referralCodeIndex);

    }
}
