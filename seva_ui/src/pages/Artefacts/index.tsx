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
  MenuItem,
  Chip,
} from "@mui/material";
import { Add as AddIcon, Book } from "@mui/icons-material";
import {
  DataTable,
  Column,
  formatBoolean,
  formatDate,
} from "@/components/common/DataTable";
import { artefactsService } from "@/services";
import { ArtefactAdmin, ArtefactUpsert } from "@/types";

export const ArtefactsPage: React.FC = () => {
  const [artefacts, setArtefacts] = useState<ArtefactAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ArtefactAdmin | null>(null);
  const [formData, setFormData] = useState<ArtefactUpsert>({
    title: "",
    description: "",
    category: "Pravachana",
    url: "",
    type: "PDF",
    active: true,
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchArtefacts();
  }, []);

  const fetchArtefacts = async () => {
    try {
      setLoading(true);
      const data = await artefactsService.list();
      setArtefacts(data);
    } catch (err) {
      setError("Failed to load artefacts");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (item?: ArtefactAdmin) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title,
        description: item.description || "",
        category: item.category,
        url: item.url,
        type: item.type,
        active: item.active,
      });
    } else {
      setEditingItem(null);
      setFormData({
        title: "",
        description: "",
        category: "Pravachana",
        url: "",
        type: "PDF",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await artefactsService.update(editingItem.id, formData);
        setMessage("Artefact updated successfully");
      } else {
        await artefactsService.create(formData);
        setMessage("Artefact created successfully");
      }
      fetchArtefacts();
      handleCloseDialog();
    } catch (err) {
      setError("Failed to save artefact");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this artefact?")) return;
    try {
      await artefactsService.delete(id);
      setMessage("Artefact deleted successfully");
      fetchArtefacts();
    } catch (err) {
      setError("Failed to delete artefact");
    }
  };

  const columns: Column<ArtefactAdmin>[] = [
    { field: "title", headerName: "Title", flex: 1 },
    {
      field: "category",
      headerName: "Category",
      width: 150,
      renderCell: (i) => (
        <Chip
          label={i.category}
          size="small"
          sx={{
            bgcolor: '#e3f2fd',
            color: '#1976d2',
            fontWeight: 600,
          }}
        />
      ),
    },
    {
      field: "type",
      headerName: "Type",
      width: 100,
      renderCell: (i) => (
        <Chip
          label={i.type}
          size="small"
          variant="outlined"
          color={i.type === "PDF" ? "primary" : "secondary"}
        />
      ),
    },
    { field: "url", headerName: "URL", width: 200 },
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
            Artefacts & Publications
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage spiritual literature and audio content
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
          Add Artefact
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
          rows={artefacts}
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
            <Book />
            {editingItem ? "Edit Artefact" : "Add New Artefact"}
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
              select
              label="Category"
              name="category"
              value={formData.category}
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
            >
              <MenuItem value="Pravachana">Pravachana</MenuItem>
              <MenuItem value="Publications">Publications</MenuItem>
              <MenuItem value="Audio">Audio</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
            <TextField
              fullWidth
              select
              label="Type"
              name="type"
              value={formData.type}
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
            >
              <MenuItem value="PDF">PDF</MenuItem>
              <MenuItem value="AUDIO">Audio</MenuItem>
            </TextField>
            <TextField
              fullWidth
              multiline
              rows={3}
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
              label="File URL"
              name="url"
              value={formData.url}
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
export default ArtefactsPage;