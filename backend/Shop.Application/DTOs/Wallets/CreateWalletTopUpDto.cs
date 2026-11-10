using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shop.Application.DTOs.Wallets
{
    public class CreateWalletTopUpDto
    {
        [Range(1000, 1000000000,ErrorMessage = "Amount must be between 1000 and 1000000000.")]
        public long Amount { get; set; }
    }
}
