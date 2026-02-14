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
  Grid,
  Chip,
} from "@mui/material";
import { Add as AddIcon, Quiz as QuizIcon } from "@mui/icons-material";
import {
  DataTable,
  Column,
  formatBoolean,
  formatDate,
} from "@/components/common/DataTable";
import { quizService } from "@/services";
import { QuestionAdmin, QuestionUpsert, CorrectOption } from "@/types";

export const QuizPage: React.FC = () => {
  const [questions, setQuestions] = useState<QuestionAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<QuestionAdmin | null>(null);
  const [formData, setFormData] = useState<QuestionUpsert>({
    questionText: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctOption: "A",
    active: true,
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const data = await quizService.listQuestions();
      setQuestions(data);
    } catch (err) {
      setError("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (item?: QuestionAdmin) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        questionText: item.questionText,
        optionA: item.optionA,
        optionB: item.optionB,
        optionC: item.optionC,
        optionD: item.optionD,
        correctOption: item.correctOption as CorrectOption,
        active: item.active,
      });
    } else {
      setEditingItem(null);
      setFormData({
        questionText: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctOption: "A",
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
        await quizService.updateQuestion(editingItem.id, formData);
        setMessage("Question updated successfully");
      } else {
        await quizService.createQuestion(formData);
        setMessage("Question created successfully");
      }
      fetchQuestions();
      handleCloseDialog();
    } catch (err) {
      setError("Failed to save question");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;
    try {
      await quizService.deleteQuestion(id);
      setMessage("Question deleted successfully");
      fetchQuestions();
    } catch (err) {
      setError("Failed to delete question");
    }
  };

  const columns: Column<QuestionAdmin>[] = [
    { field: "questionText", headerName: "Question", flex: 1 },
    {
      field: "correctOption",
      headerName: "Answer",
      width: 120,
      renderCell: (i) => (
        <Chip
          label={`Option ${i.correctOption}`}
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
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#333", mb: 1 }}>
            Youth Quiz Questions
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage quiz questions on Siddhanta and Matha topics
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
          Add Question
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
          rows={questions}
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
            <QuizIcon />
            {editingItem ? "Edit Question" : "Add New Question"}
          </DialogTitle>
          <DialogContent sx={{ mt: 3 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Question Text"
              name="questionText"
              value={formData.questionText}
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
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Option A"
                  name="optionA"
                  value={formData.optionA}
                  onChange={handleChange}
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&.Mui-focused fieldset": { borderColor: "#ff6b00" },
                    },
                    "& .MuiInputLabel-root.Mui-focused": { color: "#ff6b00" },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Option B"
                  name="optionB"
                  value={formData.optionB}
                  onChange={handleChange}
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&.Mui-focused fieldset": { borderColor: "#ff6b00" },
                    },
                    "& .MuiInputLabel-root.Mui-focused": { color: "#ff6b00" },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Option C"
                  name="optionC"
                  value={formData.optionC}
                  onChange={handleChange}
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&.Mui-focused fieldset": { borderColor: "#ff6b00" },
                    },
                    "& .MuiInputLabel-root.Mui-focused": { color: "#ff6b00" },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Option D"
                  name="optionD"
                  value={formData.optionD}
                  onChange={handleChange}
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&.Mui-focused fieldset": { borderColor: "#ff6b00" },
                    },
                    "& .MuiInputLabel-root.Mui-focused": { color: "#ff6b00" },
                  }}
                />
              </Grid>
            </Grid>
            <TextField
              fullWidth
              select
              label="Correct Answer"
              name="correctOption"
              value={formData.correctOption}
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
              <MenuItem value="A">Option A</MenuItem>
              <MenuItem value="B">Option B</MenuItem>
              <MenuItem value="C">Option C</MenuItem>
              <MenuItem value="D">Option D</MenuItem>
            </TextField>
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
export default QuizPage;