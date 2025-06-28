import React, { useState, useEffect, useRef } from 'react';
import api from '../../Api/axios';

const DriverTimer = () => {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  // Load state from localStorage
  useEffect(() => {
    const storedStart = localStorage.getItem('driverTimerStart');
    if (storedStart) {
      const start = new Date(storedStart);
      const elapsed = Math.floor((Date.now() - start.getTime()) / 1000);
      setSeconds(elapsed);
      setRunning(true);
    }
  }, []);

  // Timer effect
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [running]);

  const handleStart = () => {
    const now = new Date();
    localStorage.setItem('driverTimerStart', now.toISOString());
    setSeconds(0);
    setRunning(true);
  };

  const handlePause = async () => {
    const startTime = new Date(localStorage.getItem('driverTimerStart'));
    const endTime = new Date();

    try {
      await api.post('api/driverlog', {
        datestart: startTime.toISOString(),
        dateend: endTime.toISOString()
      });

      console.log('Timer data sent');
    } catch (error) {
      console.error('Error sending timer data:', error);
    }

    localStorage.removeItem('driverTimerStart');
    setRunning(false);
    setSeconds(0);
  };

  return (
    <div>
      <h2>Time: {seconds}s</h2>
      {!running ? (
        <button onClick={handleStart}>Start</button>
      ) : (
        <button onClick={handlePause}>Pause</button>
      )}
    </div>
  );
};

export default DriverTimer;
