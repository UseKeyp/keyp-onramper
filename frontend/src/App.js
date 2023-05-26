import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Onramper } from './pages/Onramper';
import { OnramperDemo } from './pages/OnramperDemo';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/onramper" element={<Onramper />} />
        <Route exact path="/onramperDemo" element={<OnramperDemo />} />
      </Routes>
    </Router>
  );
}

export default App;
