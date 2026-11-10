using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shop.Application.Interfaces.Payments.GateWay;

namespace Shop.Infrastructure.Payments
{
    public class FakePaymentGateway : IPaymentGateWay
    {

        public Task<(string Authority, string PaymentUrl)> CreatePaymentAsync(
            decimal amount,
            string orderId,
            string description)
        {
            var authority = $"FAKE-{Guid.NewGuid():N}";

            // انتخاب مسیر callback بر اساس نوع پرداخت
            var callbackPath = description == "Wallet top-up"
                ? "WalletTopUp"
                : "Payments";

            // ساخت آدرس بازگشت از درگاه
            var paymentUrl =
                $"https://localhost:7111/api/{callbackPath}/callback" +
                $"?Authority={authority}&Status=OK";

            return Task.FromResult((authority, paymentUrl));
        }

        public Task<string?> VerifyPaymentAsync(string authority, decimal amount)
        {
            if (!authority.StartsWith("FAKE-"))
                return Task.FromResult<string?>(null);
            var referenceId = $"REF-{Guid.NewGuid():N}";
            return Task.FromResult<string?>(referenceId);
        }
    }
}
