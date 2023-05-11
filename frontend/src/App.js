import './App.css';
import { BrowserRouter as Router, Route ,Link, Routes, useParams } from "react-router-dom";
import { Onramper } from './pages/Onramper';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/onramper">On Ramper</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route exact path="/onramper" element={<Onramper />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
