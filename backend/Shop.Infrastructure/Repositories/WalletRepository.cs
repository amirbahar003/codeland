using MongoDB.Driver;
using Shop.Application.Exceptions;
using Shop.Application.Interfaces.Wallets.Repository;
using Shop.Domain.Entities;
using Shop.Infrastructure.Data;

namespace Shop.Infrastructure.Repositories
{
    public class WalletRepository : IWalletRepository
    {
        private readonly IMongoCollection<Wallet> _wallets;

        public WalletRepository(MongoDbContext context)
        {
            _wallets = context.GetCollection<Wallet>("wallets");
        }

        public async Task<Wallet?> AddBalanceAsync(string userId, long amount, IClientSessionHandle? session = null)
        {
            var filter = Builders<Wallet>.Filter
                .Eq(w => w.UserId, userId);

            var update = Builders<Wallet>.Update
                .Inc(w => w.Balance, amount)
                .Set(w => w.UpdatedAt, DateTime.UtcNow);

            var options = new FindOneAndUpdateOptions<Wallet>
            {
                ReturnDocument = ReturnDocument.After
            };

            if (session is null)
            {
                return await _wallets.FindOneAndUpdateAsync(
                    filter,
                    update,
                    options);
            }

            return await _wallets.FindOneAndUpdateAsync(
                session,
                filter,
                update,
                options);
        }

        public async Task CreateAsync(Wallet wallet)
        {
            await _wallets.InsertOneAsync(wallet);
        }

        public async Task<Wallet?> GetByIdAsync(string walletId)
        {
            return await _wallets
              .Find(wallet => wallet.Id == walletId)
              .FirstOrDefaultAsync();
        }

        public async Task<Wallet?> GetByUserIdAsync(string userId)
        {
            return await _wallets
                .Find(wallet => wallet.UserId == userId)
                .FirstOrDefaultAsync();
        }


        public async Task UpdateAsync(Wallet wallet, IClientSessionHandle? session = null)
        {
            var filter = Builders<Wallet>.Filter
                .Eq(existingWallet => existingWallet.Id, wallet.Id);

            ReplaceOneResult result;

            if (session == null)
            {
                result = await _wallets.ReplaceOneAsync(
                    filter,
                    wallet);
            }
            else
            {
                result = await _wallets.ReplaceOneAsync(
                    session,
                    filter,
                    wallet);
            }

            if (result.MatchedCount == 0)
            {
                throw new NotFoundException("Wallet does not exist.");
            }
        }

    }
}
