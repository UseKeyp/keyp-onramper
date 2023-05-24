import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Onramper } from './pages/Onramper';
import { OnramperScript } from './pages/OnramperScript';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/onramper" element={<Onramper />} />
        <Route exact path="/onramperscript" element={<OnramperScript />} />
      </Routes>
    </Router>
  );
}

export default App;
