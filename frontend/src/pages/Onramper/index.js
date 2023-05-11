import { useSearchParams } from 'react-router-dom';
import "./index.css";

export const Onramper = () => {
  const [searchParams] = useSearchParams();
  const currency = searchParams.get('currency'); 
  const network = searchParams.get('network'); 
  console.log(currency, network);
  return (
    <div className="onramper-container">
      <iframe
        style={{ borderRadius: '4px', border: '1px solid #58585f', margin: 'auto', maxWidth: '420px' }}
        src={`https://buy.onramper.com/?apiKey=${process.env.REACT_APP_ONRAMPER_API_KEY}`}
        height="630px"
        width="420px"
        title="Onramper widget"
        allow="accelerometer; autoplay; camera; gyroscope; payment">
      </iframe>
    </div>
  );
}

