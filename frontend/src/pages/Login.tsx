import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Paper, Stack, alpha, useTheme, TextField, Button, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Users, Mail } from 'lucide-react';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const theme = useTheme();

    const [isRegister, setIsRegister] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Initialize admin user if it doesn't exist
    useEffect(() => {
        const users = JSON.parse(localStorage.getItem('sp_users') || '[]');
        if (users.length === 0) {
            users.push({ username: 'admin', password: 'admin123', email: 'admin@securepulse.local' });
            localStorage.setItem('sp_users', JSON.stringify(users));
        }
    }, []);

    const handleAction = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        const users = JSON.parse(localStorage.getItem('sp_users') || '[]');

        if (isRegister) {
            // Registration Logic
            if (!username || !password || !email) {
                setError('Please fill in all fields');
                return;
            }

            if (users.find((u: any) => u.username === username)) {
                setError('Username already exists');
                return;
            }

            users.push({ username, password, email });
            localStorage.setItem('sp_users', JSON.stringify(users));
            setSuccess('Registration successful! Please login.');
            setIsRegister(false);
            setUsername('');
            setPassword('');
            setEmail('');
        } else {
            // Login Logic
            const user = users.find((u: any) => u.username === username && u.password === password);
            if (user) {
                localStorage.setItem('token', `mock-token-${username}`);
                localStorage.setItem('user', JSON.stringify({ username: user.username, role: 'admin' }));
                navigate('/dashboard');
            } else {
                setError('Invalid username or password');
            }
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
                backgroundImage: 'radial-gradient(circle at 50% 0%, #1a1d3d 0%, #05060a 100%)',
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

                        <Typography variant="h2" sx={{ mb: 1, letterSpacing: '-0.03em', fontWeight: 700 }}>
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

                    <Paper
                        elevation={0}
                        sx={{
                            flex: 0.8,
                            p: 5,
                            bgcolor: alpha(theme.palette.background.paper, 0.8),
                            backdropFilter: 'blur(10px)',
                            border: '1px solid',
                            borderColor: alpha(theme.palette.divider, 0.1),
                            width: '100%',
                            maxWidth: 450,
                            borderRadius: 4,
                        }}
                    >
                        <Typography variant="h5" sx={{ mb: 4, fontWeight: 600 }}>
                            {isRegister ? 'Create Account' : 'Authorized Access'}
                        </Typography>

                        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                        {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

                        <form onSubmit={handleAction}>
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
                                {isRegister && (
                                    <TextField
                                        fullWidth
                                        label="Email Address"
                                        type="email"
                                        variant="outlined"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        InputProps={{
                                            startAdornment: <Mail size={20} color={theme.palette.text.secondary} style={{ marginRight: 8 }} />,
                                        }}
                                    />
                                )}
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
                                    sx={{ py: 1.8, fontSize: '1rem', fontWeight: 600, borderRadius: 2 }}
                                >
                                    {isRegister ? 'Register' : 'Sign In'}
                                </Button>
                            </Stack>
                        </form>

                        <Box sx={{ mt: 3, textAlign: 'center' }}>
                            <Button
                                variant="text"
                                color="primary"
                                onClick={() => {
                                    setIsRegister(!isRegister);
                                    setError(null);
                                    setSuccess(null);
                                }}
                            >
                                {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
                            </Button>
                        </Box>

                        <Typography variant="caption" sx={{ mt: 4, display: 'block', textAlign: 'center', color: 'text.secondary', opacity: 0.6 }}>
                            SECUREPULSE AUTH GATEWAY (LOCAL)
                        </Typography>
                    </Paper>
                </Box>
            </Container>
        </Box>
    );
};

export default LoginPage;
