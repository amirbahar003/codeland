using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MongoDB.Driver;
using Shop.Application.Interfaces.Transactions;
using Shop.Infrastructure.Data;


namespace Shop.Infrastructure.Services.Transactions
{
    public class MongoTransactionService : IMongoTransactionService
    {
        private readonly IMongoClient _client;

        public MongoTransactionService(MongoDbContext context)
        {
            _client = context.Client;
        }



        public async Task ExecuteAsync(
            Func<IClientSessionHandle, Task> operation,
            CancellationToken cancellationToken = default)
        {
            using var session = await _client.StartSessionAsync(
                cancellationToken: cancellationToken
            );

            session.StartTransaction();

            try
            {
                cancellationToken.ThrowIfCancellationRequested();

                await operation(session);

                cancellationToken.ThrowIfCancellationRequested();

                await session.CommitTransactionAsync(cancellationToken);
            }
            catch
            {
                if (session.IsInTransaction)
                {
                    await session.AbortTransactionAsync(
                        CancellationToken.None
                    );
                }

                throw;
            }
        }


    }
}
