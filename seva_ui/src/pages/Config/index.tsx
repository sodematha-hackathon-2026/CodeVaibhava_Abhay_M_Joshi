import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  Button,
  Alert,
  CircularProgress,
  Grid,
  Paper,
  Divider,
} from '@mui/material';
import { Save as SaveIcon, Settings as SettingsIcon } from '@mui/icons-material';
import { configService } from '@/services/index';
import { AdminConfig } from '@/types';

export const ConfigPage: React.FC = () => {
  const [config, setConfig] = useState<AdminConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const data = await configService.get();
      setConfig(data);
    } catch (err) {
      setError('Failed to load configuration');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (field: keyof Omit<AdminConfig, 'id'>) => {
    if (config) {
      setConfig({ ...config, [field]: !config[field] });
    }
  };

  const handleSave = async () => {
    if (!config) return;

    try {
      setSaving(true);
      setMessage('');
      setError('');
      const { id, ...configData } = config;
      await configService.update(configData);
      setMessage('Configuration updated successfully');
    } catch (err) {
      setError('Failed to update configuration');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress sx={{ color: '#ff6b00' }} size={60} />
      </Box>
    );
  }

  if (!config) {
    return (
      <Alert severity="error" sx={{ borderRadius: 2 }}>
        Failed to load configuration
      </Alert>
    );
  }

  const features = [
    { key: 'enableEvents', label: 'Events & Calendar', icon: '📅' },
    { key: 'enableGallery', label: 'Photo & Video Gallery', icon: '📸' },
    { key: 'enableArtefacts', label: 'Artefacts & Publications', icon: '📚' },
    { key: 'enableHistory', label: 'History & Parampara', icon: '🕉️' },
    { key: 'enableRoomBooking', label: 'Room Booking', icon: '🏨' },
    { key: 'enableSeva', label: 'Seva Services', icon: '🙏' },
    { key: 'enableQuiz', label: 'Youth Quiz', icon: '🎯' },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#333', mb: 1 }}>
          App Configuration
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Enable or disable features in the mobile application
        </Typography>
      </Box>

      {message && (
        <Alert
          severity="success"
          sx={{ mb: 3, borderRadius: 2 }}
          onClose={() => setMessage('')}
        >
          {message}
        </Alert>
      )}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3, borderRadius: 2 }}
          onClose={() => setError('')}
        >
          {error}
        </Alert>
      )}

      <Paper
        sx={{
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            p: 3,
            background: 'linear-gradient(135deg, #ff6b00 0%, #ff8f00 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <SettingsIcon sx={{ fontSize: 40 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Feature Controls
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Toggle features on/off for all app users
            </Typography>
          </Box>
        </Box>

        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={3}>
            {features.map((feature) => (
              <Grid item xs={12} md={6} key={feature.key}>
                <Card
                  sx={{
                    p: 3,
                    border: '2px solid',
                    borderColor: config[feature.key as keyof AdminConfig]
                      ? '#ff6b00'
                      : '#e0e0e0',
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    bgcolor: config[feature.key as keyof AdminConfig]
                      ? '#fff4e6'
                      : 'white',
                    '&:hover': {
                      boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center" gap={2}>
                      <Typography sx={{ fontSize: '2rem' }}>{feature.icon}</Typography>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {feature.label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {config[feature.key as keyof AdminConfig] ? 'Enabled' : 'Disabled'}
                        </Typography>
                      </Box>
                    </Box>
                    <Switch
                      checked={config[feature.key as keyof AdminConfig] as boolean}
                      onChange={() => handleToggle(feature.key as keyof Omit<AdminConfig, 'id'>)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#ff6b00',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#ff6b00',
                        },
                      }}
                    />
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Box display="flex" justifyContent="center">
            <Button
              variant="contained"
              size="large"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={saving}
              sx={{
                background: 'linear-gradient(135deg, #ff6b00 0%, #ff8f00 100%)',
                px: 6,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 700,
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
              {saving ? 'Saving...' : 'Save Configuration'}
            </Button>
          </Box>
        </CardContent>
      </Paper>
    </Box>
  );
};