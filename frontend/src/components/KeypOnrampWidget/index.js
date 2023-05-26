import { useSearchParams } from 'react-router-dom';
import "./style.css";

export const KeypOnrampWidget = () => {
  const [searchParams] = useSearchParams();
  const currency = searchParams.get('currency');
  const network = searchParams.get('network'); 
  const currentUserAddress = searchParams.get('address');

  // prevent loading of iframe if any of the required params are missing
  if (!currency || !network || !currentUserAddress) {
    return (
      <div>
        <h1 style={{ color: 'red', textAlign: 'center', padding: '2rem' }}>Error: you must include currency, network and address URL parameters</h1>
      </div>
    )
  }

  return (
    <div className="onramper-container">
      <iframe
        style={{ borderRadius: '4px', border: '1px solid #58585f', margin: 'auto', maxWidth: '420px' }}
        src={`https://buy.onramper.com/?apiKey=${process.env.REACT_APP_ONRAMPER_API_KEY}&onlyCryptos=${currency}&onlyNetwork=${network}&isAddressEditable=false&wallets=ETH:${currentUserAddress}`}
        height="630px"
        width="420px"
        title="Onramper widget"
        allow="accelerometer; autoplay; camera; gyroscope; payment">
      </iframe>
    </div>
  );
}

