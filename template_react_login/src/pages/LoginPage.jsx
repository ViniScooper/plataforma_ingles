import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Card,
  Typography,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import apiClient from '../utils/apiClient';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleModeChange = (event, newMode) => {
    if (newMode) {
      setMode(newMode);
      setError('');
      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'register') {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        const response = await apiClient.post('/auth/signup', {
          name: formData.name,
          email: formData.email,
          username: formData.email.split('@')[0], // Auto-generate username from email
          password: formData.password,
        });

        login(response.data.user, response.data.token);
        navigate(response.data.user.role === 'admin' ? '/admin' : '/student');
      } else {
        // Login mode
        const response = await apiClient.post('/auth/signin', {
          email: formData.email,
          password: formData.password,
        });

        login(response.data.user, response.data.token);
        navigate(response.data.user.role === 'admin' ? '/admin' : '/student');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card sx={{ width: '100%', p: 4 }}>
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" sx={{ mb: 1, fontWeight: 'bold', color: '#1976d2' }}>
            🌍 English Platform
          </Typography>
          <ToggleButtonGroup value={mode} exclusive onChange={handleModeChange} sx={{ mb: 2 }}>
            <ToggleButton value="login">Login</ToggleButton>
            <ToggleButton value="register">Sign Up</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {mode === 'register' && (
            <TextField
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
            />
          )}

          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
          />

          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            required
          />

          {mode === 'register' && (
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              fullWidth
              required
            />
          )}

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mt: 2, py: 1.5 }}
          >
            {loading ? 'Loading...' : mode === 'login' ? 'Login' : 'Sign Up'}
          </Button>
        </Box>

        {mode === 'login' && (
          <Typography sx={{ mt: 3, fontSize: '0.9rem', color: '#666', textAlign: 'center' }}>
            Demo: admin@test.com / admin123 (after seeding)
          </Typography>
        )}
      </Card>
    </Container>
  );
}
