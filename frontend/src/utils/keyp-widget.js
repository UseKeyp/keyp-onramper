class keypOnrampWidget {
  constructor({
    apiKey,
    network,
    walletAddress,
    currency,
    widgetHeight,
    widgetWidth,
    iframeStyles,
  }) {
    this.apiKey = apiKey || "";
    this.network = network || "POLYGON";
    this.walletAddress = walletAddress || "";
    this.currency = currency || "ETH";
    this.widgetHeight = widgetHeight || "630px";
    this.widgetWidth = widgetWidth || "420px";
    this.iframeStyles = iframeStyles || {};
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
      if (this.environment === "production") {
        iframe.src = "https://platform.onmeta.in" + this.constructUrl();
      } else if (this.environment === "staging") {
        iframe.src = "https://stg.platform.onmeta.in" + this.constructUrl();
      } else if (this.environment === "local") {
        iframe.src = "http://localhost:3000" + this.constructUrl();
      }
    }
    let element = document.getElementById(this.elementId);
    element.appendChild(iframe);
  }
  close() {
    window.removeEventListener(
      "message",
      this.receiveMessage.bind(this),
      false
    );
    window.localStorage.clear();
    window.sessionStorage.clear();
    let iframe = document.getElementById("keypOnrampWidgetId");
    iframe && iframe.remove();
    this.listeners = [];
  }
  on(eventType, callbackFn) {
    // if (this.isEventListnerOn) return;
    if (
      this.listeners.some(
        (l) => l.eventType === eventType && l.callbackFn === callbackFn
      )
    ) {
      return;
    }
    // window.addEventListener("message", receiveMessage, false);
    // this.isEventListnerOn = true;
    // Store the event listener in the listeners array for later removal
    this.listeners.push({ eventType, callbackFn });
  }
  constructUrl() {
    let widgetUrl = "/?";
    this.apiKey && (widgetUrl += `apiKey=${this.apiKey}`);
    this.walletAddress && (widgetUrl += `&walletAddress=${this.walletAddress}`);
    this.fiatAmount && (widgetUrl += `&fiatAmount=${this.fiatAmount}`);
    this.userEmail && (widgetUrl += `&userEmail=${this.userEmail}`);
    this.tokenAddress && (widgetUrl += `&tokenAddress=${this.tokenAddress}`);
    this.chainId && (widgetUrl += `&chainId=${this.chainId}`);
    this.offRamp && (widgetUrl += `&offRamp=${this.offRamp}`);
    this.onRamp && (widgetUrl += `&onRamp=${this.onRamp}`);
    this.minAmount && (widgetUrl += `&minAmount=${this.minAmount}`);
    this.metamask && (widgetUrl += `&metamask=${this.metamask}`);
    this.orderId && (widgetUrl += `&orderId=${this.orderId}`);
    this.successRedirectUrl &&
      (widgetUrl += `&successRedirectUrl=${this.successRedirectUrl}`);
    this.failureRedirectUrl &&
      (widgetUrl += `&failureRedirectUrl=${this.failureRedirectUrl}`);
    this.isAndroid && (widgetUrl += `&isAndroid=${this.isAndroid}`);
    this.metaData && (widgetUrl += `&metaData=${this.metaData}`);
    this.fiatType && (widgetUrl += `&fiatType=${this.fiatType}`);
    return widgetUrl;
  }
}
window.keypOnrampWidget = keypOnrampWidget;