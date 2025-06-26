import React, { useState, useEffect, useRef } from 'react';
import api from '../../Api/axios';

const DriverTimer = () => {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      const now = new Date();
      setStartTime(now);
      intervalRef.current = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }
    else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [running]);

  const handleStart = () => setRunning(true);
  const handlePause = async () => {
    const endTime = new Date();
    const payload = {
      
    };

    try {
      await api.post('api/driverlog', {
        datestart: startTime?.toISOString(),
        dateend: endTime.toISOString()
      });

      console.log('Timer data sent:', payload);
    } catch (error) {
      console.error('Error sending timer data:', error);
    }

    setRunning(false)

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