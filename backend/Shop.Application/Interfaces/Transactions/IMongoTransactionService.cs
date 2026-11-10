using MongoDB.Driver;

namespace Shop.Application.Interfaces.Transactions
{
    public interface IMongoTransactionService
    {
        Task ExecuteAsync(Func<IClientSessionHandle, Task> operation,CancellationToken cancellationToken = default);
    }
}
