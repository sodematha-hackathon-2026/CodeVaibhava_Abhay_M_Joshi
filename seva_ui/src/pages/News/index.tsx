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
import { Add as AddIcon, Newspaper } from "@mui/icons-material";
import {
  DataTable,
  Column,
  formatBoolean,
  formatDate,
} from "@/components/common/DataTable";
import { newsService } from "@/services";
import { NewsAdmin, NewsUpsert } from "@/types";

export const NewsPage: React.FC = () => {
  const [news, setNews] = useState<NewsAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsAdmin | null>(null);
  const [formData, setFormData] = useState<NewsUpsert>({
    title: "",
    imageUrl: "",
    body: "",
    active: true,
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const data = await newsService.list();
      setNews(data);
    } catch (err) {
      setError("Failed to load news");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (item?: NewsAdmin) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title,
        imageUrl: item.imageUrl || "",
        body: item.body || "",
        active: item.active,
      });
    } else {
      setEditingItem(null);
      setFormData({ title: "", imageUrl: "", body: "", active: true });
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
        await newsService.update(editingItem.id, formData);
        setMessage("News article updated successfully");
      } else {
        await newsService.create(formData);
        setMessage("News article created successfully");
      }
      fetchNews();
      handleCloseDialog();
    } catch (err) {
      setError("Failed to save news article");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this news article?")) return;
    try {
      await newsService.delete(id);
      setMessage("News article deleted successfully");
      fetchNews();
    } catch (err) {
      setError("Failed to delete news article");
    }
  };

  const columns: Column<NewsAdmin>[] = [
    { field: "title", headerName: "Title", flex: 1 },
    { field: "body", headerName: "Content", flex: 1 },
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
            News Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Publish news articles and updates
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
          Add News
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
          rows={news}
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
            <Newspaper />
            {editingItem ? "Edit News" : "Add News Article"}
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
              multiline
              rows={6}
              label="Article Body"
              name="body"
              value={formData.body}
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
export default NewsPage;