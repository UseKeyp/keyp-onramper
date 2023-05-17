import express from "express";
import fetch from "node-fetch";
import { config } from "dotenv";
import { saveResponse } from "./database.js";
import crypto from "crypto";
import assert from "assert";

config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// This function will return true/false if the signature matches
const verifySignature = (signature, secret, body) => {
  const hash = crypto.createHmac('sha256', secret).update(body).digest('hex');
  return (signature === hash);
};

// Receives the webhook from Onramper, verifies the signature and saves the response to the database
app.post("/", async (req, res) => {
  try {
    const signature = req.headers["X-Onramper-Webhook-Signature"]
    console.log("webhook:", req.body)
    const verified = verifySignature(signature, process.env.ONRAMPER_WEBHOOK_SECRET, JSON.stringify(req.body))
    assert(verified, "Signature does not match")
    await saveResponse("webhook", req.body)
    return res.status(200).json({ message: "Signature matches" })
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

app.get("/limits", async (req, res) => {
  try {
    const url = "https://api.onramper.com/supported/limits/moonpay/eur/eth/creditcard";
    const response = await fetch(url);
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

app.get("/getAllCurrencies", async (req, res) => {
  try {
    const url = "https://api.onramper.com/supported";
    const response = await fetch(url);
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

app.get("/getPaymentTypes", async (req, res) => {
  try {
    const url = "https://api.onramper.com/supported/payment-types/moonpay/eur/btc";
    const response = await fetch(url);
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

app.get("/getQuote", async (req, res) => {
  try {
    const { amount, paymentMethod, fiat, currency } = req.query;
    assert(amount, "Amount is required")
    const url = `https://api.onramper.com/quotes/${fiat||"usd"}/${currency||"eth"}?amount=${amount}&paymentMethod=${paymentMethod||"creditcard"}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: process.env.ONRAMPER_API_KEY
      }
    });
    const data = await response.json();
    console.log(data)
    await saveResponse(url, data);
  
    return res.status(200).json(data);
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

app.post("/checkoutintent", async (req, res) => {
  const url = "https://api.onramper.com/checkoutintent";
  const postData = {}
  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": process.env.ONRAMPER_API_KEY
    },
    body: JSON.stringify(postData)
  })
})

async function getBestQuote({
  source,
  destination,
  amount,
  type,
  paymentMethod,
  wallet,
  network
}) {
  // getQuote
  const url = `https://api.onramper.com/quotes/${source||"usd"}/${destination||"eth"}?amount=${amount||100}&paymentMethod=${paymentMethod||"creditcard"}&network=${network||"ethereum"}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: process.env.ONRAMPER_API_KEY
    }
  });
  const quotes = await response.json();
  // console.log("quotes:", quotes)
  
  const sorted = quotes.sort((a, b) => -1*(a.payout - b.payout));
  const bestQuote = sorted[0];
  return bestQuote;
}

app.get("/getBestQuote", async (req, res) => {
  try {
    const { amount, fiat, currency, paymentMethod, network, wallet } = req.query;
    assert(amount, "Amount is required")
    assert(wallet, "Wallet address is required")
    const supported = await fetch("https://api.onramper.com/supported", {
      method: "GET",
      headers: {
        Authorization: process.env.ONRAMPER_API_KEY
      }
    });
    const { crypto: cryptos } = (await supported.json()).message
    const crypto = cryptos.find(c => c.code.toLowerCase() === currency && c.network.toLowerCase() === network);
    console.log("crypto:", crypto)
    const cryptoId = crypto?.id;
  
    const bestQuote = await getBestQuote({
      source: fiat||"usd",
      destination: cryptoId||"eth",
      amount: amount||100,
      type: "buy",
      paymentMethod: paymentMethod||"creditcard",
      wallet,
      network: network||"ethereum"
    });
    console.log("Best quote:", bestQuote)
    return res.status(200).json(bestQuote);
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

app.post("/getCheckoutUrl", async (req, res) => {
  try {
    const { amount, fiat, currency, paymentMethod, network, wallet } = req.body;
    assert(amount, "Amount is required")
    assert(wallet, "Wallet address is required")

    const supported = await fetch("https://api.onramper.com/supported", {
      method: "GET",
      headers: {
        Authorization: process.env.ONRAMPER_API_KEY
      }
    });
    const { crypto: cryptos } = (await supported.json()).message
    const crypto = cryptos.find(c => c.code.toLowerCase() === currency && c.network.toLowerCase() === network);
    const cryptoId = crypto?.id;
  
    const bestQuote = await getBestQuote({
      source: fiat,
      destination: cryptoId,
      amount: amount,
      type: "buy",
      paymentMethod: paymentMethod,
      wallet: wallet,
      network: network
    });
  
    const url = "https://api.onramper.com/checkout/intent";
    const payload = {
      onramp: bestQuote.ramp,
      source: fiat,
      destination: cryptoId,
      amount,
      type: "buy",
      paymentMethod,
      wallet: wallet,
      network: network
    }
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": process.env.ONRAMPER_API_KEY
      },
      body: JSON.stringify(payload)
    })
    
    console.log("status:", response.status, response.statusText)
    const result = await response.json();
    console.log("response:", result)
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

app.listen(3000, () => {
  console.log("Server running on port 3000");
});