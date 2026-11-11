using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;
using Shop.Application.Interfaces.Wallets.Repository;
using Shop.Domain.Entities;
using Shop.Infrastructure.Data;

namespace Shop.Infrastructure.Repositories
{
    public class WalletTransactionRepository : IWalletTransactionRepository
    {
        private readonly IMongoCollection<WalletTransaction> _transactions;

        public WalletTransactionRepository(MongoDbContext context)
        {
            _transactions = context.GetCollection<WalletTransaction>(
                "walletTransactions"
            );
        }
        public async Task CreateAsync(WalletTransaction transaction, IClientSessionHandle? session = null)
        {
            if (session == null)
            {
                await _transactions.InsertOneAsync(transaction);
            }
            else
            {
                await _transactions.InsertOneAsync(session, transaction);
            }
        }

        public async Task<bool> ExistsByReferenceIdAsync(string referenceId, IClientSessionHandle? session = null)
        {
            var filter = Builders<WalletTransaction>.Filter.Eq(t => t.ReferenceId, referenceId);

            if (session == null)
            {
                return await _transactions.Find(filter).AnyAsync();
            }

            return await _transactions.Find(session, filter).AnyAsync();
        }
        public async Task<List<WalletTransaction>> GetAllByUserIdAsync(string userId)
        {
            return await _transactions.Find(transaction => transaction.UserId == userId).SortByDescending(transaction => transaction.CreatedAt).ToListAsync();

        }
        public async Task<List<WalletTransaction>> GetReferralRewardsAsync(string userId)
        {
            var prefix = $"REFERRAL-{userId}-";

            var filter = Builders<WalletTransaction>.Filter.And(
                Builders<WalletTransaction>.Filter.Eq(t => t.UserId, userId),
                Builders<WalletTransaction>.Filter.Regex(
                    t => t.ReferenceId,
                    new BsonRegularExpression($"^{Regex.Escape(prefix)}")
                )
            );

            return await _transactions
                .Find(filter)
                .SortByDescending(t => t.CreatedAt)
                .ToListAsync();
        }

        public async Task<long> GetUnseenCountAsync(string userId)
        {
            var filter = Builders<WalletTransaction>.Filter.And(
                Builders<WalletTransaction>.Filter.Eq(t => t.UserId, userId),
                Builders<WalletTransaction>.Filter.Eq(t => t.IsSeen, false)
            );

            return await _transactions.CountDocumentsAsync(filter);
        }
    }
}
