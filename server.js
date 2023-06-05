import express from "express";
import fetch from "node-fetch";
import { config } from "dotenv";
import { storeWebhookInDB } from "./database.js";
import assert from "assert";
import { getBestQuote, verifySignature } from "./utils/index.js";

config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// TO DO:
// - Fix issues
// - Create collections from thunderclient
// - Remove defaults and add error messages for unsupported currencies, networks, etc.

// Receives the webhook from Onramper, verifies the signature and saves the response in the database
app.post("/webhooks", async (req, res) => {
  try {
    const signature = req.headers["X-Onramper-Webhook-Signature"]
    console.log("webhook:", req.body)
    /***** Verify the Webhook *****/
    // Include verification in production by uncommenting the next 2 lines
    // const verified = verifySignature(signature, process.env.ONRAMPER_SECRET, JSON.stringify(req.body))
    // assert(verified, "Signature does not match")
    await storeWebhookInDB(req.url, req.body, res)
    return res.status(200).json({ message: "Success" })
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

// Fix Here: Add req params
app.get("/v2/ramps/limits/:ramp/:fiat/:crypto/:paymentMethod", async (req, res) => {
  try {
    const { fiat, crypto, paymentMethod, ramp } = req.params;
    const url = `https://api.onramper.com/supported/limits/${ramp}/${fiat}/${crypto}/${paymentMethod}`;
    const response = await fetch(url);
    const data = await response.json();
    return res.status(200).json({data});
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})


app.get("/v2/ramps/getAllCurrencies", async (req, res) => {
  try {
    const url = "https://api.onramper.com/supported";
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: process.env.ONRAMPER_API_KEY
      }
    });
    const data = await response.json();
    return res.status(200).json({data});
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})


app.get("/v2/ramps/paymentTypes", async (req, res) => {
  try {
    const url = "https://api.onramper.com/supported/payment-types";
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: process.env.ONRAMPER_API_KEY
      }
    });
    const data = await response.json();
    return res.status(200).json({data});
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})


app.get("/v2/ramps/on/quotes", async (req, res) => {
  try {
    const { amount, paymentMethod, fiat, currency } = req.query;
    assert(amount, "Amount is required")
    assert(fiat, "fiat is required")
    assert(currency, "currency is required")
    const url = `https://api.onramper.com/quotes/${fiat}/${currency}?amount=${amount}&paymentMethod=${paymentMethod||"creditcard"}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: process.env.ONRAMPER_API_KEY
      }
    });
    const data = await response.json();
  
    return res.status(200).json({data});
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})


app.get("/v2/ramps/on/best-quote", async (req, res) => {
  try {
    const { amount, fiat, currency, paymentMethod, network, address } = req.query;
    assert(amount, "Amount is required")
    assert(address, "Wallet address is required")
    assert(network, "Network is required")
    const supported = await fetch("https://api.onramper.com/supported", {
      method: "GET",
      headers: {
        Authorization: process.env.ONRAMPER_API_KEY
      }
    });
    const { crypto: cryptos } = (await supported.json()).message
    const crypto = cryptos.find(c => c.code.toLowerCase() === currency && c.network.toLowerCase() === network);
    const cryptoId = crypto?.id;
    assert(cryptoId, "Currency is not supported")
  
    const bestQuote = await getBestQuote({
      source: fiat||"usd",
      destination: cryptoId,
      amount,
      type: "buy",
      paymentMethod: paymentMethod||"creditcard",
      wallet: address,
      network: network
    });
    
    return res.status(200).json({data: bestQuote});
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})


app.get("/v2/ramps/on/checkout", async (req, res) => {
  try {
    /***************************************
     * Authenticate Keyp ACCESS_TOKEN Here *
     ***************************************/
    
    const { amount, fiat, currency, network, address } = req.query;
    assert(amount, "Amount is required")
    assert(address, "Wallet address is required")
    assert(network, "Network is required")

    const supported = await fetch("https://api.onramper.com/supported", {
      method: "GET",
      headers: {
        Authorization: process.env.ONRAMPER_API_KEY
      }
    });
    const { crypto: cryptos } = (await supported.json()).message
    const crypto = cryptos.find(c => c.code.toLowerCase() === currency.toLowerCase() && c.network.toLowerCase() === network.toLowerCase());
    const cryptoId = crypto?.id;
    assert(cryptoId, "Currency is not supported")
    
    const baseUrl = "https://buy.onramper.com/";
    const url = `${baseUrl}?networkWallets=${network.toUpperCase()}:${address}&defaultAmount=${amount}&defaultFiat=${fiat}&defaultCrypto=${cryptoId.toUpperCase()}&apiKey=${process.env.ONRAMPER_API_KEY}`
    return res.status(200).json({ url });

    /*************************************************************************
     * TO DO: The commented lines below are where the GET "/checkout/intent" 
     * endpoint is not working but preferred for getting the direct link 
     * to checkout (transak, moonpay, etc.)
     *************************************************************************/
    // const payload = {
    //   onramp: bestQuote.ramp,
    //   source: fiat,
    //   destination: cryptoId,
    //   amount: parseFloat(amount),
    //   type: "buy",
    //   paymentMethod,
    //   wallet: address,
    //   network: network,
    // }
    // console.log("payload:", payload)
    // const response = await fetch(url, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "Authorization": process.env.ONRAMPER_API_KEY
    //   },
    //   body: JSON.stringify(payload)
    // })
    
    // console.log("status:", response.status, response.statusText)
    // const result = await response.json();
    // console.log("response:", result)
    // assert(result.status === 200, result.message)
    // return res.status(200).json({data: result});
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})


app.listen(3000, () => {
  console.log("Server running on port 3000");
});