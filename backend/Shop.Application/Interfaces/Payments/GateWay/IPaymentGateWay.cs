using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shop.Application.Interfaces.Payments.GateWay
{
    public interface IPaymentGateWay
    {
        Task<(string Authority, string PaymentUrl)> CreatePaymentAsync(decimal amount, string orderId, string description);

        Task<string?> VerifyPaymentAsync(string authority, decimal amount);
    }
}
