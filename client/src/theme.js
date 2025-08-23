import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#7b1fa2', // Vibrant purple
      light: '#ae52d4',
      dark: '#4a0072',
      contrastText: '#fff',
    },
    secondary: {
      main: '#ff9800', // Orange
      light: '#ffc947',
      dark: '#c66900',
      contrastText: '#fff',
    },
    background: {
      default: 'linear-gradient(135deg, #f3e7e9 0%, #e3eeff 100%)',
      paper: '#fff',
    },
    info: {
      main: '#00bcd4',
    },
    success: {
      main: '#43a047',
    },
    warning: {
      main: '#fbc02d',
    },
    error: {
      main: '#e53935',
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: 'Poppins, Roboto, Arial, sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: '0.02em',
    },
    h5: {
      fontWeight: 700,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px 0 rgba(123,31,162,0.08)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 4px 24px 0 rgba(123,31,162,0.10)',
        },
      },
    },
  },
});

export default theme;
