'use client';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Stack } from '@mui/material';
import ExclamationCircleOutlined from '@ant-design/icons/ExclamationCircleOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';

// ==============================|| DELETE CONFIRMATION DIALOG ||============================== //

interface DeleteConfirmationDialogProps {
  open: boolean;
  title: string;
  itemName: string;
  itemType: 'Movie' | 'TV Show';
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export default function DeleteConfirmationDialog({
  open,
  title,
  itemName,
  itemType,
  onClose,
  onConfirm,
  loading = false
}: DeleteConfirmationDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <ExclamationCircleOutlined style={{ fontSize: 24, color: '#faad14' }} />
          <Typography variant="h4">{title}</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          Are you sure you want to delete <strong>&quot;{itemName}&quot;</strong>?
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="secondary" disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          startIcon={<DeleteOutlined />}
          disabled={loading}
          sx={{
            '&:hover': {
              backgroundColor: 'error.dark'
            }
          }}
        >
          {loading ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
