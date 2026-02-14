import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/utils/firebase';
import { useStore } from '@/store';
import { MainLayout } from '@/components/layout/MainLayout';
import { LoginPage } from '@/pages/Login';
import { Dashboard } from '@/pages/Dashboard';
import { ConfigPage } from '@/pages/Config';
import { EventsPage } from '@/pages/Events';
import { GalleryPage } from '@/pages/Gallery';
import { ArtefactsPage } from '@/pages/Artefacts';
import { HistoryPage } from '@/pages/History';
import { SevasPage } from '@/pages/Sevas';
import { RoomBookingsPage } from '@/pages/RoomBookings';
import { SevaOrdersPage } from '@/pages/SevaOrders';
import { QuizPage } from '@/pages/Quiz';
import { NewsPage } from '@/pages/News';
import { FlashPage } from '@/pages/Flash';
import { SocialPage } from '@/pages/Social';
import { MathaInfoPage } from '@/pages/MathaInfo';
import { LandingPage } from './pages/LandingPage';
import { UsersPage } from './pages/Users';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ff6b00',
    },
    secondary: {
      main: '#1976d2',
    },
  },
});

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useStore((state) => state.user);
  const loading = useStore((state) => state.loading);

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  const setUser = useStore((state) => state.setUser);
  const setLoading = useStore((state) => state.setLoading);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <MainLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="config" element={<ConfigPage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="gallery" element={<GalleryPage />} />
            <Route path="artefacts" element={<ArtefactsPage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="sevas" element={<SevasPage />} />
            <Route path="room-bookings" element={<RoomBookingsPage />} />
            <Route path="seva-orders" element={<SevaOrdersPage />} />
            <Route path="quiz" element={<QuizPage />} />
            <Route path="news" element={<NewsPage />} />
            <Route path="flash" element={<FlashPage />} />
            <Route path="social" element={<SocialPage />} />
            <Route path="matha-info" element={<MathaInfoPage />} />
            <Route path="users" element={<UsersPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
