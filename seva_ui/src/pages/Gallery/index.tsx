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
} from "@mui/material";
import { Add as AddIcon, PhotoLibrary, VideoLibrary } from "@mui/icons-material";
import {
  DataTable,
  Column,
  formatBoolean,
  formatDate,
} from "@/components/common/DataTable";
import { galleryService } from "@/services";
import { AlbumSummary, CreateAlbum, CreateMedia } from "@/types";

export const GalleryPage: React.FC = () => {
  const [albums, setAlbums] = useState<AlbumSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [albumDialog, setAlbumDialog] = useState(false);
  const [mediaDialog, setMediaDialog] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<AlbumSummary | null>(null);
  const [albumFormData, setAlbumFormData] = useState<CreateAlbum>({
    title: "",
    description: "",
    coverImageUrl: "",
    active: true,
  });
  const [mediaFormData, setMediaFormData] = useState<CreateMedia>({
    albumId: "",
    type: "IMAGE",
    title: "",
    url: "",
    thumbnailUrl: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      const data = await galleryService.listAlbums();
      setAlbums(data);
    } catch (err) {
      setError("Failed to load albums");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAlbumDialog = (album?: AlbumSummary) => {
    if (album) {
      setEditingAlbum(album);
      setAlbumFormData({
        title: album.title,
        description: "",
        coverImageUrl: album.coverImageUrl || "",
        active: album.active,
      });
    } else {
      setEditingAlbum(null);
      setAlbumFormData({
        title: "",
        description: "",
        coverImageUrl: "",
        active: true,
      });
    }
    setAlbumDialog(true);
    setMessage("");
    setError("");
  };

  const handleAlbumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setAlbumFormData((prev) => ({
      ...prev,
      [name]: e.target.type === "checkbox" ? checked : value,
    }));
  };

  const handleAlbumSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAlbum) {
        await galleryService.updateAlbum(editingAlbum.id, albumFormData);
        setMessage("Album updated successfully");
      } else {
        await galleryService.createAlbum(albumFormData);
        setMessage("Album created successfully");
      }
      fetchAlbums();
      setAlbumDialog(false);
    } catch (err) {
      setError("Failed to save album");
    }
  };

  const handleDeleteAlbum = async (id: string) => {
    if (!confirm("Are you sure you want to delete this album?")) return;
    try {
      await galleryService.deleteAlbum(id);
      setMessage("Album deleted successfully");
      fetchAlbums();
    } catch (err) {
      setError("Failed to delete album");
    }
  };

  const handleOpenMediaDialog = (albumId: string) => {
    setMediaFormData({
      albumId,
      type: "IMAGE",
      title: "",
      url: "",
      thumbnailUrl: "",
    });
    setMediaDialog(true);
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMediaFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMediaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await galleryService.addMedia(mediaFormData);
      setMessage("Media added successfully");
      setMediaDialog(false);
    } catch (err) {
      setError("Failed to add media");
    }
  };

  const columns: Column<AlbumSummary>[] = [
    { field: "title", headerName: "Album Title", flex: 1 },
    {
      field: "coverImageUrl",
      headerName: "Cover Image",
      width: 200,
      renderCell: (i) =>
        i.coverImageUrl ? (
          <img
            src={i.coverImageUrl}
            alt={i.title}
            style={{
              width: 50,
              height: 50,
              objectFit: "cover",
              borderRadius: 8,
            }}
          />
        ) : (
          "No image"
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
            Gallery Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage photo and video albums
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenAlbumDialog()}
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
          Add Album
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
          rows={albums}
          columns={columns}
          onEdit={handleOpenAlbumDialog}
          onDelete={(row) => handleDeleteAlbum(row.id)}
          customActions={(row) => (
            <Button
              size="small"
              onClick={() => handleOpenMediaDialog(row.id)}
              sx={{
                color: "#ff6b00",
                fontWeight: 600,
                "&:hover": {
                  bgcolor: "#fff4e6",
                },
              }}
            >
              Add Media
            </Button>
          )}
        />
      )}

      {/* Album Dialog */}
      <Dialog
        open={albumDialog}
        onClose={() => setAlbumDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
          },
        }}
      >
        <form onSubmit={handleAlbumSubmit}>
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
            <PhotoLibrary />
            {editingAlbum ? "Edit Album" : "Add New Album"}
          </DialogTitle>
          <DialogContent sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Album Title"
              name="title"
              value={albumFormData.title}
              onChange={handleAlbumChange}
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
              rows={3}
              label="Description"
              name="description"
              value={albumFormData.description}
              onChange={handleAlbumChange}
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
              label="Cover Image URL"
              name="coverImageUrl"
              value={albumFormData.coverImageUrl}
              onChange={handleAlbumChange}
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
            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={albumFormData.active}
                    onChange={handleAlbumChange}
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
              onClick={() => setAlbumDialog(false)}
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
              {editingAlbum ? "Update Album" : "Create Album"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Media Dialog */}
      <Dialog
        open={mediaDialog}
        onClose={() => setMediaDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
          },
        }}
      >
        <form onSubmit={handleMediaSubmit}>
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
            <VideoLibrary />
            Add Media to Album
          </DialogTitle>
          <DialogContent sx={{ mt: 3 }}>
            <TextField
              fullWidth
              select
              label="Media Type"
              name="type"
              value={mediaFormData.type}
              onChange={handleMediaChange}
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
            >
              <MenuItem value="IMAGE">Image</MenuItem>
              <MenuItem value="VIDEO">Video</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Title (Optional)"
              name="title"
              value={mediaFormData.title}
              onChange={handleMediaChange}
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
              label="Media URL"
              name="url"
              value={mediaFormData.url}
              onChange={handleMediaChange}
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
              label="Thumbnail URL (Optional)"
              name="thumbnailUrl"
              value={mediaFormData.thumbnailUrl}
              onChange={handleMediaChange}
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
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 1 }}>
            <Button
              onClick={() => setMediaDialog(false)}
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
              Add Media
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};
export default GalleryPage;