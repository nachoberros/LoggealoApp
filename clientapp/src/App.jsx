import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Pages/Home';
import About from './Pages/About';
import { useState } from 'react';
import PrivateRoute from './Components/PrivateRoute';
import DriverTimer from './Components/Drivers/DriverTimer';
import DriverTimerHistory from './Components/Drivers/DriverTimerHistory';
import Login from './Pages/Login';
import './App.css'

function App() {
  const [open, setOpen] = useState({
    drivers: false
  })

  const token = localStorage.getItem('token');

  const toggle = (key) => {
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Router>
      {/* Menu */}
      {token && (
        <nav className='tree-menu' style={{ display: 'flex', gap: '1rem', marginBottom: '20px' }}>
          <ul className='tree-list'>
            <li className={open.drivers ? 'open' : ''}>
              <span onClick={() => toggle('drivers')} className="tree-node">
                Drivers
              </span>
              {open.drivers && (
                <ul className="tree-children">
                  <li><Link to="/driverlog">Log</Link></li>
                  <li><Link to="/driverloghistory">Log History</Link></li>
                </ul>
              )}
            </li>
          </ul>
          <Link to="/">Home</Link>
        </nav>
      )}
      {/* Routes */}
      <Routes>
        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<PrivateRoute><About /></PrivateRoute>} />
        <Route path="/driverlog" element={<PrivateRoute><DriverTimer /></PrivateRoute>} />
        <Route path="/driverloghistory" element={<PrivateRoute><DriverTimerHistory /></PrivateRoute>} />
      </Routes>
    </Router>
  )
}

export default App
