
# How to run locally


Clone the repo and run `yarn` 

copy `.env.example` to `.env`

Set values for `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` from your supabase account.

make sure you have docker running locally

run `yarn start`


# How to run Onramper Widget React.js Demo App


1. `cd frontend`

2. `yarn install`

3. `cp .env.example .env`

4. Add your Onramper API key to the .env file `REACT_APP_ONRAMPER_API_KEY`

5. `yarn start`

6. In a browser open `http://localhost:3000/onramper?currency=ETH&network=POLYGON&address=0x7b86F576669f8d20a8244dABEFc65b31d7dEB3f2`

7. If you want to inspect the 'Keyp wrapper around onramper widget' in the browser open this URL (notice the /onramperDemo path): `http://localhost:3000/onramperDemo?currency=ETH&network=POLYGON&address=0x7b86F576669f8d20a8244dABEFc65b31d7dEB3f2`


# How to run Onramper Widget JavaScript app


1. In a web browser, open the local index.html file in `keyp-onramper/widget-frontend/index.html`

2. Add the required query parameters `keyp-onramper/widget-frontend/index.html?currency=ETH&network=POLYGON&address=0x7b86F576669f8d20a8244dABEFc65b31d7dEB3f2&apiKey=<Add your Onramper API key here>`



# How to use React.js Widget


1. Inside your React app, get the variables 'currency', 'network' from the query parameters and the 'walletAddress' from the user session. Pass them to the iframe:
https://keyp-onramper.vercel.app/onramper?currency=ETH&network=POLYGON&address=0x7b86F576669f8d20a8244dABEFc65b31d7dEB3f2

```

  const renderOnramper = () => {
    const ONRAMPER_KEY = process.env.NEXT_PUBLIC_ONRAMPER_KEY;
    const CURRENCY = "ETH";
    const NETWORK = "POLYGON";
    const ADDRESS = session?.user.address;
    if (!ADDRESS) {
      return <Text fontSize="xl">Sign in first</Text>;
    }
    return (
      <Center height="700px">
        <iframe
          src={`ttps://keyp-onramper.vercel.app/onramper?currency=${CURRENCY}&network=${NETWORK}&isAddressEditable=false&address=${ADDRESS}`}
          frameborder="0"
          width="100%"
          height="100%"
        ></iframe>
      </Center>
    );
  };

```

# How to initiate JavaScript Widget


1. Import widget JS file


```
 <script src="js/keypOnrampWidget.js"></script>
```


2. Add root div element with id.


```

  <div id="keypWidget"></div>

```



3. Initialize widget 


```
    const currency = getUrlParameter('currency');
    const network = getUrlParameter('network');
    const walletAddress = getUrlParameter('address');
    const apiKey = getUrlParameter('apiKey');

    let createWidget = new keypOnrampWidget({
      elementId: "keypWidget",
      apiKey,
      network,
      currency,
      walletAddress
    });
    createWidget.init();
    
  ```








