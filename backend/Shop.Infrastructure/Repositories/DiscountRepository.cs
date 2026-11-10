using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MongoDB.Driver;
using Shop.Application.Interfaces.Discounts.Repository;
using Shop.Domain.Entities;
using Shop.Domain.Enums;
using Shop.Infrastructure.Data;

namespace Shop.Infrastructure.Repositories
{
    public class DiscountRepository : IDiscountRepository
    {
        private readonly IMongoCollection<Discount> _discounts;

        public DiscountRepository(MongoDbContext context)
        {
            _discounts = context.GetCollection<Discount>("DisCounts");
        }
        public async Task CreateAsync(Discount discount)
        {
            await _discounts.InsertOneAsync(discount);
        }

        public async Task DeleteAsync(string Id)
        {
            await _discounts.DeleteOneAsync(x => x.Id == Id);
        }

        public async Task<List<Discount>> GetAllAsync()
        {
            return await _discounts.Find(_ => true).ToListAsync();
        }

        public async Task<Discount?> GetByCodeAsync(string code)
        {
            return await _discounts.Find(x => x.Code == code).FirstOrDefaultAsync();
        }

        public async Task<Discount?> GetByIdAsync(string Id)
        {
            return await _discounts.Find(x => x.Id == Id).FirstOrDefaultAsync();
        }

        public async Task<Discount?> GetForCourseAsync(string courseId)
        {
            var now = DateTime.UtcNow;

            return await _discounts
                .Find(x =>
                    x.Scope == DiscountScope.Courses &&
                    x.CourseIds.Contains(courseId) &&
                    x.IsActive &&
                    x.StartDate <= now &&
                    x.EndDate >= now
                )
                .FirstOrDefaultAsync();
        }
      

        public async Task<Discount?> GetGlobalAsync()
        {
            var now = DateTime.UtcNow;

            return await _discounts
                .Find(x =>
                    x.Scope == DiscountScope.Global &&
                    x.IsActive &&
                    x.StartDate <= now &&
                    x.EndDate >= now
                )
                .FirstOrDefaultAsync();
        }

        public async Task UpdateAsync(Discount discount)
        {
            await _discounts.ReplaceOneAsync(x => x.Id == discount.Id, discount);
        }
    }
}
