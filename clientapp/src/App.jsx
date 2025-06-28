import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PrivateRoute from './Components/PrivateRoute';
import DriverTimer from './Components/Drivers/DriverTimer';
import DriverTimerHistory from './Components/Drivers/DriverTimerHistory';
import Login from './Pages/Login';
import Home from './Pages/Home';
import './App.css';

function App() {
  const [open, setOpen] = useState({
    drivers: false,
    account: false,
  });

  const [currentUser, setCurrentUser] = useState(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const toggle = (key) => {
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    navigate('/login');
  };

  return (
    <>
      {/* Menu */}
      {token && (
        <nav
          className="tree-menu"
          style={{ display: 'flex', gap: '1rem', marginBottom: '20px' }}
        >
          <ul className="tree-list">
            <Link to="/">Home</Link>
            <li className={open.drivers ? 'open' : ''}>
              <span onClick={() => toggle('drivers')} className="tree-node">
                Drivers
              </span>
              {open.drivers && (
                <ul className="tree-children">
                  <li>
                    <Link to="/driverlog">Log</Link>
                  </li>
                  <li>
                    <Link to="/driverloghistory">Log History</Link>
                  </li>
                </ul>
              )}
            </li>
            <li className={open.account ? 'open' : ''}>
              <span onClick={() => toggle('account')} className="tree-node">
                Account
              </span>
              {open.account && (
                <ul className="tree-children">
                  <li>
                    <strong>{currentUser?.name}</strong>
                  </li>
                  <li>
                    <button onClick={handleLogout}>Logout</button>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </nav>
      )}

      {/* Routes */}
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/driverlog"
          element={
            <PrivateRoute>
              <DriverTimer />
            </PrivateRoute>
          }
        />
        <Route
          path="/driverloghistory"
          element={
            <PrivateRoute>
              <DriverTimerHistory />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
