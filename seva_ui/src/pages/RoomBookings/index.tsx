import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Alert,
  CircularProgress,
  TextField,
  MenuItem,
  Chip,
  Paper,
  Grid,
} from "@mui/material";
import { Hotel, Email, CheckCircle, Cancel } from "@mui/icons-material";
import { DataTable, Column, formatDate } from "@/components/common/DataTable";
import { roomBookingsService } from "@/services";
import { RoomBookingSummary, RoomBookingDetail } from "@/types";

export const RoomBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<RoomBookingSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailDialog, setDetailDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<RoomBookingDetail | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await roomBookingsService.list(
        statusFilter ? { status: statusFilter } : undefined,
      );
      setBookings(data);
    } catch (err) {
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const handleViewDetails = async (booking: RoomBookingSummary) => {
    try {
      const detail = await roomBookingsService.get(booking.id);
      setSelectedBooking(detail);
      setDetailDialog(true);
    } catch (err) {
      setError("Failed to load booking details");
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await roomBookingsService.updateStatus(id, { status });
      setMessage("Status updated successfully");
      fetchBookings();
      setDetailDialog(false);
    } catch (err) {
      setError("Failed to update status");
    }
  };

  const handleResendEmail = async (id: string) => {
    try {
      await roomBookingsService.resendEmail(id);
      setMessage("Email sent successfully");
      fetchBookings();
    } catch (err) {
      setError("Failed to send email");
    }
  };

  const columns: Column<RoomBookingSummary>[] = [
    { field: "nameOrMasked", headerName: "Name", width: 200 },
    { field: "mobile", headerName: "Phone", width: 150 },
    { field: "checkInDate", headerName: "Check-In", width: 120 },
    { field: "peopleCount", headerName: "Guests", width: 100 },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (i) => (
        <Chip
          label={i.status}
          size="small"
          color={
            i.status === "EMAIL_SENT"
              ? "success"
              : i.status === "EMAIL_FAILED"
                ? "error"
                : "default"
          }
        />
      ),
    },
    {
      field: "createdAt",
      headerName: "Created",
      width: 180,
      renderCell: (i) => formatDate(i.createdAt),
    },
  ];

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#333", mb: 1 }}>
            Room Bookings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage accommodation booking requests
          </Typography>
        </Box>
        <TextField
          select
          size="small"
          label="Filter by Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{
            width: 200,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '&.Mui-focused fieldset': { borderColor: '#ff6b00' },
            },
            '& .MuiInputLabel-root.Mui-focused': { color: '#ff6b00' },
          }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="NEW">New</MenuItem>
          <MenuItem value="EMAIL_SENT">Email Sent</MenuItem>
          <MenuItem value="EMAIL_FAILED">Email Failed</MenuItem>
        </TextField>
      </Box>

      {message && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setMessage("")}>
          {message}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress sx={{ color: "#ff6b00" }} />
        </Box>
      ) : (
        <DataTable
          rows={bookings}
          columns={columns}
          customActions={(row) => (
            <Button
              size="small"
              onClick={() => handleViewDetails(row)}
              sx={{
                color: "#ff6b00",
                fontWeight: 600,
                "&:hover": { bgcolor: "#fff4e6" },
              }}
            >
              View Details
            </Button>
          )}
          hideDefaultActions
        />
      )}

      <Dialog
        open={detailDialog}
        onClose={() => setDetailDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #ff6b00 0%, #ff8f00 100%)",
            color: "white",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Hotel />
          Booking Details
        </DialogTitle>
        <DialogContent sx={{ mt: 3 }}>
          {selectedBooking && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Guest Information</Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    <strong>Name:</strong> {selectedBooking.nameOrMasked}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Mobile:</strong> {selectedBooking.mobile}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Email:</strong> {selectedBooking.emailOrMasked || "N/A"}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper sx={{ p: 2, bgcolor: "#e3f2fd", borderRadius: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Booking Details</Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    <strong>Check-In:</strong> {selectedBooking.checkInDate}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Guests:</strong> {selectedBooking.peopleCount}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Notes:</strong> {selectedBooking.notesOrMasked || "N/A"}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper sx={{ p: 2, bgcolor: "#fff4e6", borderRadius: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Status Information</Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    <strong>Status:</strong>{" "}
                    <Chip
                      label={selectedBooking.status}
                      size="small"
                      color={
                        selectedBooking.status === "EMAIL_SENT"
                          ? "success"
                          : selectedBooking.status === "EMAIL_FAILED"
                            ? "error"
                            : "default"
                      }
                    />
                  </Typography>
                  <Typography variant="body1">
                    <strong>Consent to Store:</strong> {selectedBooking.consentToStore ? "Yes" : "No"}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Button
                    variant="contained"
                    startIcon={<CheckCircle />}
                    onClick={() => handleUpdateStatus(selectedBooking.id, "EMAIL_SENT")}
                    sx={{
                      background: "linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #1b5e20 0%, #388e3c 100%)",
                      },
                    }}
                  >
                    Mark as Email Sent
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    color="error"
                    onClick={() => handleUpdateStatus(selectedBooking.id, "EMAIL_FAILED")}
                  >
                    Mark as Email Failed
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Email />}
                    onClick={() => handleResendEmail(selectedBooking.id)}
                    sx={{
                      color: "#ff6b00",
                      borderColor: "#ff6b00",
                      "&:hover": {
                        borderColor: "#e65100",
                        bgcolor: "#fff4e6",
                      },
                    }}
                  >
                    Resend Email
                  </Button>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setDetailDialog(false)}
            sx={{ color: "#666", fontWeight: 600 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default RoomBookingsPage;