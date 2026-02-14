import React, { useEffect, useState } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Alert,
  CircularProgress,
  TextField,
  MenuItem,
  Button,
  Chip,
  Paper,
  Grid,
} from "@mui/material";
import { Receipt, Payment } from "@mui/icons-material";
import { DataTable, Column, formatDate } from "@/components/common/DataTable";
import { sevaOrdersService } from "@/services";
import { SevaOrderSummary, SevaOrderDetail, paiseToRupees } from "@/types";

export const SevaOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<SevaOrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailDialog, setDetailDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<SevaOrderDetail | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await sevaOrdersService.list(
        statusFilter ? { status: statusFilter } : undefined,
      );
      setOrders(data);
    } catch (err) {
      setError("Failed to load seva orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleViewDetails = async (order: SevaOrderSummary) => {
    try {
      const detail = await sevaOrdersService.get(order.id);
      setSelectedOrder(detail);
      setDetailDialog(true);
    } catch (err) {
      setError("Failed to load order details");
    }
  };

  const columns: Column<SevaOrderSummary>[] = [
    { field: "uid", headerName: "User ID", width: 180 },
    { field: "sevaTitle", headerName: "Seva", width: 200 },
    {
      field: "amountInPaise",
      headerName: "Amount",
      width: 120,
      renderCell: (i) => (
        <Chip
          label={`₹${paiseToRupees(i.amountInPaise).toFixed(2)}`}
          size="small"
          sx={{
            bgcolor: "#e8f5e9",
            color: "#2e7d32",
            fontWeight: 700,
          }}
        />
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (i) => (
        <Chip
          label={i.status}
          size="small"
          color={
            i.status === "COMPLETED"
              ? "success"
              : i.status === "PENDING"
                ? "warning"
                : "default"
          }
        />
      ),
    },
    { field: "razorpayPaymentId", headerName: "Payment ID", width: 200 },
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
            Seva Orders
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View and manage seva order transactions
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
          <MenuItem value="PENDING">Pending</MenuItem>
          <MenuItem value="COMPLETED">Completed</MenuItem>
          <MenuItem value="CANCELLED">Cancelled</MenuItem>
        </TextField>
      </Box>

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
          rows={orders}
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
          <Receipt />
          Order Details
        </DialogTitle>
        <DialogContent sx={{ mt: 3 }}>
          {selectedOrder && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 3, bgcolor: "#f5f5f5", borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: "#ff6b00" }}>
                    Order Information
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Order ID:</strong> {selectedOrder.id}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>User ID:</strong> {selectedOrder.uid}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Seva:</strong> {selectedOrder.sevaTitle}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Amount:</strong>{" "}
                    <Chip
                      label={`₹${paiseToRupees(selectedOrder.amountInPaise).toFixed(2)}`}
                      size="small"
                      sx={{ bgcolor: "#e8f5e9", color: "#2e7d32", fontWeight: 700 }}
                    />
                  </Typography>
                  <Typography variant="body1">
                    <strong>Status:</strong>{" "}
                    <Chip
                      label={selectedOrder.status}
                      size="small"
                      color={
                        selectedOrder.status === "COMPLETED"
                          ? "success"
                          : selectedOrder.status === "PENDING"
                            ? "warning"
                            : "default"
                      }
                    />
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper sx={{ p: 3, bgcolor: "#e3f2fd", borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: "#1976d2" }}>
                    Customer Details
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Name:</strong> {selectedOrder.fullName || "N/A"}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Mobile:</strong> {selectedOrder.mobile || "N/A"}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Email:</strong> {selectedOrder.email || "N/A"}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Address:</strong>{" "}
                    {[
                      selectedOrder.addressLine1,
                      selectedOrder.addressLine2,
                      selectedOrder.city,
                      selectedOrder.state,
                      selectedOrder.pincode,
                    ]
                      .filter(Boolean)
                      .join(", ") || "N/A"}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper sx={{ p: 3, bgcolor: "#fff4e6", borderRadius: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <Payment sx={{ color: "#ff6b00" }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#ff6b00" }}>
                      Payment Details
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Razorpay Order ID:</strong> {selectedOrder.razorpayOrderId || "N/A"}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Razorpay Payment ID:</strong> {selectedOrder.razorpayPaymentId || "N/A"}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Consent to Store:</strong> {selectedOrder.consentToStore ? "Yes" : "No"}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Created:</strong> {formatDate(selectedOrder.createdAt)}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setDetailDialog(false)}
            sx={{
              color: "#666",
              fontWeight: 600,
              "&:hover": { bgcolor: "#f5f5f5" },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default SevaOrdersPage;