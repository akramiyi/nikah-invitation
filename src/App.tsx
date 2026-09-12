import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NikahInvite from './pages/NikahInvite';
import CustomCursor from './components/CustomCursor/CustomCursor';
import './index.css';

function App() {
  return (
    <>
      <CustomCursor />
      <Router>
        <Routes>
          <Route path="/" element={<NikahInvite />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
