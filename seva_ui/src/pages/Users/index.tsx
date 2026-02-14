import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Container,
  Divider,
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  PersonRemove as PersonRemoveIcon,
  AdminPanelSettings as AdminIcon,
  Person as UserIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { userManagementService } from '@/services';
import { getAuth } from 'firebase/auth';
import type { UserListItem } from '@/types';

interface ConfirmDialogState {
  open: boolean;
  action: 'promote' | 'demote' | null;
  user: UserListItem | null;
}

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uidInput, setUidInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    open: false,
    action: null,
    user: null,
  });

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      if (currentUser) {
        const idTokenResult = await currentUser.getIdTokenResult();
        const role = idTokenResult.claims.role || 'user';
        
        setUsers([{
          uid: currentUser.uid,
          email: currentUser.email || '',
          displayName: currentUser.displayName || undefined,
          photoURL: currentUser.photoURL || undefined,
          role: String(role),
        }]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load users';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handlePromote = async (uid: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await userManagementService.promoteToAdmin(uid);
      setSuccess(`User ${uid} has been promoted to admin successfully!`);
      
      setUsers(prev => prev.map(u => 
        u.uid === uid ? { ...u, role: 'admin' } : u
      ));
      
      if (uidInput === uid) {
        setUidInput('');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to promote user';
      setError(errorMessage);
    } finally {
      setLoading(false);
      setConfirmDialog({ open: false, action: null, user: null });
    }
  };

  const handleDemote = async (uid: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await userManagementService.demoteToUser(uid);
      setSuccess(`Admin ${uid} has been revoked to user successfully!`);
      
      setUsers(prev => prev.map(u => 
        u.uid === uid ? { ...u, role: 'user' } : u
      ));
      
      if (uidInput === uid) {
        setUidInput('');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to demote user';
      setError(errorMessage);
    } finally {
      setLoading(false);
      setConfirmDialog({ open: false, action: null, user: null });
    }
  };

  const handlePromoteByUid = () => {
    if (!uidInput.trim()) {
      setError('Please enter a valid UID');
      return;
    }
    
    const existingUser = users.find(u => u.uid === uidInput);
    if (existingUser) {
      setConfirmDialog({
        open: true,
        action: 'promote',
        user: existingUser,
      });
    } else {
      const newUser: UserListItem = {
        uid: uidInput,
        email: 'Unknown',
        role: 'user',
      };
      setConfirmDialog({
        open: true,
        action: 'promote',
        user: newUser,
      });
    }
  };

  const handleDemoteByUid = () => {
    if (!uidInput.trim()) {
      setError('Please enter a valid UID');
      return;
    }
    
    const existingUser = users.find(u => u.uid === uidInput);
    if (existingUser) {
      setConfirmDialog({
        open: true,
        action: 'demote',
        user: existingUser,
      });
    } else {
      setError('User not found');
    }
  };

  const confirmAction = () => {
    if (!confirmDialog.user) return;
    
    if (confirmDialog.action === 'promote') {
      handlePromote(confirmDialog.user.uid);
    } else if (confirmDialog.action === 'demote') {
      handleDemote(confirmDialog.user.uid);
    }
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.uid.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.displayName && user.displayName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography 
              variant="h4" 
              component="h1"
              sx={{
                fontWeight: 700,
                color: '#ff6b00',
                mb: 1,
              }}
            >
              User Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage admin roles and permissions
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadUsers}
            disabled={loading}
            sx={{
              borderColor: '#ff6b00',
              color: '#ff6b00',
              borderRadius: 2,
              fontWeight: 600,
              '&:hover': {
                borderColor: '#e65100',
                bgcolor: 'rgba(255, 107, 0, 0.05)',
              },
            }}
          >
            Refresh
          </Button>
        </Box>

        {error && (
          <Alert 
            severity="error" 
            onClose={() => setError(null)} 
            sx={{ 
              mb: 3,
              borderRadius: 2,
            }}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert 
            severity="success" 
            onClose={() => setSuccess(null)} 
            sx={{ 
              mb: 3,
              borderRadius: 2,
            }}
          >
            {success}
          </Alert>
        )}

        <Paper 
          elevation={3}
          sx={{ 
            mb: 4,
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          }}
        >
          <Box
            sx={{
              background: 'linear-gradient(135deg, #ff6b00 0%, #ff8f00 100%)',
              p: 3,
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'white',
                fontWeight: 700,
                mb: 0.5,
              }}
            >
              Quick Actions
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              Manage admin roles by entering the user&apos;s Firebase UID
            </Typography>
          </Box>
          
          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="User UID"
                  value={uidInput}
                  onChange={(e) => setUidInput(e.target.value)}
                  placeholder="Enter Firebase UID"
                  disabled={loading}
                  helperText="Enter the Firebase UID of the user"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: '#ff6b00',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#ff6b00',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#ff6b00',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<PersonAddIcon />}
                    onClick={handlePromoteByUid}
                    disabled={loading || !uidInput.trim()}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #ff6b00 0%, #ff8f00 100%)',
                      fontWeight: 700,
                      textTransform: 'none',
                      boxShadow: '0 4px 12px rgba(255, 107, 0, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #e65100 0%, #f57c00 100%)',
                        boxShadow: '0 6px 16px rgba(255, 107, 0, 0.4)',
                      },
                      '&:disabled': {
                        background: '#ccc',
                      },
                    }}
                  >
                    Promote to Admin
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="error"
                    startIcon={<PersonRemoveIcon />}
                    onClick={handleDemoteByUid}
                    disabled={loading || !uidInput.trim()}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      borderWidth: 2,
                      fontWeight: 700,
                      textTransform: 'none',
                      '&:hover': {
                        borderWidth: 2,
                        bgcolor: 'rgba(211, 47, 47, 0.05)',
                      },
                    }}
                  >
                    Revoke Admin
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Paper>

        <Paper 
          elevation={3}
          sx={{ 
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          }}
        >
          <Box sx={{ p: 3 }}>
            <TextField
              fullWidth
              placeholder="Search by email, UID, or name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: '#ff6b00',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#ff6b00',
                  },
                },
              }}
            />
          </Box>

          <Divider />

          {loading && users.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress sx={{ color: '#ff6b00' }} />
            </Box>
          ) : (
            <Box sx={{ p: 3 }}>
              <Grid container spacing={2}>
                {filteredUsers.length === 0 ? (
                  <Grid item xs={12}>
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                      <UserIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No users found
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Use the Quick Actions panel to manage users by UID
                      </Typography>
                    </Box>
                  </Grid>
                ) : (
                  filteredUsers.map((user) => (
                    <Grid item xs={12} key={user.uid}>
                      <Card 
                        variant="outlined"
                        sx={{
                          borderRadius: 2,
                          transition: 'all 0.2s',
                          '&:hover': {
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            borderColor: '#ff6b00',
                          },
                        }}
                      >
                        <CardContent sx={{ p: 2.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar 
                                src={user.photoURL} 
                                alt={user.displayName || user.email}
                                sx={{
                                  width: 56,
                                  height: 56,
                                  background: 'linear-gradient(135deg, #ff6b00 0%, #ff8f00 100%)',
                                  fontSize: '1.5rem',
                                  fontWeight: 700,
                                }}
                              >
                                {user.displayName?.[0] || user.email[0]}
                              </Avatar>
                              <Box>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                                  {user.displayName || user.email}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                  {user.email}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  UID: {user.uid}
                                </Typography>
                              </Box>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Chip
                                icon={user.role === 'admin' ? <AdminIcon /> : <UserIcon />}
                                label={user.role === 'admin' ? 'Admin' : 'User'}
                                color={user.role === 'admin' ? 'primary' : 'default'}
                                sx={{
                                  fontWeight: 700,
                                  ...(user.role === 'admin' && {
                                    background: 'linear-gradient(135deg, #ff6b00 0%, #ff8f00 100%)',
                                  }),
                                }}
                              />
                              {user.role === 'admin' ? (
                                <Button
                                  variant="outlined"
                                  color="error"
                                  size="small"
                                  startIcon={<PersonRemoveIcon />}
                                  onClick={() => setConfirmDialog({
                                    open: true,
                                    action: 'demote',
                                    user,
                                  })}
                                  disabled={loading}
                                  sx={{
                                    borderRadius: 2,
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    borderWidth: 2,
                                    '&:hover': {
                                      borderWidth: 2,
                                    },
                                  }}
                                >
                                  Revoke Admin
                                </Button>
                              ) : (
                                <Button
                                  variant="contained"
                                  size="small"
                                  startIcon={<PersonAddIcon />}
                                  onClick={() => setConfirmDialog({
                                    open: true,
                                    action: 'promote',
                                    user,
                                  })}
                                  disabled={loading}
                                  sx={{
                                    borderRadius: 2,
                                    background: 'linear-gradient(135deg, #ff6b00 0%, #ff8f00 100%)',
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    boxShadow: '0 2px 8px rgba(255, 107, 0, 0.3)',
                                    '&:hover': {
                                      background: 'linear-gradient(135deg, #e65100 0%, #f57c00 100%)',
                                      boxShadow: '0 4px 12px rgba(255, 107, 0, 0.4)',
                                    },
                                  }}
                                >
                                  Make Admin
                                </Button>
                              )}
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                )}
              </Grid>
            </Box>
          )}
        </Paper>

        <Dialog
          open={confirmDialog.open}
          onClose={() => setConfirmDialog({ open: false, action: null, user: null })}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 700, fontSize: '1.5rem' }}>
            {confirmDialog.action === 'promote' ? 'Promote to Admin' : 'Revoke Admin Role'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {confirmDialog.action === 'promote' ? (
                <span>
                  Are you sure you want to promote <strong>{confirmDialog.user?.email || confirmDialog.user?.uid}</strong> to admin?
                  <br /><br />
                  This user will have full access to the admin panel.
                </span>
              ) : (
                <span>
                  Are you sure you want to revoke admin privileges from <strong>{confirmDialog.user?.email || confirmDialog.user?.uid}</strong>?
                  <br /><br />
                  This user will lose access to the admin panel.
                </span>
              )}
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button 
              onClick={() => setConfirmDialog({ open: false, action: null, user: null })}
              disabled={loading}
              sx={{
                borderRadius: 2,
                fontWeight: 600,
                textTransform: 'none',
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmAction}
              color={confirmDialog.action === 'promote' ? 'primary' : 'error'}
              variant="contained"
              disabled={loading}
              sx={{
                borderRadius: 2,
                fontWeight: 700,
                textTransform: 'none',
                px: 3,
                ...(confirmDialog.action === 'promote' && {
                  background: 'linear-gradient(135deg, #ff6b00 0%, #ff8f00 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #e65100 0%, #f57c00 100%)',
                  },
                }),
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Confirm'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};