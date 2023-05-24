// This function will return true/false if the signature matches
export function verifySignature(signature, secret, body) {
  const hash = crypto.createHmac('sha256', secret).update(body).digest('hex');
  return (signature === hash);
};


export async function getBestQuote({
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
	
	const sorted = quotes.sort((a, b) => -1*(a.payout - b.payout));
	const bestQuote = sorted[0];
	return bestQuote;
}