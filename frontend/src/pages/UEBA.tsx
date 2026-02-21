import React from 'react';
import { Box, Typography, Paper, Grid, CircularProgress } from '@mui/material';
import { Users, UserX, UserCheck, TrendingUp } from 'lucide-react';

const UEBA: React.FC = () => {
    const anomalousUsers = [
        { id: 1, name: 'john.doe', score: 85, reason: 'Logins from unusual geographic location (Russia)', status: 'High Risk' },
        { id: 2, name: 'sarah.smith', score: 62, reason: 'Accessing sensitive database at 3 AM', status: 'Medium Risk' },
        { id: 3, name: 'dev-service-acct', score: 45, reason: 'Unusual number of failed API calls', status: 'Low Risk' },
    ];

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>User Behavior Analytics (UEBA)</Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, md: 3 }}>
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Users size={32} />
                        <Typography variant="h4" sx={{ my: 1 }}>1,245</Typography>
                        <Typography variant="body2" color="text.secondary">Monitored Users</Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                    <Paper sx={{ p: 3, textAlign: 'center', borderTop: '4px solid #f44336' }}>
                        <UserX size={32} color="#f44336" />
                        <Typography variant="h4" sx={{ my: 1 }}>3</Typography>
                        <Typography variant="body2" color="text.secondary">High Risk Users</Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                    <Paper sx={{ p: 3, textAlign: 'center', borderTop: '4px solid #ff9800' }}>
                        <TrendingUp size={32} color="#ff9800" />
                        <Typography variant="h4" sx={{ my: 1 }}>12</Typography>
                        <Typography variant="body2" color="text.secondary">Anomalies Today</Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                    <Paper sx={{ p: 3, textAlign: 'center', borderTop: '4px solid #4caf50' }}>
                        <UserCheck size={32} color="#4caf50" />
                        <Typography variant="h4" sx={{ my: 1 }}>98%</Typography>
                        <Typography variant="body2" color="text.secondary">Baseline Accuracy</Typography>
                    </Paper>
                </Grid>
            </Grid>

            <Typography variant="h6" sx={{ mb: 2 }}>Risk Analysis Dashboard</Typography>
            <Grid container spacing={3}>
                {anomalousUsers.map((user) => (
                    <Grid size={{ xs: 12, md: 4 }} key={user.id}>
                        <Paper sx={{ p: 3, position: 'relative', overflow: 'hidden' }}>
                            <Box sx={{ position: 'absolute', top: 0, right: 0, p: 1, bgcolor: user.score > 80 ? 'error.main' : 'warning.main', color: 'white', borderBottomLeftRadius: 8 }}>
                                <Typography variant="caption" sx={{ fontWeight: 'bold' }}>{user.status}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                                    <CircularProgress variant="determinate" value={user.score} color={user.score > 80 ? 'error' : 'warning'} />
                                    <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
                                        <Typography variant="caption" component="div" sx={{ width: '100%', textAlign: 'center' }}>{user.score}</Typography>
                                    </Box>
                                </Box>
                                <Typography variant="h6">{user.name}</Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary">{user.reason}</Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default UEBA;
