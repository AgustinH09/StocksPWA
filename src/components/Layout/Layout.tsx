import React from 'react';
import { Box, AppBar, Toolbar, Typography, Grid, Paper, Divider } from '@mui/material';

import LeftForm from 'components/LeftForm';
import TopCards from 'components/TopCards';
import StockChart from 'components/StockChart';

const Layout: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        bgcolor: 'background.default'
      }}
    >
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 700 }}>
            StockView PWA
          </Typography>
        </Toolbar>
      </AppBar>
      <Divider />

      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Paper
          elevation={0}
          sx={{
            width: 300,
            borderRight: '1px solid #ddd',
            padding: 3,
            overflowY: 'auto',
            bgcolor: 'background.paper'
          }}
        >
          <LeftForm />
        </Paper>

        <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
          <Grid container spacing={3} sx={{ height: '100%' }}>
            <Grid item xs={12}>
              <TopCards />
            </Grid>
            <Grid item xs={12} sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <StockChart />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
