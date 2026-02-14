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
import { Add as AddIcon, Event as EventIcon } from "@mui/icons-material";
import {
  DataTable,
  Column,
  formatBoolean,
} from "@/components/common/DataTable";
import { eventsService } from "@/services";
import { Event, CreateUpdateEvent } from "@/types";

export const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Event | null>(null);
  const [formData, setFormData] = useState<CreateUpdateEvent>({
    title: "",
    description: "",
    eventDate: "",
    location: "",
    imageUrl: "",
    type: "PARYAYA",
    scope: "LOCAL",
    notifyUsers: false,
    tithiLabel: "",
    active: true,
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await eventsService.list();
      setEvents(data);
    } catch (err) {
      setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (item?: Event) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title,
        description: item.description,
        eventDate: item.eventDate,
        location: item.location,
        imageUrl: item.imageUrl || "",
        type: item.type,
        scope: item.scope,
        notifyUsers: item.notifyUsers,
        tithiLabel: item.tithiLabel || "",
        active: item.active,
      });
    } else {
      setEditingItem(null);
      setFormData({
        title: "",
        description: "",
        eventDate: "",
        location: "",
        imageUrl: "",
        type: "PARYAYA",
        scope: "LOCAL",
        notifyUsers: false,
        tithiLabel: "",
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
        await eventsService.update(editingItem.id, formData);
        setMessage("Event updated successfully");
      } else {
        await eventsService.create(formData);
        setMessage("Event created successfully");
      }
      fetchEvents();
      handleCloseDialog();
    } catch (err) {
      setError("Failed to save event");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      await eventsService.delete(id);
      setMessage("Event deleted successfully");
      fetchEvents();
    } catch (err) {
      setError("Failed to delete event");
    }
  };

  const columns: Column<Event>[] = [
    { field: "title", headerName: "Title", flex: 1 },
    { field: "eventDate", headerName: "Date", width: 120 },
    { field: "location", headerName: "Location", width: 150 },
    {
      field: "type",
      headerName: "Type",
      width: 120,
      renderCell: (i) => (
        <Chip
          label={i.type}
          size="small"
          color={
            i.type === "ARADHANA"
              ? "primary"
              : i.type === "PARYAYA"
              ? "secondary"
              : "default"
          }
        />
      ),
    },
    { field: "scope", headerName: "Scope", width: 120 },
    {
      field: "active",
      headerName: "Active",
      width: 100,
      renderCell: (i) => formatBoolean(i.active),
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
            Events Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage Aradhana, Paryaya, and festival events
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
          Add Event
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
          rows={events}
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
            <EventIcon />
            {editingItem ? "Edit Event" : "Add New Event"}
          </DialogTitle>
          <DialogContent sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Event Title"
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
              rows={3}
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
              type="date"
              label="Event Date"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
              required
              margin="normal"
              InputLabelProps={{ shrink: true }}
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
              label="Location"
              name="location"
              value={formData.location}
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
              select
              label="Event Type"
              name="type"
              value={formData.type}
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
            >
              <MenuItem value="ARADHANA">Aradhana</MenuItem>
              <MenuItem value="UTSAVA">Utsava</MenuItem>
              <MenuItem value="PARYAYA">Paryaya</MenuItem>
              <MenuItem value="GENERAL">General</MenuItem>
            </TextField>
            <TextField
              fullWidth
              select
              label="Scope"
              name="scope"
              value={formData.scope}
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
            >
              <MenuItem value="LOCAL">Local</MenuItem>
              <MenuItem value="NATIONAL">National</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Tithi Label"
              name="tithiLabel"
              value={formData.tithiLabel}
              onChange={handleChange}
              margin="normal"
              placeholder="e.g., Magha Shudha Navami"
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
              label="Image URL"
              name="imageUrl"
              value={formData.imageUrl}
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
            <Box
              sx={{
                mt: 2,
                p: 2,
                bgcolor: "#fff4e6",
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.notifyUsers}
                    onChange={handleChange}
                    name="notifyUsers"
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
                label="Send notification to all users"
              />
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
              {editingItem ? "Update Event" : "Create Event"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};
export default EventsPage;