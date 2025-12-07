'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

// project import
import AuthWrapper from 'sections/auth/AuthWrapper';
import { authApi } from 'services/authApi';
import AnimateButton from 'components/@extended/AnimateButton';

// assets
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';

// ================================|| EMAIL VERIFICATION ||================================ //

export default function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasVerified, setHasVerified] = useState(false);

  useEffect(() => {
    // Prevent double execution
    if (hasVerified) return;

    const verifyEmail = async () => {
      if (!token) {
        setError('Invalid or missing verification token');
        setVerifying(false);
        return;
      }

      try {
        await authApi.verifyEmail(token);
        setHasVerified(true);
        setSuccess(true);
        setError(null);
        setVerifying(false);
      } catch (err: any) {
        // Check if email is already verified (might be a success case)
        const errorMessage = err?.response?.data?.message || err.message || 'Failed to verify email';

        // If the error is "already verified", treat it as success
        if (errorMessage.toLowerCase().includes('already verified')) {
          setHasVerified(true);
          setSuccess(true);
          setError(null);
        } else {
          setHasVerified(true);
          setSuccess(false);
          setError(errorMessage);
        }
        setVerifying(false);
      }
    };

    verifyEmail();
  }, [token, hasVerified]);

  const handleContinue = () => {
    router.push('/login');
  };

  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack spacing={1} alignItems="center">
            <Typography variant="h3">Email Verification</Typography>
          </Stack>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3 }}>
            {verifying && (
              <>
                <CircularProgress size={60} />
                <Typography variant="body1" sx={{ mt: 2 }}>
                  Verifying your email...
                </Typography>
              </>
            )}

            {!verifying && success && !error && (
              <>
                <CheckCircleOutlined style={{ fontSize: 60, color: '#52c41a' }} />
                <Typography variant="h4" sx={{ mt: 2, color: '#52c41a' }}>
                  Email Verified Successfully!
                </Typography>
                <Typography variant="body1" color="secondary" sx={{ mt: 1, textAlign: 'center' }}>
                  Your email has been verified. You can now log in to your account.
                </Typography>
                <AnimateButton>
                  <Button
                    disableElevation
                    fullWidth
                    size="large"
                    variant="contained"
                    color="primary"
                    onClick={handleContinue}
                    sx={{ mt: 3, maxWidth: 300 }}
                  >
                    Continue to Login
                  </Button>
                </AnimateButton>
              </>
            )}

            {!verifying && !success && error && (
              <>
                <CloseCircleOutlined style={{ fontSize: 60, color: '#ff4d4f' }} />
                <Typography variant="h4" sx={{ mt: 2, color: '#ff4d4f' }}>
                  Verification Failed
                </Typography>
                <Typography variant="body1" color="error" sx={{ mt: 1, textAlign: 'center' }}>
                  {error}
                </Typography>
                <AnimateButton>
                  <Button
                    disableElevation
                    fullWidth
                    size="large"
                    variant="outlined"
                    color="primary"
                    onClick={handleContinue}
                    sx={{ mt: 3, maxWidth: 300 }}
                  >
                    Back to Login
                  </Button>
                </AnimateButton>
              </>
            )}
          </Box>
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}
