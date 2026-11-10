using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shop.Application.DTOs.Wallets;

namespace Shop.Application.Interfaces.Wallets.Service
{
    public interface IWalletTopUpService
    {
        Task<WalletTopUpDto> CreateAsync(string userId,CreateWalletTopUpDto dto);
        Task<WalletTopUpDto> VerifyAsync(string authority);
        Task<List<WalletTopUpDto>> GetMyTopUpsAsync(string userId);
    }
}
