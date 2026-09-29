import React from 'react';
import { Box, Typography, Button, Card } from '@mui/material';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <Card sx={{
          p: 4,
          m: 2,
          textAlign: 'center',
          bgcolor: 'rgba(255, 90, 121, 0.08)',
          border: '1px solid rgba(255, 90, 121, 0.3)',
          borderRadius: 4,
          color: '#fff'
        }}>
          <Typography fontSize={40} sx={{ mb: 1 }}>⚠️</Typography>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#ff8fa3', mb: 1 }}>
            Ops, houve uma oscilação nesta seção.
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2.5 }}>
            Não se preocupe, seus dados e progresso continuam salvos com segurança!
          </Typography>
          <Button
            variant="contained"
            onClick={this.handleReset}
            sx={{
              bgcolor: '#00b4d8',
              fontWeight: 800,
              borderRadius: 3,
              px: 3,
              '&:hover': { bgcolor: '#0096c7' }
            }}
          >
            Tentar Novamente
          </Button>
        </Card>
      );
    }

    return this.props.children;
  }
}
