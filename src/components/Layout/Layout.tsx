import React from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Grid,
  Paper,
  Divider,
  Button,
} from "@mui/material";

import LeftForm from "components/LeftForm";
import TopCards from "components/TopCards";
import StockChart from "components/StockChart";
import { useStocks } from "hooks/useStocks";

const Layout: React.FC = () => {
  const { stocks, addSymbol, removeSymbol } = useStocks();

  const handleAddDefaultStocks = async () => {
    const defaultSymbols = import.meta.env.VITE_DEFAULT_STOCK_SYMBOLS?.split(",").map((s: string) => s.trim()) || [];

    for (const symbol of Object.keys(stocks)) {
      if (!defaultSymbols.includes(symbol)) {
        removeSymbol(symbol);
      }
    }

    for (const symbol of defaultSymbols) {
      if (!stocks[symbol]) {
        await addSymbol(symbol);
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        bgcolor: "background.default",
      }}
    >
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 700 }}>
            StockView PWA
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleAddDefaultStocks}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              transition: "all 0.3s ease-in-out",
              ":hover": {
                backgroundColor: "secondary.dark",
                boxShadow: "0px 6px 8px rgba(0, 0, 0, 0.2)",
              },
            }}
          >
            Add Default Stocks
          </Button>
        </Toolbar>
      </AppBar>
      <Divider />

      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Paper
          elevation={0}
          sx={{
            width: 300,
            borderRight: "1px solid #ddd",
            padding: 3,
            overflowY: "auto",
            bgcolor: "background.paper",
          }}
        >
          <LeftForm />
        </Paper>

        <Box sx={{ flex: 1, p: 3, overflow: "auto" }}>
          <Grid container spacing={3} sx={{ height: "100%" }}>
            <Grid item xs={12}>
              <TopCards />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ flex: 1, display: "flex", flexDirection: "column" }}
            >
              <StockChart />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
