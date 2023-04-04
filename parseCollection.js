import fs from "fs";
import path from "path";

export function parseCollection(filename) {
    const collection = fs.readFileSync(
        path.join(`./${filename}.json`),
        "utf8"
    );
    return JSON.parse(collection);
}

function formatApiCollection(collection) {
    collection["item"].map(item => {
        const name = item["name"];
        const method = item["request"]["method"];
        const url = item["request"]["url"]["raw"];

        console.log(`app.${method.toLowerCase()}("/${name}", (req, res) => {
            const url = "${url}";
        })`)
    });
}

export function parseResponse(response) {
    return response.map(res => {
        const name = res["name"]
        const request = res["originalRequest"]["url"]["raw"]
        const reqMethod = res["originalRequest"]["method"]
        const status = res["status"]
        const cookies = res["cookies"]
        const body = res["body"]

        return JSON.parse(res["body"])
    });
}

const collection = parseCollection("OnramperAPICollection");
const getQuote = collection["item"].find(item => item["name"] === "getQuote");
const getQuoteResponse = getQuote["response"];
parseResponse(getQuoteResponse);