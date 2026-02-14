import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
  ToggleButtonGroup,
  ToggleButton,
  Paper,
} from '@mui/material';
import {
  CardGiftcard,
  AttachMoney,
  People,
  PendingActions,
  TrendingUp,
} from '@mui/icons-material';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { dashboardService } from '@/services';
import { DashboardStats, ChartData } from '@/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [sevasTrend, setSevasTrend] = useState<ChartData | null>(null);
  const [revenueTrend, setRevenueTrend] = useState<ChartData | null>(null);
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, sevasData, revenueData] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getSevasTrend(period),
        dashboardService.getRevenueTrend(period),
      ]);
      setStats(statsData);
      setSevasTrend(sevasData);
      setRevenueTrend(revenueData);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [period]);

  const StatCard = ({
    title,
    value,
    icon: Icon,
    gradient,
  }: {
    title: string;
    value: string | number;
    icon: typeof CardGiftcard;
    gradient: string;
  }) => (
    <Card
      sx={{
        height: '100%',
        background: gradient,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100px',
          height: '100px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          transform: 'translate(30%, -30%)',
        },
      }}
    >
      <CardContent sx={{ position: 'relative', zIndex: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="overline" sx={{ opacity: 0.9, fontWeight: 600, letterSpacing: 1 }}>
              {title}
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 700, mt: 1 }}>
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              borderRadius: '50%',
              p: 2,
              backdropFilter: 'blur(10px)',
            }}
          >
            <Icon sx={{ fontSize: 40 }} />
          </Box>
        </Box>
        <Box
          sx={{
            mt: 2,
            pt: 2,
            borderTop: '1px solid rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <TrendingUp sx={{ fontSize: 20 }} />
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Updated just now
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading || !stats) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} sx={{ color: '#ff6b00' }} />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: '#333',
            mb: 1,
          }}
        >
          Dashboard Overview
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Real-time statistics and analytics
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Sevas"
            value={stats.totalSevas}
            icon={CardGiftcard}
            gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Revenue"
            value={`₹${stats.totalRevenue.toLocaleString()}`}
            icon={AttachMoney}
            gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Users"
            value={stats.activeUsers}
            icon={People}
            gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Bookings"
            value={stats.pendingBookings}
            icon={PendingActions}
            gradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
          />
        </Grid>
      </Grid>

      <Paper
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#333' }}>
            Analytics
          </Typography>
          <ToggleButtonGroup
            value={period}
            exclusive
            onChange={(_, newPeriod) => newPeriod && setPeriod(newPeriod)}
            size="small"
            sx={{
              '& .MuiToggleButton-root': {
                px: 3,
                fontWeight: 600,
                '&.Mui-selected': {
                  bgcolor: '#ff6b00',
                  color: 'white',
                  '&:hover': {
                    bgcolor: '#e65100',
                  },
                },
              },
            }}
          >
            <ToggleButton value="week">Week</ToggleButton>
            <ToggleButton value="month">Month</ToggleButton>
            <ToggleButton value="year">Year</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                p: 3,
                borderRadius: 2,
                border: '1px solid #f0f0f0',
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#333' }}>
                Sevas Booked
              </Typography>
              {sevasTrend && (
                <Line
                  data={sevasTrend}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { display: false },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: { color: '#f5f5f5' },
                      },
                      x: {
                        grid: { display: false },
                      },
                    },
                  }}
                />
              )}
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                p: 3,
                borderRadius: 2,
                border: '1px solid #f0f0f0',
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#333' }}>
                Revenue Trend
              </Typography>
              {revenueTrend && (
                <Bar
                  data={revenueTrend}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { display: false },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: { color: '#f5f5f5' },
                      },
                      x: {
                        grid: { display: false },
                      },
                    },
                  }}
                />
              )}
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};