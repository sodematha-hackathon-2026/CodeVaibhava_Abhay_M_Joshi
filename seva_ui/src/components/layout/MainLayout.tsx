import React, { useState } from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  Event as EventIcon,
  Photo as PhotoIcon,
  Book as BookIcon,
  History as HistoryIcon,
  CardGiftcard as SevaIcon,
  Hotel as HotelIcon,
  Quiz as QuizIcon,
  Newspaper as NewsIcon,
  Announcement as FlashIcon,
  Share as SocialIcon,
  TempleHindu as TempleIcon,
  Receipt as ReceiptIcon,
  Logout as LogoutIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { auth } from '@/utils/firebase';

const drawerWidth = 280;

const menuItems = [
  { title: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
  { title: 'Config', icon: <SettingsIcon />, path: '/admin/config' },
  { title: 'Events', icon: <EventIcon />, path: '/admin/events' },
  { title: 'Gallery', icon: <PhotoIcon />, path: '/admin/gallery' },
  { title: 'Artefacts', icon: <BookIcon />, path: '/admin/artefacts' },
  { title: 'History', icon: <HistoryIcon />, path: '/admin/history' },
  { title: 'Sevas', icon: <SevaIcon />, path: '/admin/sevas' },
  { title: 'Room Bookings', icon: <HotelIcon />, path: '/admin/room-bookings' },
  { title: 'Seva Orders', icon: <ReceiptIcon />, path: '/admin/seva-orders' },
  { title: 'Quiz', icon: <QuizIcon />, path: '/admin/quiz' },
  { title: 'News', icon: <NewsIcon />, path: '/admin/news' },
  { title: 'Flash', icon: <FlashIcon />, path: '/admin/flash' },
  { title: 'Social Links', icon: <SocialIcon />, path: '/admin/social' },
  { title: 'Matha Info', icon: <TempleIcon />, path: '/admin/matha-info' },
  { title: 'Users', icon: <PeopleIcon />, path: '/admin/users' },
];

export const MainLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'linear-gradient(180deg, #fff9f0 0%, #ffffff 100%)' }}>
      <Box sx={{ p: 3, textAlign: 'center', background: 'linear-gradient(135deg, #ff6b00 0%, #ff8f00 100%)' }}>
        <Avatar
          sx={{
            width: 60,
            height: 60,
            mx: 'auto',
            mb: 1,
            bgcolor: 'white',
            color: '#ff6b00',
            fontSize: '2rem',
            fontWeight: 700,
          }}
        >
          
        </Avatar>
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 0.5 }}>
          Sode Matha
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)' }}>
          Admin Dashboard
        </Typography>
      </Box>
      
      <List sx={{ flexGrow: 1, px: 1, py: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton 
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  backgroundColor: isActive ? '#ff6b00' : 'transparent',
                  color: isActive ? 'white' : '#333',
                  '&:hover': {
                    backgroundColor: isActive ? '#e65100' : '#fff4e6',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <ListItemIcon sx={{ color: isActive ? 'white' : '#ff6b00', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.title}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.95rem',
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      
      <Divider />
      
      <ListItem disablePadding sx={{ p: 1 }}>
        <ListItemButton 
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            mx: 1,
            color: '#d32f2f',
            '&:hover': {
              backgroundColor: '#ffebee',
            },
          }}
        >
          <ListItemIcon sx={{ color: '#d32f2f', minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Logout"
            primaryTypographyProps={{ fontWeight: 600 }}
          />
        </ListItemButton>
      </ListItem>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: 'linear-gradient(135deg, #ff6b00 0%, #ff8f00 100%)',
          boxShadow: '0 2px 10px rgba(255,107,0,0.2)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
            Sode Sri Vadiraja Matha - Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, border: 'none' },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: '#f8f9fa',
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};