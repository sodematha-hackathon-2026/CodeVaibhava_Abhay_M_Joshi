import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Alert,
  Avatar,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/utils/firebase';
import { Visibility, VisibilityOff, ArrowBack } from '@mui/icons-material';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin');
    } catch (err) {
      setError('Invalid email or password');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #fff4e6 0%, #ffe0b2 50%, #ffcc80 100%)',
        position: 'relative',
      }}
    >
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/')}
        sx={{
          position: 'absolute',
          top: 20,
          left: 20,
          color: '#ff6b00',
          fontWeight: 600,
          '&:hover': {
            bgcolor: 'rgba(255, 107, 0, 0.1)',
          },
        }}
      >
        Back to Home
      </Button>

      <Container component="main" maxWidth="sm">
        <Paper
          elevation={10}
          sx={{
            p: 5,
            borderRadius: 4,
            background: 'white',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 2,
                background: 'linear-gradient(135deg, #ff6b00 0%, #ff8f00 100%)',
                fontSize: '2.5rem',
                fontWeight: 700,
              }}
            >
            </Avatar>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: '#ff6b00',
                mb: 1,
              }}
            >
              Sode Sri Vadiraja Matha
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
              Admin Dashboard
            </Typography>
          </Box>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 2,
              }}
              onClose={() => setError('')}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: '#ff6b00',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#ff6b00',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#ff6b00',
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: '#ff6b00',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#ff6b00',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#ff6b00',
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 4,
                mb: 2,
                py: 1.5,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #ff6b00 0%, #ff8f00 100%)',
                fontWeight: 700,
                fontSize: '1.1rem',
                textTransform: 'none',
                boxShadow: '0 4px 12px rgba(255, 107, 0, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #e65100 0%, #f57c00 100%)',
                  boxShadow: '0 6px 16px rgba(255, 107, 0, 0.4)',
                },
                '&:disabled': {
                  background: '#ccc',
                },
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </Box>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Protected area for authorized administrators only
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};