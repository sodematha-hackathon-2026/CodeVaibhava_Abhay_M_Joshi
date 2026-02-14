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
} from "@mui/material";
import { Add as AddIcon, History as HistoryIcon } from "@mui/icons-material";
import {
  DataTable,
  Column,
  formatBoolean,
  formatDate,
} from "@/components/common/DataTable";
import { historyService } from "@/services";
import { HistoryAdminItem, HistoryUpsert } from "@/types";

export const HistoryPage: React.FC = () => {
  const [items, setItems] = useState<HistoryAdminItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<HistoryAdminItem | null>(null);
  const [formData, setFormData] = useState<HistoryUpsert>({
    title: "",
    subtitle: "",
    period: "",
    description: "",
    imageUrl: "",
    sortOrder: 0,
    active: true,
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await historyService.list();
      setItems(data);
    } catch (err) {
      setError("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (item?: HistoryAdminItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title,
        subtitle: item.subtitle || "",
        period: item.period || "",
        description: item.description || "",
        imageUrl: item.imageUrl || "",
        sortOrder: item.sortOrder,
        active: item.active,
      });
    } else {
      setEditingItem(null);
      setFormData({
        title: "",
        subtitle: "",
        period: "",
        description: "",
        imageUrl: "",
        sortOrder: 0,
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
      [name]:
        e.target.type === "checkbox"
          ? checked
          : name === "sortOrder"
            ? parseInt(value) || 0
            : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await historyService.update(editingItem.id, formData);
        setMessage("History section updated successfully");
      } else {
        await historyService.create(formData);
        setMessage("History section created successfully");
      }
      fetchItems();
      handleCloseDialog();
    } catch (err) {
      setError("Failed to save history section");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this history section?")) return;
    try {
      await historyService.delete(id);
      setMessage("History section deleted successfully");
      fetchItems();
    } catch (err) {
      setError("Failed to delete history section");
    }
  };

  const columns: Column<HistoryAdminItem>[] = [
    { field: "title", headerName: "Title", flex: 1 },
    { field: "period", headerName: "Period", width: 150 },
    { field: "sortOrder", headerName: "Order", width: 80 },
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
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#333", mb: 1 }}>
            History & Parampara
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage historical content and guru parampara
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
          Add Section
        </Button>
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
          rows={items}
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
        PaperProps={{ sx: { borderRadius: 3 } }}
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
            <HistoryIcon />
            {editingItem ? "Edit History Section" : "Add History Section"}
          </DialogTitle>
          <DialogContent sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              margin="normal"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&.Mui-focused fieldset": { borderColor: "#ff6b00" },
                },
                "& .MuiInputLabel-root.Mui-focused": { color: "#ff6b00" },
              }}
            />
            <TextField
              fullWidth
              label="Subtitle"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              margin="normal"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&.Mui-focused fieldset": { borderColor: "#ff6b00" },
                },
                "& .MuiInputLabel-root.Mui-focused": { color: "#ff6b00" },
              }}
            />
            <TextField
              fullWidth
              label="Period"
              name="period"
              value={formData.period}
              onChange={handleChange}
              margin="normal"
              placeholder="e.g., 1480-1600"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&.Mui-focused fieldset": { borderColor: "#ff6b00" },
                },
                "& .MuiInputLabel-root.Mui-focused": { color: "#ff6b00" },
              }}
            />
            <TextField
              fullWidth
              multiline
              rows={5}
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              margin="normal"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&.Mui-focused fieldset": { borderColor: "#ff6b00" },
                },
                "& .MuiInputLabel-root.Mui-focused": { color: "#ff6b00" },
              }}
            />
            <TextField
              fullWidth
              label="Image URL"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              margin="normal"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&.Mui-focused fieldset": { borderColor: "#ff6b00" },
                },
                "& .MuiInputLabel-root.Mui-focused": { color: "#ff6b00" },
              }}
            />
            <TextField
              fullWidth
              type="number"
              label="Sort Order"
              name="sortOrder"
              value={formData.sortOrder}
              onChange={handleChange}
              required
              margin="normal"
              helperText="Lower numbers appear first"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&.Mui-focused fieldset": { borderColor: "#ff6b00" },
                },
                "& .MuiInputLabel-root.Mui-focused": { color: "#ff6b00" },
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
                      "& .MuiSwitch-switchBase.Mui-checked": { color: "#ff6b00" },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
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
              sx={{ color: "#666", fontWeight: 600, "&:hover": { bgcolor: "#f5f5f5" } }}
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
                  background: "linear-gradient(135deg, #e65100 0%, #f57c00 100%)",
                },
              }}
            >
              {editingItem ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};
export default HistoryPage;