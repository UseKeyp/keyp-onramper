import express from "express";
import fetch from "node-fetch";
import { config } from "dotenv";
import { saveResponse } from "./database.js";

config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/limits", async (req, res) => {
  const url = "https://api.onramper.com/supported/limits/moonpay/eur/eth/creditcard";
  const response = await fetch(url);
  const data = await response.json();
  return res.json(data);
})

app.get("/getAllCurrencies", async (req, res) => {
  const url = "https://api.onramper.com/supported";
  const response = await fetch(url);
  const data = await response.json();
  return res.json(data);
})

app.get("/getPaymentTypes", async (req, res) => {
  const url = "https://api.onramper.com/supported/payment-types/moonpay/eur/btc";
  const response = await fetch(url);
  const data = await response.json();
  return res.json(data);
})

app.get("/getQuote", async (req, res) => {
  const { amount, paymentMethod, fiat, currency } = req.query;
  const url = `https://api.onramper.com/quotes/${fiat||"usd"}/${currency||"eth"}?amount=${amount||100}&paymentMethod=${paymentMethod||"creditcard"}`;
  
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: process.env.ONRAMPER_API_KEY
    }
  });
  const data = await response.json();
  console.log(data)
  await saveResponse(url, data);

  return res.json(data);
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

app.get("/getCheckoutUrl", async (req, res) => {
  const { amount, fiat, currency, paymentMethod, network, address } = req.query;
  
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
    wallet: address||"",
    network: network||"ethereum"
  });
  console.log("Best quote:", bestQuote)
  
  return res.json(bestQuote);
})

app.post("/getCheckoutUrl", async (req, res) => {
  const { amount, fiat, currency, paymentMethod, network, address } = req.body;
  
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
    source: fiat,
    destination: cryptoId,
    amount: amount,
    type: "buy",
    paymentMethod: paymentMethod,
    wallet: address,
    network: network
  });
  console.log("Best quote:", bestQuote)

  const url = "https://api.onramper.com/checkout/intent";
  const payload = {
    onramp: bestQuote.ramp,
    source: fiat,
    destination: cryptoId,
    amount,
    type: "buy",
    paymentMethod,
    wallet: address,
    network: network
  }
  console.log("payload:", payload)
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
  return res.json(result);
})

app.listen(3000, () => {
  console.log("Server running on port 3000");
});