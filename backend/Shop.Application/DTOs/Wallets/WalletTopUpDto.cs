using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shop.Domain.Enums;

namespace Shop.Application.DTOs.Wallets
{
    public class WalletTopUpDto
    {
        public string Id { get; set; } = null!;
        public long Amount { get; set; }
        public WalletTopUpStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? PaidAt { get; set; }
        public string? PaymentUrl { get; set; }
    }
}
