// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';
import AuthChangePassword from 'sections/auth/auth-forms/AuthChangePassword';

// ==============================|| CHANGE PASSWORD PAGE ||============================== //

export default function ChangePasswordPage() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8} lg={6}>
        <MainCard title="Change Password">
          <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary">
              Update your password to keep your account secure. Your new password must meet the following requirements:
            </Typography>
            <Stack spacing={0.5} sx={{ pl: 2 }}>
              <Typography variant="body2" color="text.secondary">
                - At least 8 characters long
              </Typography>
              <Typography variant="body2" color="text.secondary">
                - Maximum 10 characters
              </Typography>
              <Typography variant="body2" color="text.secondary">
                - Cannot start or end with spaces
              </Typography>
              <Typography variant="body2" color="text.secondary">
                - Must be different from your current password
              </Typography>
            </Stack>
          </Stack>
          <Stack spacing={3} sx={{ mt: 3 }}>
            <AuthChangePassword />
          </Stack>
        </MainCard>
      </Grid>
    </Grid>
  );
}
