import React, { useState } from 'react';
import { Box, Typography, Container, Paper, Stack, alpha, useTheme, TextField, Button, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Users } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store';
import { loginUser } from '../store/authSlice';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state) => state.auth);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await dispatch(loginUser({ username, password })).unwrap();
            navigate('/dashboard');
        } catch (err) {
            console.error('Login failed:', err);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default',
                p: 2,
                backgroundImage: 'radial-gradient(circle at 50% 0%, #1a1d2d 0%, #05060a 100%)',
            }}
        >
            <Container maxWidth="lg">
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 8,
                    }}
                >
                    {/* Left Side: Branding */}
                    <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
                        <Box sx={{
                            display: 'inline-flex',
                            p: 2,
                            borderRadius: '24px',
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            mb: 4,
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
                        }}>
                            <Shield size={48} color={theme.palette.primary.main} strokeWidth={1.5} />
                        </Box>

                        <Typography variant="h2" sx={{ mb: 1, letterSpacing: '-0.03em' }}>
                            SECURE<span style={{ color: theme.palette.primary.main }}>PULSE</span>
                        </Typography>

                        <Typography variant="h5" sx={{ color: 'text.secondary', mb: 4, fontWeight: 400 }}>
                            Normalized SIEM Monitoring & Asset Integrity Verification.
                        </Typography>

                        <Stack direction="row" alignItems="center" spacing={2} sx={{ justifyContent: { xs: 'center', md: 'flex-start' } }}>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                                {[1, 2, 3].map((i) => (
                                    <Box key={i} sx={{
                                        width: 12,
                                        height: 12,
                                        borderRadius: '50%',
                                        bgcolor: theme.palette.primary.main,
                                        opacity: i === 3 ? 0.3 : 1
                                    }} />
                                ))}
                            </Box>
                            <Typography variant="caption" sx={{ color: 'text.secondary', letterSpacing: '0.1em' }}>
                                ACTIVE SOC NODES: 3/3 ONLINE
                            </Typography>
                        </Stack>
                    </Box>

                    {/* Right Side: Login Form */}
                    <Paper
                        elevation={0}
                        sx={{
                            flex: 0.8,
                            p: 5,
                            bgcolor: 'background.paper',
                            border: '1px solid',
                            borderColor: 'divider',
                            width: '100%',
                            maxWidth: 500,
                        }}
                    >
                        <Typography variant="h5" sx={{ mb: 4, fontFamily: 'monospace' }}>
                            Authorized Access
                        </Typography>

                        {error && (
                            <Alert severity="error" sx={{ mb: 3 }}>
                                {error}
                            </Alert>
                        )}

                        <form onSubmit={handleLogin}>
                            <Stack spacing={3}>
                                <TextField
                                    fullWidth
                                    label="Username"
                                    variant="outlined"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    InputProps={{
                                        startAdornment: <Users size={20} color={theme.palette.text.secondary} style={{ marginRight: 8 }} />,
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    label="Password"
                                    type="password"
                                    variant="outlined"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    InputProps={{
                                        startAdornment: <Lock size={20} color={theme.palette.text.secondary} style={{ marginRight: 8 }} />,
                                    }}
                                />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    disabled={loading}
                                    sx={{ py: 1.5, fontSize: '1rem', fontWeight: 600 }}
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                                </Button>
                            </Stack>
                        </form>

                        <Typography variant="caption" sx={{ mt: 3, display: 'block', textAlign: 'center', color: 'text.secondary' }}>
                            Protected by SecurePulse Auth Gateway.
                            <br />
                            Unauthorized access attempts are logged.
                        </Typography>
                    </Paper>
                </Box>
            </Container>
        </Box>
    );
};

export default LoginPage;
