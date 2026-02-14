import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  AppBar,
  Toolbar,
  Stack,
  alpha,
} from "@mui/material";
import {
  Event as EventIcon,
  PhotoLibrary as GalleryIcon,
  Book as BookIcon,
  Login as LoginIcon,
} from "@mui/icons-material";

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const menuItems = [{ label: "Admin Login", path: "/login" }];

  const offerings = [
    {
      icon: <EventIcon sx={{ fontSize: 60, color: "#1976d2" }} />,
      title: "Events & Festivals",
      description:
        "Update the Events & Festivals",
    },
    {
      icon: <GalleryIcon sx={{ fontSize: 60, color: "#2e7d32" }} />,
      title: "Gallery",
      description: "Update photos and videos from our sacred events",
    },
    {
      icon: <BookIcon sx={{ fontSize: 60, color: "#ff6b00" }} />,
      title: "Artefacts & History",
      description: "Update our rich heritage and spiritual teachings",
    },
  ];

  return (
    <Box sx={{ bgcolor: "#fafafa" }}>
      {/* Header */}
      <AppBar
        position="sticky"
        sx={{ bgcolor: "white", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: "space-between", px: { xs: 0 } }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #ff6b00 0%, #ff8f00 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                }}
              >
                <img
                  src="../../assests/logo.png"
                  alt="logo"
                  width={90}
                  height={60}
                />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  color: "#333",
                  fontWeight: 700,
                  fontSize: { xs: "1rem", md: "1.25rem" },
                }}
              >
                Sri Sode Vadiraja Matha
              </Typography>
            </Box>

            <Stack
              direction="row"
              spacing={{ xs: 1, md: 3 }}
              sx={{ display: { xs: "none", md: "flex" } }}
            >
              {menuItems.map((item) => (
                <Button
                  key={item.label}
                  href={item.path}
                  onClick={(e) => {
                    if (item.path === "/login") {
                      e.preventDefault();
                      navigate("/login");
                    }
                  }}
                  sx={{
                    color: "#333",
                    fontWeight: 600,
                    "&:hover": {
                      color: "#ff6b00",
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Stack>

            <Button
              variant="contained"
              startIcon={<LoginIcon />}
              onClick={() => navigate("/login")}
              sx={{
                background: "linear-gradient(135deg, #ff6b00 0%, #ff8f00 100%)",
                px: 3,
                display: { xs: "flex", md: "none" },
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #e65100 0%, #f57c00 100%)",
                },
              }}
            >
              Admin
            </Button>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Hero Section - Following Screenshot Layout */}
      <Box
        sx={{
          background: "linear-gradient(180deg, #fff4e6 0%, #ffffff 100%)",
          borderBottom: "4px solid #ff6b00",
          py: { xs: 6, md: 10 },
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 700,
                color: "#8B4513",
                mb: 3,
                fontSize: { xs: "2.5rem", md: "3.5rem" },
              }}
            >
              Welcome to Sri Sode Vadiraja Matha
            </Typography>

            <Box
              sx={{
                height: 3,
                width: 120,
                bgcolor: "#ff6b00",
                mx: "auto",
                mb: 4,
              }}
            />

            <Typography
              variant="h6"
              sx={{
                color: "#666",
                maxWidth: 800,
                mx: "auto",
                lineHeight: 1.8,
                fontSize: { xs: "1rem", md: "1.25rem" },
                px: 2,
              }}
            >
              A sacred abode of spirituality, devotion, and ancient wisdom.
              Experience the divine presence and immerse yourself in the
              timeless traditions that have guided seekers for generations.
            </Typography>
          </Box>

          {/* Placeholder for Logo and Swamiji Photos */}
          <Grid
            container
            spacing={4}
            alignItems="center"
            justifyContent="center"
            sx={{ mt: 4 }}
          >
            <Grid item xs={12} md={3}>
              <Box
                component="img"
                src="../../assests/Vishwotham1.png"
                alt="H.H Sri Vishwavallabha Theertha Swamiji"
                sx={{
                  width: "100%",
                  height: "300px",
                  objectFit: "cover",
                  objectPosition: "top",
                  borderRadius: "8px",
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  width: 290,
                  height: 280,
                  mx: "auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  component="img"
                  src="../../assests/logo.png"
                  alt="Vadiraja Matha Logo"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={3}>
              <Box
                component="img"
                src="../../assests/Vishwavallabha1.png"
                alt="H.H Sri Vishwavallabha Theertha Swamiji"
                sx={{
                  width: "100%",
                  height: "300px",
                  objectFit: "cover",
                  objectPosition: "top",
                  borderRadius: "8px",
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Offerings Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Typography
          variant="h3"
          sx={{
            textAlign: "center",
            fontWeight: 700,
            mb: 6,
            color: "#333",
            fontSize: { xs: "2rem", md: "2.5rem" },
          }}
        >
          Explore Our Sacred Offerings
        </Typography>

        <Grid container spacing={4}>
          {offerings.map((offering, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: "100%",
                  textAlign: "center",
                  p: 4,
                  transition: "all 0.3s ease",
                  border: "2px solid transparent",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
                    borderColor: "#ff6b00",
                  },
                }}
              >
                <Box sx={{ mb: 3 }}>{offering.icon}</Box>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, mb: 2, color: "#333" }}
                >
                  {offering.title}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ lineHeight: 1.7 }}
                >
                  {offering.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #ff6b00 0%, #ff8f00 100%)",
          color: "white",
          py: 8,
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 3,
              fontSize: { xs: "2rem", md: "2.5rem" },
            }}
          >
            Join Our Spiritual Journey
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.95 }}>
            Connect with thousands of devotees and experience divine blessings
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/login")}
              sx={{
                bgcolor: "white",
                color: "#ff6b00",
                px: 5,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 700,
                "&:hover": {
                  bgcolor: "#fff4e6",
                },
              }}
            >
              Admin Login
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: "white",
                color: "white",
                px: 5,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 700,
                borderWidth: 2,
                "&:hover": {
                  borderColor: "white",
                  borderWidth: 2,
                  bgcolor: alpha("#fff", 0.1),
                },
              }}
            >
              Learn More
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: "#1a1a1a", color: "white", py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, mb: 2, color: "#ff6b00" }}
              >
                Sode Sri Vadiraja Matha
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                Trailokya Guru Sriman Madhwacharya Moola Maha Samsthana
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Sri Sode Vadiraja Matha Sonda, Sirsi Taluk,
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, mb: 2, color: "#ff6b00" }}
              >
                Contact
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                Email: office@sodematha.in
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Follow: @sodematha on Instagram, Facebook, YouTube
              </Typography>
            </Grid>
          </Grid>
          <Box
            sx={{
              textAlign: "center",
              mt: 4,
              pt: 4,
              borderTop: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              © {new Date().getFullYear()} Sode Sri Vadiraja Matha. All rights
              reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
