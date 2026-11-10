using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shop.Infrastructure.Payments
{
    public class ZarinPalOptions
    {
        public string MerchantId { get; set; } = null;
        public string CallbackUrl { get; set; } = null;
        public bool SandBox { get; set; }
    }
}
