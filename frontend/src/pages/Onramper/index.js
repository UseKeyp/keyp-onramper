import { KeypOnrampWidget } from '../../components/KeypOnrampWidget';
import "./index.css";
import KeypLogo from '../../images/keyp-logo.svg';

export const Onramper = () => {

  return (
    <div className="demo-container">
      <img src={KeypLogo} className="demo-logo" alt="keyp logo"/>
      <h1 className="demo-title">Keyp Onramp React.js Demo</h1>
      <KeypOnrampWidget />
    </div>
  );
}

