import React, { useEffect, useState } from 'react';
import {
  Box, Button, TextField, Typography, Alert, CircularProgress, Paper, Grid,
} from '@mui/material';
import { Save as SaveIcon, TempleHindu } from '@mui/icons-material';
import { mathaInfoService } from '@/services';
import { MathaInfoUpdateRequest } from '@/types';

export const MathaInfoPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<MathaInfoUpdateRequest>({
    morningDarshan: '', morningPrasada: '',
    eveningDarshan: '', eveningPrasada: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { fetchMathaInfo(); }, []);

  const fetchMathaInfo = async () => {
    try {
      setLoading(true);
      const data = await mathaInfoService.get();
      setFormData({
        morningDarshan: data.morningDarshan,
        morningPrasada: data.morningPrasada,
        eveningDarshan: data.eveningDarshan,
        eveningPrasada: data.eveningPrasada,
      });
    } catch (err) {
      setError('Failed to load matha info');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mathaInfoService.update(formData);
      setMessage('Matha timings updated successfully');
      fetchMathaInfo();
    } catch (err) {
      setError('Failed to update matha info');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <CircularProgress sx={{ color: '#ff6b00' }} size={60} />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#333', mb: 1 }}>
          Matha Timings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Update darshan and prasada timings
        </Typography>
      </Box>

      {message && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setMessage('')}>{message}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError('')}>{error}</Alert>}

      <Paper sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
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
          <TempleHindu sx={{ fontSize: 40 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Daily Schedule
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Darshan and Prasada timings for devotees
            </Typography>
          </Box>
        </Box>

        <form onSubmit={handleSubmit}>
          <Box sx={{ p: 4 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Paper
                  sx={{
                    p: 3,
                    bgcolor: '#fff9f0',
                    borderRadius: 2,
                    border: '2px solid #ffe0b2',
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#ff6b00' }}>
                    🌅 Morning Schedule
                  </Typography>
                  <TextField
                    fullWidth
                    label="Morning Darshan Time"
                    name="morningDarshan"
                    value={formData.morningDarshan}
                    onChange={handleChange}
                    required
                    margin="normal"
                    placeholder="e.g., 6:00 AM - 8:00 AM"
                    helperText="Enter the morning darshan timings"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        bgcolor: 'white',
                        '&.Mui-focused fieldset': { borderColor: '#ff6b00' },
                      },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#ff6b00' },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Morning Prasada Time"
                    name="morningPrasada"
                    value={formData.morningPrasada}
                    onChange={handleChange}
                    required
                    margin="normal"
                    placeholder="e.g., 8:00 AM - 9:00 AM"
                    helperText="Enter the morning prasada timings"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        bgcolor: 'white',
                        '&.Mui-focused fieldset': { borderColor: '#ff6b00' },
                      },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#ff6b00' },
                    }}
                  />
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper
                  sx={{
                    p: 3,
                    bgcolor: '#f3e5f5',
                    borderRadius: 2,
                    border: '2px solid #e1bee7',
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#7b1fa2' }}>
                    🌆 Evening Schedule
                  </Typography>
                  <TextField
                    fullWidth
                    label="Evening Darshan Time"
                    name="eveningDarshan"
                    value={formData.eveningDarshan}
                    onChange={handleChange}
                    required
                    margin="normal"
                    placeholder="e.g., 5:00 PM - 7:00 PM"
                    helperText="Enter the evening darshan timings"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        bgcolor: 'white',
                        '&.Mui-focused fieldset': { borderColor: '#7b1fa2' },
                      },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#7b1fa2' },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Evening Prasada Time"
                    name="eveningPrasada"
                    value={formData.eveningPrasada}
                    onChange={handleChange}
                    required
                    margin="normal"
                    placeholder="e.g., 7:00 PM - 8:00 PM"
                    helperText="Enter the evening prasada timings"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        bgcolor: 'white',
                        '&.Mui-focused fieldset': { borderColor: '#7b1fa2' },
                      },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#7b1fa2' },
                    }}
                  />
                </Paper>
              </Grid>
            </Grid>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                size="large"
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
                }}
              >
                Save Timings
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>

      <Alert severity="info" sx={{ mt: 3, borderRadius: 2 }}>
        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
          Note: Only timing information is stored
        </Typography>
        <Typography variant="body2">
          This page manages darshan and prasada timings only. 
          Other contact details, address, and GPS coordinates are not supported in the current backend implementation.
        </Typography>
      </Alert>
    </Box>
  );
};
export default MathaInfoPage;