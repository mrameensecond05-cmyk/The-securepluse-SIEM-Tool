import React, { useState } from 'react';
import { Box, Typography, Container, Paper, Stack, alpha, useTheme, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Users, ChevronRight, Activity } from 'lucide-react';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const [selectedRole, setSelectedRole] = useState<'admin' | 'user' | null>(null);

    const handleRoleSelect = (role: 'admin' | 'user') => {
        setSelectedRole(role);
        // Simulate login delay or transition
        setTimeout(() => {
            navigate('/dashboard');
        }, 500);
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

                    {/* Right Side: Role Selection */}
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
                            Role-Based Entry
                        </Typography>

                        <Stack spacing={3}>
                            {/* SOC Admin Card */}
                            <Box
                                onClick={() => handleRoleSelect('admin')}
                                sx={{
                                    p: 3,
                                    borderRadius: 3,
                                    border: '1px solid',
                                    borderColor: selectedRole === 'admin' ? 'primary.main' : 'rgba(255,255,255,0.05)',
                                    bgcolor: selectedRole === 'admin' ? alpha(theme.palette.primary.main, 0.05) : 'rgba(255,255,255,0.02)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        borderColor: 'primary.main',
                                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                                    },
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <Box>
                                    <Typography variant="h6" sx={{ color: 'text.primary', mb: 0.5 }}>
                                        SOC Admin
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                        Access Global Audit & Incidents
                                    </Typography>
                                </Box>
                                <Lock size={20} color={theme.palette.primary.main} />
                            </Box>

                            {/* Security User Card */}
                            <Box
                                onClick={() => handleRoleSelect('user')}
                                sx={{
                                    p: 3,
                                    borderRadius: 3,
                                    border: '1px solid',
                                    borderColor: selectedRole === 'user' ? 'secondary.main' : 'rgba(255,255,255,0.05)',
                                    bgcolor: selectedRole === 'user' ? alpha(theme.palette.secondary.main, 0.05) : 'rgba(255,255,255,0.02)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        borderColor: 'secondary.main',
                                        bgcolor: alpha(theme.palette.secondary.main, 0.05),
                                    },
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <Box>
                                    <Typography variant="h6" sx={{ color: 'text.primary', mb: 0.5 }}>
                                        Security User
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                        Asset Alerts & Feedbacks
                                    </Typography>
                                </Box>
                                <Users size={20} color={theme.palette.secondary.main} />
                            </Box>
                        </Stack>
                    </Paper>
                </Box>
            </Container>
        </Box>
    );
};

export default LoginPage;
