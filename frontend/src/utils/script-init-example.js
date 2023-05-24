import { keypOnrampWidget } from './keyp-widget';

let createWidget = new keypOnrampWidget({
  // (It should be an id of an element not a class) which is set in step 2 above
  elementId: "widget", // Mandatory
  apiKey: "{api_key}", // Mandatory
  walletAddress: "0xEcc24eab0fb83Ef0c536b35C44C578F750FDBB6E", // Optional
  fiatAmount: 100, // Optional (If passed then minimum amount is 100 inr)
  userEmail: "test@test.com", // Optional (if passed user don't have to register in meta platform)
  chainId: "80001", // Optional (it should be passed along with the tokenAddress to show a particular token to the user)
  tokenAddress: "0xEcc24eab0fb83Ef0c536b35C44C578F750FDBB6E", // Optional
  metaData: {"userID" : "ABCDXXX", "userName" : "user"}, // Optional
  successRedirectUrl : "https://www.sample.net", // Optional
  failureRedirectUrl : "https://www.sample.net", // Optional
});
createWidget.init(); // it will initialize the widget inside the particular div element
createWidget.on(eventType, callbackFn); // this method will listen to the events of the widget