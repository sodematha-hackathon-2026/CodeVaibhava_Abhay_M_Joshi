import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Switch,
  FormControlLabel,
  InputAdornment,
  Chip,
} from "@mui/material";
import { Add as AddIcon, CardGiftcard } from "@mui/icons-material";
import {
  DataTable,
  Column,
  formatBoolean,
  formatDate,
} from "@/components/common/DataTable";
import { sevasService } from "@/services";
import { SevaAdmin, SevaUpsert, paiseToRupees, rupeesToPaise } from "@/types";

export const SevasPage: React.FC = () => {
  const [sevas, setSevas] = useState<SevaAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SevaAdmin | null>(null);
  const [priceInRupees, setPriceInRupees] = useState<number>(0);
  const [formData, setFormData] = useState<SevaUpsert>({
    title: "",
    description: "",
    amountInPaise: 0,
    active: true,
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSevas();
  }, []);

  const fetchSevas = async () => {
    try {
      setLoading(true);
      const data = await sevasService.list();
      setSevas(data);
    } catch (err) {
      setError("Failed to load sevas");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (item?: SevaAdmin) => {
    if (item) {
      setEditingItem(item);
      const rupees = paiseToRupees(item.amountInPaise);
      setPriceInRupees(rupees);
      setFormData({
        title: item.title,
        description: item.description || "",
        amountInPaise: item.amountInPaise,
        active: item.active,
      });
    } else {
      setEditingItem(null);
      setPriceInRupees(0);
      setFormData({
        title: "",
        description: "",
        amountInPaise: 0,
        active: true,
      });
    }
    setDialogOpen(true);
    setMessage("");
    setError("");
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingItem(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: e.target.type === "checkbox" ? checked : value,
    }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rupees = parseFloat(e.target.value) || 0;
    setPriceInRupees(rupees);
    setFormData((prev) => ({
      ...prev,
      amountInPaise: rupeesToPaise(rupees),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await sevasService.update(editingItem.id, formData);
        setMessage("Seva updated successfully");
      } else {
        await sevasService.create(formData);
        setMessage("Seva created successfully");
      }
      fetchSevas();
      handleCloseDialog();
    } catch (err) {
      setError("Failed to save seva");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this seva?")) return;
    try {
      await sevasService.delete(id);
      setMessage("Seva deleted successfully");
      fetchSevas();
    } catch (err) {
      setError("Failed to delete seva");
    }
  };

  const columns: Column<SevaAdmin>[] = [
    { field: "title", headerName: "Seva Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    {
      field: "amountInPaise",
      headerName: "Price",
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
      field: "active",
      headerName: "Status",
      width: 100,
      renderCell: (i) => formatBoolean(i.active),
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
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: "#333", mb: 1 }}
          >
            Sevas Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage seva offerings and pricing
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            background: "linear-gradient(135deg, #ff6b00 0%, #ff8f00 100%)",
            px: 3,
            py: 1.5,
            fontWeight: 600,
            boxShadow: "0 4px 12px rgba(255, 107, 0, 0.3)",
            "&:hover": {
              background: "linear-gradient(135deg, #e65100 0%, #f57c00 100%)",
              boxShadow: "0 6px 16px rgba(255, 107, 0, 0.4)",
            },
          }}
        >
          Add Seva
        </Button>
      </Box>

      {message && (
        <Alert
          severity="success"
          sx={{ mb: 3, borderRadius: 2 }}
          onClose={() => setMessage("")}
        >
          {message}
        </Alert>
      )}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3, borderRadius: 2 }}
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress sx={{ color: "#ff6b00" }} />
        </Box>
      ) : (
        <DataTable
          rows={sevas}
          columns={columns}
          onEdit={handleOpenDialog}
          onDelete={(row) => handleDelete(row.id)}
        />
      )}

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
          },
        }}
      >
        <form onSubmit={handleSubmit}>
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
            <CardGiftcard />
            {editingItem ? "Edit Seva" : "Add New Seva"}
          </DialogTitle>
          <DialogContent sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Seva Name"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              margin="normal"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&.Mui-focused fieldset": {
                    borderColor: "#ff6b00",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#ff6b00",
                },
              }}
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              margin="normal"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&.Mui-focused fieldset": {
                    borderColor: "#ff6b00",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#ff6b00",
                },
              }}
            />
            <TextField
              fullWidth
              type="number"
              label="Price (in Rupees)"
              value={priceInRupees}
              onChange={handlePriceChange}
              required
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography sx={{ fontWeight: 700, color: "#ff6b00" }}>
                      ₹
                    </Typography>
                  </InputAdornment>
                ),
              }}
              helperText={`Amount in paise: ${formData.amountInPaise}`}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&.Mui-focused fieldset": {
                    borderColor: "#ff6b00",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#ff6b00",
                },
              }}
            />
            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.active}
                    onChange={handleChange}
                    name="active"
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: "#ff6b00",
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                        {
                          backgroundColor: "#ff6b00",
                        },
                    }}
                  />
                }
                label="Active (visible in app)"
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 1 }}>
            <Button
              onClick={handleCloseDialog}
              sx={{
                color: "#666",
                fontWeight: 600,
                "&:hover": {
                  bgcolor: "#f5f5f5",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                background: "linear-gradient(135deg, #ff6b00 0%, #ff8f00 100%)",
                px: 4,
                fontWeight: 600,
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #e65100 0%, #f57c00 100%)",
                },
              }}
            >
              {editingItem ? "Update Seva" : "Create Seva"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};
export default SevasPage;