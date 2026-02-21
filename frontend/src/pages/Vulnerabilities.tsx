import React from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, LinearProgress } from '@mui/material';
import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';

const Vulnerabilities: React.FC = () => {
    const vulns = [
        { id: 1, title: 'Outdated SSH Version', severity: 'High', score: 8.2, status: 'Open', system: 'Ubuntu-Web-01' },
        { id: 2, title: 'Weak SSL Cipher Suite', severity: 'Medium', score: 5.4, status: 'In Progress', system: 'Load-Balancer' },
        { id: 3, title: 'Unpatched Kernel Vulnerability', severity: 'Critical', score: 9.8, status: 'Open', system: 'DB-Server-02' },
        { id: 4, title: 'Default Admin Password', severity: 'Critical', score: 10.0, status: 'Resolved', system: 'Internal-Wiki' },
    ];

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>Vulnerability Management</Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ bgcolor: 'error.dark', color: 'white' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                    <Typography variant="h6">Critical</Typography>
                                    <Typography variant="h3">12</Typography>
                                </Box>
                                <ShieldAlert size={48} opacity={0.5} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ bgcolor: 'warning.main', color: 'white' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                    <Typography variant="h6">High</Typography>
                                    <Typography variant="h3">28</Typography>
                                </Box>
                                <AlertTriangle size={48} opacity={0.5} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ bgcolor: 'success.main', color: 'white' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                    <Typography variant="h6">Resolved</Typography>
                                    <Typography variant="h3">145</Typography>
                                </Box>
                                <ShieldCheck size={48} opacity={0.5} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Recent Vulnerabilities</Typography>
                {vulns.map((vuln) => (
                    <Box key={vuln.id} sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{vuln.title}</Typography>
                            <Typography variant="body2" color="text.secondary">{vuln.system}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ flexGrow: 1 }}>
                                <LinearProgress
                                    variant="determinate"
                                    value={vuln.score * 10}
                                    color={vuln.severity === 'Critical' ? 'error' : vuln.severity === 'High' ? 'error' : 'warning'}
                                />
                            </Box>
                            <Typography variant="body2" sx={{ minWidth: 40, textAlign: 'right', fontWeight: 'bold' }}>
                                {vuln.score}
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </Paper>
        </Box>
    );
};

export default Vulnerabilities;
