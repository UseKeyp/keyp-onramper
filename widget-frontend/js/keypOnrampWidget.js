class keypOnrampWidget {
  constructor({
    apiKey,
    network,
    walletAddress,
    currency,
    widgetHeight,
    widgetWidth,
    iframeStyles,
    elementId,
  }) {
    this.apiKey = apiKey || "";
    this.network = network || "POLYGON";
    this.walletAddress = walletAddress || "";
    this.currency = currency || "ETH";
    this.widgetHeight = widgetHeight || "630px";
    this.widgetWidth = widgetWidth || "420px";
    this.iframeStyles = iframeStyles || {};
    this.elementId = elementId;
  }
  init() {
    let iframe = document.createElement("iframe");
    iframe.id = "keypOnrampWidgetId";
    iframe.allow = "accelerometer; autoplay; camera; gyroscope; payment";
    const iframeCustomStyles = {
      border: "none",
      minHeight: this.widgetHeight,
      minWidth: "100%",
      overflow: "hidden",
      ...this.iframeStyles,
    };
    Object.assign(iframe.style, iframeCustomStyles); // for adding the custom styles in the iframe
    if (!this.apiKey) {
      iframe.srcdoc = `<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"/> <meta http-equiv="X-UA-Compatible" content="IE=edge"/> <meta name="viewport" content="width=device-width, initial-scale=1.0"/> <title>Document</title> </head> <body> <div> <p>Invalid api key</p></div></body></html>`;
    } else {
      iframe.src = "https://buy.onramper.com" + this.constructUrl();
    }
    let element = document.getElementById(this.elementId);
    if (!element) {
      console.error(`DOM element with id ${this.elementId} was not found. Unable to create widget.`)
      throw new Error('DOM element not found');
    }
    element.appendChild(iframe);
  }
  constructUrl() {
    let widgetUrl = "/?";
    this.apiKey && (widgetUrl += `apiKey=${this.apiKey}`);
    this.network && (widgetUrl += `&onlyNetwork=${this.network}`);
    this.currency && (widgetUrl += `&onlyCryptos=${this.currency}`);
    this.walletAddress && (widgetUrl += `&wallets=ETH:${this.walletAddress}`);

    return widgetUrl += '&isAddressEditable=false';
  }
}

window.keypOnrampWidget = keypOnrampWidget;
