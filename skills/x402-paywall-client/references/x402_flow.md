# x402 Payment Flow (minimal)

1. **GET** protected endpoint → receive `402` with `accepts` + `x402Version`.
2. Select matching requirement (scheme `exact`, network `base`).
3. Create payment header (EIP‑3009 signature for USDC).
4. Retry request with `X-PAYMENT` header.

## Common Issues
- **400 from facilitator**: payer lacks USDC or signature mismatch.
- **500 from server**: verify facilitator auth + network match.
- **NaN price in paywall**: ensure price is a numeric string (e.g., `0.001`).

## MCP (streamable‑http)
Use:
```
Accept: application/json, text/event-stream
```

Then follow the same x402 payment flow for the HTTP request.
