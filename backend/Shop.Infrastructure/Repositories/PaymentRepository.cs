using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;
using Shop.Application.Exceptions;
using Shop.Application.Interfaces.Payments.Repository;
using Shop.Domain.Entities;
using Shop.Infrastructure.Data;

namespace Shop.Infrastructure.Repositories
{
    public class PaymentRepository : IPaymentRepository
    {
        private readonly IMongoCollection<Payment> _payments;
        public PaymentRepository(MongoDbContext context)
        {
            _payments = context.GetCollection<Payment>("payments");
        }
        public async Task<Payment> CreateAsync(Payment payment)
        {
            await _payments.InsertOneAsync(payment);
            return payment;
        }

        public async Task<Payment?> GetByAuthorityAsync(string authority)
        {
            return await _payments.Find(p => p.Authority == authority).FirstOrDefaultAsync();
        }

        public async Task<Payment?> GetByIdAsync(string Id)
        {
            if (!ObjectId.TryParse(Id, out _)) throw new InvalidObjectIdException("Invalid PaymentId.");
            return await _payments.Find(p => p.Id == Id).FirstOrDefaultAsync();
        }

        public async Task<List<Payment>> GetByUserIdAsync(string userId)
        {
            return await _payments.Find(p => p.UserId == userId).SortByDescending(p => p.CreatedAt).ToListAsync();
        }


        public async Task<Payment?> UpdateAsync(string Id, Payment payment)
        {
            if (!ObjectId.TryParse(Id, out _)) throw new InvalidObjectIdException("Invalid PaymentId.");
            return await _payments.FindOneAndReplaceAsync(p => p.Id == Id, payment, new FindOneAndReplaceOptions<Payment>
            {
                ReturnDocument = ReturnDocument.After
            });
        }
    }
}
