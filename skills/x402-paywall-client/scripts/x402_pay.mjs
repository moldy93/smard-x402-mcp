#!/usr/bin/env node
import { createWalletClient, http } from "viem";
import { base } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { createPaymentHeader, selectPaymentRequirements } from "x402/client";

function getArg(name) {
  const idx = process.argv.indexOf(`--${name}`);
  return idx >= 0 ? process.argv[idx + 1] : undefined;
}

const url = getArg("url");
const rpc = getArg("rpc") || "https://mainnet.base.org";
const key = getArg("key") || process.env.PRIVATE_KEY;
const accept = getArg("accept");

if (!url || !key) {
  console.error("Usage: node scripts/x402_pay.mjs --url <URL> --key <PRIVATE_KEY> [--rpc <RPC>] [--accept <acceptHeader>]");
  process.exit(1);
}

const account = privateKeyToAccount(key);
const client = createWalletClient({ account, chain: base, transport: http(rpc) });

// 1) Get payment requirements (expect 402)
const res = await fetch(url, { headers: accept ? { Accept: accept } : undefined });
const data = await res.json();
if (res.status !== 402) {
  console.error("Expected 402, got", res.status, data);
  process.exit(1);
}

// 2) Create payment header
const req = selectPaymentRequirements(data.accepts, "base", "exact");
const xPayment = await createPaymentHeader(client, data.x402Version, req);

// 3) Paid call
const res2 = await fetch(url, {
  headers: {
    "X-PAYMENT": xPayment,
    ...(accept ? { Accept: accept } : {})
  }
});

const body = await res2.text();
console.log("status", res2.status);
console.log(body);
