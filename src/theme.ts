// src/theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#003366',
    },
    secondary: {
      main: '#00bcd4',
    },
    background: {
      default: '#f5f6fa',
      paper: '#ffffff'
    },
    text: {
      primary: '#333',
    }
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    fontSize: 14, // Increase base font size
    h6: {
      fontWeight: 700,
      fontSize: '1.1rem'
    },
    h5: {
      fontWeight: 700,
      fontSize: '1.3rem'
    }
  },
  shape: {
    borderRadius: 8
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 12px rgba(0,0,0,0.08)',
          border: '1px solid #eee',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0px 8px 20px rgba(0,0,0,0.1)',
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        }
      }
    }
  }
});

export default theme;
