using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shop.Application.DTOs.Payments;
using Shop.Application.DTOs.Wallets;

namespace Shop.Application.Interfaces.Payments.Service
{
    public interface IPaymentService
    {
        Task<PaymentDto> CreateAsync(string userId, CreatePaymentDto paymentDto);
        Task<PaymentDto> VerifyAsync(VerifyPaymentDto paymentDto);
        Task<List<MyPaymentDto>> GetMyPaymentsAsync(string userId);
    }
}
