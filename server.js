import express from "express";
import fetch from "node-fetch";
import { config } from "dotenv";
import { parseCollection, parseResponse } from "./parseCollection.js";
import { saveResponse } from "./database.js";

config();
const app = express();

app.get("/limits", async (req, res) => {
  const url = "https://api.onramper.com/supported/limits/moonpay/eur/eth/creditcard";
  const response = await fetch(url);
  const data = await response.json();
  res.json(data);
})

app.get("/getAllCurrencies", async (req, res) => {
  const url = "https://api.onramper.com/supported";
  const response = await fetch(url);
  const data = await response.json();
  res.json(data);
})

app.get("/getPaymentTypes", async (req, res) => {
  const url = "https://api.onramper.com/supported/payment-types/moonpay/eur/btc";
  const response = await fetch(url);
  const data = await response.json();
  res.json(data);
})

app.get("/getQuote", async (req, res) => {
  const { amount, paymentMethod } = req.query;
  const url = `https://api.onramper.com/quotes/eur/eth?amount=${amount||100}&paymentMethod=${paymentMethod||"creditcard"}`;
  
  // REAL CODE
  // const response = await fetch(url, {
  //   method: "GET",
  //   headers: {
  //     Authorization: process.env.ONRAMPER_API_KEY
  //   }
  // });
  // const data = await response.json();
  
  // Simulating with Postman collection
  const response = parseCollection("OnramperAPICollection");
  const getQuote = response["item"].find(item => item["name"] === "getQuote");
  const getQuoteResponse = getQuote["response"];
  const data = parseResponse(getQuoteResponse);
  console.log(data)
  await saveResponse(url, data);

  res.json(data);
})

app.post("/checkoutintent", async (req, res) => {
  const url = "https://api.onramper.com/checkout/intent";
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

app.get("/getCheckoutUrl", async (req, res) => {
  // const { amount, currency, paymentMethod, network, address } = req.body;
  // Simulating with Postman collection
  const response = parseCollection("OnramperAPICollection");
  const getQuote = response["item"].find(item => item["name"] === "getQuote");
  const getQuoteResponse = getQuote["response"];
  const data = parseResponse(getQuoteResponse);
  
  const singleArray = []
  data.forEach(arr => {
    arr.forEach(item => {
      singleArray.push(item)
    })
  });
  const sorted = singleArray.sort((a, b) => -1*(a.payout - b.payout));
  const bestQuote = sorted[0];
  console.log("Best Quote: ", bestQuote);
  console.log("\nAll Quotes: ", sorted);
  return res.json(bestQuote);
})

app.listen(3000, () => {
  console.log("Server running on port 3000");
});