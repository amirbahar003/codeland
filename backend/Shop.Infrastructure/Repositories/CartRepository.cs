
using MongoDB.Bson;
using MongoDB.Driver;
using Shop.Application.Exceptions;
using Shop.Application.Interfaces.Carts.Repository;
using Shop.Domain.Entities;
using Shop.Infrastructure.Data;

namespace Shop.Infrastructure.Repositories;

public class CartRepository : ICartRepository
{
    private readonly IMongoCollection<Cart> _carts;

    public CartRepository(MongoDbContext context)
    {
        _carts = context.GetCollection<Cart>("carts");
    }

    public async Task<Cart> CreateAsync(Cart cart)
    {
        await _carts.InsertOneAsync(cart);

        return cart;
    }

    public async Task DeleteAsync(string userId)
    {
        await _carts.DeleteOneAsync(
            c => c.UserId == userId
        );
    }

    public async Task<Cart?> GetByUserIdAsync(string userId)
    {
        return await _carts
            .Find(c => c.UserId == userId)
            .FirstOrDefaultAsync();
    }

    public async Task UpdateAsync(Cart cart)
    {
        if (string.IsNullOrWhiteSpace(cart.Id))
            throw new InvalidObjectIdException(
                "Cart ID is required."
            );

        if (!ObjectId.TryParse(cart.Id, out _))
            throw new InvalidObjectIdException(
                "Invalid ObjectId."
            );

        cart.UpdatedAt = DateTime.UtcNow;

        var result = await _carts.ReplaceOneAsync(
            c => c.Id == cart.Id,
            cart
        );

        if (result.MatchedCount == 0)
            throw new KeyNotFoundException(
                "Cart does not exist."
            );
    }
}
