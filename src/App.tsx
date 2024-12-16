// src/App.tsx
import React, { useEffect } from 'react';
import { Box } from '@mui/material';

import Layout from './components/Layout';
import { StocksProvider } from './providers/StocksProvider';

const App: React.FC = () => {
  useEffect(() => {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        console.log("Notification permission granted");
      } else {
        console.log("Notification permission not granted");
      }
    });
  }, []);

  return (
    <StocksProvider>
      <Box sx={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
        <Layout />
      </Box>
    </StocksProvider>
  );
};

export default App;
