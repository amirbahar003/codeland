using System;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Options;

using Shop.Application.Interfaces.Payments.GateWay;

namespace Shop.Infrastructure.Payments;

public class ZarinPalPaymentGateway : IPaymentGateWay
{
    private readonly HttpClient _httpClient;
    private readonly ZarinPalOptions _options;

    public ZarinPalPaymentGateway(
        HttpClient httpClient,
        IOptions<ZarinPalOptions> options)
    {
        _httpClient = httpClient;
        _options = options.Value;
    }

    public async Task<(string Authority, string PaymentUrl)>
        CreatePaymentAsync(
            decimal amount,
            string orderId,
            string description)
    {
        var endpoint = _options.SandBox
            ? "https://sandbox.zarinpal.com/pg/v4/payment/request.json"
            : "https://api.zarinpal.com/pg/v4/payment/request.json";

        var request = new
        {
            merchant_id = _options.MerchantId,
            amount = Convert.ToInt64(amount),
            description,
            callback_url = _options.CallbackUrl,
            metadata = new
            {
                order_id = orderId
            }
        };


        var response = await _httpClient.PostAsJsonAsync(
            endpoint,
            request
        );

        var responseBody = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
            throw new InvalidOperationException(
                $"ZarinPal HTTP Error: {(int)response.StatusCode} - {responseBody}"
            );
        }

        var result = JsonSerializer.Deserialize<ZarinPalRequestResponse>(
            responseBody
        );


        if (result?.Data == null ||
            result.Data.Code != 100 ||
            string.IsNullOrEmpty(result.Data.Authority))
        {
            throw new InvalidOperationException(
                result?.Data?.Message ??
                "Failed to create ZarinPal payment."
            );
        }

        var paymentBaseUrl = _options.SandBox
            ? "https://sandbox.zarinpal.com/pg/StartPay/"
            : "https://www.zarinpal.com/pg/StartPay/";

        var paymentUrl =
            $"{paymentBaseUrl}{result.Data.Authority}";

        return (
            result.Data.Authority,
            paymentUrl
        );
    }

    public async Task<string?> VerifyPaymentAsync(
        string authority,
        decimal amount)
    {
        var endpoint = _options.SandBox
            ? "https://sandbox.zarinpal.com/pg/v4/payment/verify.json"
            : "https://api.zarinpal.com/pg/v4/payment/verify.json";

        var request = new
        {
            merchant_id = _options.MerchantId,
            amount = Convert.ToInt64(amount),
            authority
        };

        var response = await _httpClient.PostAsJsonAsync(
            endpoint,
            request
        );

        response.EnsureSuccessStatusCode();

        var result =
            await response.Content.ReadFromJsonAsync<ZarinPalVerifyResponse>();

        if (result?.Data == null)
            return null;

        if (result.Data.Code != 100 &&
            result.Data.Code != 101)
        {
            return null;
        }

        return result.Data.RefId?.ToString();
    }

    private sealed class ZarinPalRequestResponse
    {
        public ZarinPalRequestData? Data { get; set; }
    }

    private sealed class ZarinPalRequestData
    {
        public int Code { get; set; }

        public string? Message { get; set; }

        public string? Authority { get; set; }
    }

    private sealed class ZarinPalVerifyResponse
    {
        public ZarinPalVerifyData? Data { get; set; }
    }

    private sealed class ZarinPalVerifyData
    {
        public int Code { get; set; }

        public long? RefId { get; set; }
    }
}

