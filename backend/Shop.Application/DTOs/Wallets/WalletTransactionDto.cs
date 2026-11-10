using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shop.Application.DTOs.Wallets
{
    public class WalletTransactionDto
    {
        public string Id { get; set; } = null!;

        public long Amount { get; set; }

        public string Type { get; set; } = null!;

        public string Description { get; set; } = null!;

        public long BalanceAfter { get; set; }

        public DateTime CreatedAt { get; set; }

        public string? ReferenceId { get; set; }
    }
}
