---
name: x402-paywall-client
description: Create paid requests against x402 paywalled HTTP or MCP endpoints. Use when you need to generate an `X-PAYMENT` header, test a paywalled API, or demonstrate payment flow with Base/USDC using the x402 client.
---

# x402 Paywall Client

## Overview
Generate x402 payment headers and call paywalled endpoints (HTTP or MCP streamable‑http) using a wallet private key.

## Quick Start (HTTP)
1) Fetch payment requirements (expect HTTP 402)
2) Create `X-PAYMENT` header
3) Call the endpoint again with payment

Use the script below (`scripts/x402_pay.ts`).

## MCP (streamable‑http)
For MCP endpoints, you still pay via x402 for the HTTP call, but you must send:
```
Accept: application/json, text/event-stream
```

## Script: `scripts/x402_pay.ts`
Run:
```bash
ts-node scripts/x402_pay.ts --url https://example.com/prices \
  --rpc https://mainnet.base.org \
  --key $PRIVATE_KEY
```

## Notes
- Network must match the server’s `accepts` response (usually `base`).
- USDC on Base uses 6 decimals; price is handled by the server.
- If you see `Payment verification failed`, confirm wallet has USDC + ETH for gas.

## Resources
- `scripts/x402_pay.mjs` — end‑to‑end payment call
- `references/x402_flow.md` — minimal flow & troubleshooting
