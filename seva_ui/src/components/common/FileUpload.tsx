import React, { useState } from 'react';
import {
  Box,
  Button,
  LinearProgress,
  Typography,
  IconButton,
  Alert,
} from '@mui/material';
import { CloudUpload, Delete } from '@mui/icons-material';
import { fileUploadService } from '@/services';

interface FileUploadProps {
  value?: string;
  onChange: (url: string) => void;
  accept?: string;
  path: string;
  label?: string;
  maxSizeMB?: number;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  value,
  onChange,
  accept = '*/*',
  path,
  label = 'Upload File',
  maxSizeMB = 10,
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const validateFileSize = (file: File): boolean => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError('');

        if (!validateFileSize(file)) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    try {
      setUploading(true);
      const url = await fileUploadService.upload(file, path, (progress) => {
        setProgress(progress);
      });
      onChange(url);
    } catch (err) {
      setError('Failed to upload file');
      console.error(err);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleDelete = async () => {
    if (!value) return;
    
    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        await fileUploadService.delete(value);
        onChange('');
      } catch (err) {
        setError('Failed to delete file');
        console.error(err);
      }
    }
  };

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {label}
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {value && !uploading && (
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          {accept.includes('image') && (
            <Box
              component="img"
              src={value}
              alt="Preview"
              sx={{
                width: 100,
                height: 100,
                objectFit: 'cover',
                borderRadius: 1,
              }}
            />
          )}
          <Typography variant="body2" noWrap flex={1}>
            {value.split('/').pop()?.split('?')[0].substring(0, 50)}...
          </Typography>
          <IconButton onClick={handleDelete} color="error" size="small">
            <Delete />
          </IconButton>
        </Box>
      )}

      {!value && !uploading && (
        <Button
          component="label"
          variant="outlined"
          startIcon={<CloudUpload />}
          fullWidth
        >
          {label}
          <input
            type="file"
            accept={accept}
            hidden
            onChange={handleFileSelect}
          />
        </Button>
      )}

      {uploading && (
        <Box>
          <LinearProgress variant="determinate" value={progress} />
          <Typography variant="body2" color="text.secondary" textAlign="center" mt={1}>
            Uploading... {Math.round(progress)}%
          </Typography>
        </Box>
      )}

      <Typography variant="caption" color="text.secondary" display="block" mt={1}>
        Max file size: {maxSizeMB}MB
      </Typography>
    </Box>
  );
};
