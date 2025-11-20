import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AtomDetail from './pages/AtomDetail';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/atom/:id" element={<AtomDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
