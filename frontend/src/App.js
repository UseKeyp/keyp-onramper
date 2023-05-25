import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Onramper } from './pages/Onramper';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/onramper" element={<Onramper />} />
      </Routes>
    </Router>
  );
}

export default App;
