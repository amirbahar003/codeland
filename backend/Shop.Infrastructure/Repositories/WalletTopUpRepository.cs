
using MongoDB.Driver;
using Shop.Application.Exceptions;
using Shop.Application.Interfaces.Wallets.Repository;
using Shop.Domain.Entities;
using Shop.Domain.Enums;
using Shop.Infrastructure.Data;

namespace Shop.Infrastructure.Repositories
{
    public class WalletTopUpRepository : IWalletTopUpRepository
    {
        private readonly IMongoCollection<WalletTopUp> _topUps;

        public WalletTopUpRepository(MongoDbContext context)
        {
            _topUps = context.GetCollection<WalletTopUp>("walletTopUps");
        }

        public async Task CreateAsync(WalletTopUp topUp)
        {
            await _topUps.InsertOneAsync(topUp);
        }

        public async Task<WalletTopUp?> GetByIdAsync(string topUpId)
        {
            return await _topUps
                .Find(topUp => topUp.Id == topUpId)
                .FirstOrDefaultAsync();
        }

        public async Task<List<WalletTopUp>> GetAllByUserIdAsync(
            string userId)
        {
            return await _topUps
                .Find(topUp => topUp.UserId == userId)
                .SortByDescending(topUp => topUp.CreatedAt)
                .ToListAsync();
        }


        public async Task UpdateAsync(WalletTopUp topUp, IClientSessionHandle? session = null)
        {
            var filter = Builders<WalletTopUp>.Filter
                .Eq(existingTopUp => existingTopUp.Id, topUp.Id);

            ReplaceOneResult result;

            if (session == null)
            {
                result = await _topUps.ReplaceOneAsync(
                    filter,
                    topUp);
            }
            else
            {
                result = await _topUps.ReplaceOneAsync(
                    session,
                    filter,
                    topUp);
            }

            if (result.MatchedCount == 0)
            {
                throw new NotFoundException(
                    "Wallet top-up request does not exist.");
            }
        }

        public async Task<WalletTopUp?> GetByAuthorityAsync(string authority)
        {
            return await _topUps.Find(topUp => topUp.Authority == authority).FirstOrDefaultAsync();
        }


        public async Task<bool> TryStartProcessingAsync(string topUpId)
        {
            var filter = Builders<WalletTopUp>.Filter.And(
                Builders<WalletTopUp>.Filter.Eq(
                    topUp => topUp.Id, topUpId),
                Builders<WalletTopUp>.Filter.Eq(
                    topUp => topUp.Status, WalletTopUpStatus.Pending)
            );

            var update = Builders<WalletTopUp>.Update
                .Set(topUp => topUp.Status, WalletTopUpStatus.Processing);

            var result = await _topUps.UpdateOneAsync(filter, update);

            return result.ModifiedCount == 1;
        }

    }
}
