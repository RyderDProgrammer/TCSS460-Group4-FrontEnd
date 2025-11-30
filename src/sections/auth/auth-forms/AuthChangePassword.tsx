'use client';

import { useEffect, useState, SyntheticEvent } from 'react';
import { useSession } from 'next-auth/react';
import { authApi } from 'services/authApi';
//import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';


// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';

import { openSnackbar } from 'api/snackbar';
//import useScriptRef from 'hooks/useScriptRef';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// types
import { SnackbarProps } from 'types/snackbar';
import { StringColorProps } from 'types/password';

// assets
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';

// ============================|| CHANGE PASSWORD FORM ||============================ //

export default function AuthChangePassword() {
  //const scriptedRef = useScriptRef();

  const [level, setLevel] = useState<StringColorProps>();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { data: session } = useSession();
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | '' }>({ text: '', type: '' });
  //const router = useRouter();



  const handleClickShowOldPassword = () => {
    setShowOldPassword(!showOldPassword);
  };

  const handleClickShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event: SyntheticEvent) => {
    event.preventDefault();
  };

  const changePassword = (value: string) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    changePassword('');
  }, []);

  return (
    <Formik
      initialValues={{
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        oldPassword: Yup.string().max(255).required('Current Password is required'),
        newPassword: Yup.string()
          .required('New Password is required')
          .test('no-leading-trailing-whitespace', 'Password cannot start or end with spaces', (value) => value === value.trim())
          .max(10, 'Password must be less than 10 characters')
          .min(8, 'Password must be at least 8 characters')
          .test('not-same-as-old', 'New password must be different from current password', function (value) {
            return value !== this.parent.oldPassword;
          }),
        confirmPassword: Yup.string()
          .required('Confirm Password is required')
          .test('confirmPassword', 'Both passwords must match!', (confirmPassword, yup) => yup.parent.newPassword === confirmPassword)
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {

        try {
          // Notee: This form does not connect to the API yet (as per requirements)
          // This is just UI implementation for this sprint


          const token = session?.token?.accessToken;

          if (!token) {
            throw new Error('You must be logged in to change your password.');
          }


          const res = await authApi.changePassword(
            { oldPassword: values.oldPassword, newPassword: values.newPassword },
            token
          );


          if (res.status === 200 || res.data) {
            setStatus({ success: true });
            setSubmitting(false);

            openSnackbar({
              open: true,
              message: res.data?.message || 'Password changed successfully!',
              variant: 'alert',
              alert: { color: 'success' },
              close: false
            } as SnackbarProps);

            setMessage({ text: 'Password changed successfully! Redirecting...', type: 'success' });

            setTimeout(async () => {
              await signOut({ redirect: false });
              window.location.href = '/login';
            }, 2500);
          }
        } catch (err: any) {
          console.error('Change password error:', err);

          // Extract the most useful error message
          const errorMessage =
            err.response?.data?.message ||
            err.response?.data?.error ||
            err.message ||
            'Failed to change password. Please try again.';

          // Show error clearly on screen
          setStatus({ success: false });
          setErrors({ submit: errorMessage });
          setSubmitting(false);

          openSnackbar({
            open: true,
            message: errorMessage,
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          } as SnackbarProps);

          setMessage({
            text: errorMessage,
            type: 'error'
          });
        }
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="old-password">Current Password*</InputLabel>
                <OutlinedInput
                  fullWidth
                  error={Boolean(touched.oldPassword && errors.oldPassword)}
                  id="old-password"
                  type={showOldPassword ? 'text' : 'password'}
                  value={values.oldPassword}
                  name="oldPassword"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowOldPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        color="secondary"
                      >
                        {showOldPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                      </IconButton>
                    </InputAdornment>
                  }
                  placeholder="Enter current password"
                />
              </Stack>
              {touched.oldPassword && errors.oldPassword && (
                <FormHelperText error id="helper-text-old-password">
                  {errors.oldPassword}
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="new-password">New Password*</InputLabel>
                <OutlinedInput
                  fullWidth
                  error={Boolean(touched.newPassword && errors.newPassword)}
                  id="new-password"
                  type={showNewPassword ? 'text' : 'password'}
                  value={values.newPassword}
                  name="newPassword"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                    changePassword(e.target.value);
                  }}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowNewPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        color="secondary"
                      >
                        {showNewPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                      </IconButton>
                    </InputAdornment>
                  }
                  placeholder="Enter new password"
                />
              </Stack>
              {touched.newPassword && errors.newPassword && (
                <FormHelperText error id="helper-text-new-password">
                  {errors.newPassword}
                </FormHelperText>
              )}
              <FormControl fullWidth sx={{ mt: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <Box sx={{ bgcolor: level?.color, width: 85, height: 8, borderRadius: '7px' }} />
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle1" fontSize="0.75rem">
                      {level?.label}
                    </Typography>
                  </Grid>
                </Grid>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="confirm-password">Confirm New Password*</InputLabel>
                <OutlinedInput
                  fullWidth
                  error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={values.confirmPassword}
                  name="confirmPassword"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowConfirmPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        color="secondary"
                      >
                        {showConfirmPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                      </IconButton>
                    </InputAdornment>
                  }
                  placeholder="Confirm new password"
                />
              </Stack>
              {touched.confirmPassword && errors.confirmPassword && (
                <FormHelperText error id="helper-text-confirm-password">
                  {errors.confirmPassword}
                </FormHelperText>
              )}
            </Grid>

            {errors.submit && (
              <Grid item xs={12}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Grid>
            )}
            <Grid item xs={12}>
              {message.text && (
                <Typography
                  variant="body2"
                  sx={{
                    color: message.type === 'success' ? 'green' : 'red',
                    textAlign: 'center'
                  }}
                >
                  {message.text}
                </Typography>
              )}
              <AnimateButton>
                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                  Change Password
                </Button>
              </AnimateButton>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
}
