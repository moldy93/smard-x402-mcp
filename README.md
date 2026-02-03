# SMARD Energy Prices (x402)

Paywalled SMARD day‑ahead electricity prices (DE‑LU, 15‑minute resolution) via x402 on Base mainnet. Hosted MCP (streamable‑http) + HTTP endpoint.

## Homepage
https://smard-energy-prices-x402.favo.workers.dev

## Endpoints
- **HTTP**: `GET https://smard-energy-prices-x402.favo.workers.dev/prices`
- **MCP**: `POST https://smard-energy-prices-x402.favo.workers.dev/mcp`

## Pricing
**$0.001 per call (USDC on Base)**. Requires `X-PAYMENT` header (exact scheme).

## MCP Connect (example)
```json
{
  "mcpServers": {
    "smard-x402": {
      "url": "https://smard-energy-prices-x402.favo.workers.dev/mcp",
      "headers": {
        "Accept": "application/json, text/event-stream"
      }
    }
  }
}
```

## Node.js Example (x402)
```js
import { createWalletClient, http } from "viem";
import { base } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { createPaymentHeader, selectPaymentRequirements } from "x402/client";

const url = "https://smard-energy-prices-x402.favo.workers.dev/prices";

// 1) Get payment requirements
const res = await fetch(url);
const data = await res.json();
const req = selectPaymentRequirements(data.accepts, "base", "exact");

// 2) Create payment header
const account = privateKeyToAccount(process.env.PRIVATE_KEY);
const client = createWalletClient({ account, chain: base, transport: http("https://mainnet.base.org") });
const xPayment = await createPaymentHeader(client, data.x402Version, req);

// 3) Call API with payment
const paid = await fetch(url, { headers: { "X-PAYMENT": xPayment } });
console.log(await paid.json());
```

## Notes
- MCP endpoint uses streamable‑http. Send `Accept: application/json, text/event-stream`.
- Data source: SMARD (DE‑LU), 15‑minute resolution.
