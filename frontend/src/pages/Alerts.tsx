import React, { useState } from 'react';
import {
    Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Chip, IconButton, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, MenuItem, Grid, useTheme, alpha
} from '@mui/material';
import {
    ShieldAlert, Plus, Filter, X, CheckCircle, AlertTriangle, FileText
} from 'lucide-react';

// Types
interface Alert {
    id: string;
    timestamp: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    category: string;
    source: string;
    description: string;
    status: 'active' | 'investigating' | 'resolved' | 'dismissed';
}

// Dummy Data Generator
const generateDummyAlert = (id: number): Alert => {
    const severities: Alert['severity'][] = ['critical', 'high', 'medium', 'low'];
    const categories = ['Malware', 'Intrusion Attempt', 'Policy Violation', 'System Failure', 'Brute Force'];

    return {
        id: `ALT-2024-${1000 + id}`,
        timestamp: new Date(Date.now() - Math.random() * 86400000).toLocaleString(),
        severity: severities[Math.floor(Math.random() * severities.length)],
        category: categories[Math.floor(Math.random() * categories.length)],
        source: `Agent-${Math.floor(Math.random() * 255)}`,
        description: 'Suspicious activity detected on endpoint. Multiple failed login attempts observed.',
        status: 'active'
    };
};

const initialAlerts = Array.from({ length: 15 }, (_, i) => generateDummyAlert(i));

const Alerts: React.FC = () => {
    const theme = useTheme();
    const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
    const [openNewAlert, setOpenNewAlert] = useState(false);
    const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
    const [newAlertData, setNewAlertData] = useState({ category: 'Malware', severity: 'high', description: '' });

    // Handlers
    const handleGenerateAlert = () => {
        const newAlert: Alert = {
            id: `ALT-2024-${Math.floor(Math.random() * 10000)}`,
            timestamp: new Date().toLocaleString(),
            severity: newAlertData.severity as Alert['severity'],
            category: newAlertData.category,
            source: 'Simulated-Endpoint',
            description: newAlertData.description || 'Simulated security alert triggered by user.',
            status: 'active'
        };
        setAlerts([newAlert, ...alerts]);
        setOpenNewAlert(false);
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return theme.palette.error.main;
            case 'high': return theme.palette.warning.main;
            case 'medium': return theme.palette.info.main;
            case 'low': return theme.palette.success.main;
            default: return theme.palette.text.secondary;
        }
    };

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                        Security Alerts
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Real-time threat detection and incident management.
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button variant="outlined" startIcon={<Filter size={20} />}>
                        Filter
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        startIcon={<Plus size={20} />}
                        onClick={() => setOpenNewAlert(true)}
                    >
                        Generate Alert
                    </Button>
                </Box>
            </Box>

            {/* Alerts Table */}
            <Paper
                sx={{
                    width: '100%',
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 3
                }}
            >
                <TableContainer sx={{ maxHeight: 'calc(100vh - 250px)' }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Severity</TableCell>
                                <TableCell>Timestamp</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Source</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {alerts.map((alert) => (
                                <TableRow key={alert.id} hover>
                                    <TableCell sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                                        {alert.id}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={alert.severity.toUpperCase()}
                                            size="small"
                                            sx={{
                                                bgcolor: alpha(getSeverityColor(alert.severity), 0.1),
                                                color: getSeverityColor(alert.severity),
                                                fontWeight: 700,
                                                border: '1px solid',
                                                borderColor: alpha(getSeverityColor(alert.severity), 0.2)
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>{alert.timestamp}</TableCell>
                                    <TableCell>{alert.category}</TableCell>
                                    <TableCell sx={{ fontFamily: 'monospace' }}>{alert.source}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Box
                                                sx={{
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: '50%',
                                                    bgcolor: alert.status === 'active' ? 'error.main' : 'success.main'
                                                }}
                                            />
                                            {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                                        </Box>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            startIcon={<FileText size={16} />}
                                            onClick={() => setSelectedAlert(alert)}
                                            sx={{ borderRadius: 2, textTransform: 'none' }}
                                        >
                                            Case Study
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* New Alert Modal */}
            <Dialog open={openNewAlert} onClose={() => setOpenNewAlert(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AlertTriangle color={theme.palette.error.main} />
                    Simulate New Security Alert
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
                        <TextField
                            label="Alert Category"
                            select
                            fullWidth
                            value={newAlertData.category}
                            onChange={(e) => setNewAlertData({ ...newAlertData, category: e.target.value })}
                        >
                            {['Malware', 'Intrusion Attempt', 'DDoS', 'Data Exfiltration', 'Insider Threat'].map((opt) => (
                                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label="Severity"
                            select
                            fullWidth
                            value={newAlertData.severity}
                            onChange={(e) => setNewAlertData({ ...newAlertData, severity: e.target.value })}
                        >
                            {['low', 'medium', 'high', 'critical'].map((opt) => (
                                <MenuItem key={opt} value={opt}>{opt.toUpperCase()}</MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label="Description"
                            multiline
                            rows={3}
                            fullWidth
                            placeholder="Describe the simulated threat..."
                            value={newAlertData.description}
                            onChange={(e) => setNewAlertData({ ...newAlertData, description: e.target.value })}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenNewAlert(false)}>Cancel</Button>
                    <Button onClick={handleGenerateAlert} variant="contained" color="error">
                        Trigger Alert
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Case Study / Alert Details Modal */}
            {selectedAlert && (
                <Dialog open={!!selectedAlert} onClose={() => setSelectedAlert(null)} maxWidth="md" fullWidth>
                    <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ShieldAlert size={24} color={getSeverityColor(selectedAlert.severity)} />
                            Alert Case Study: {selectedAlert.id}
                        </Box>
                        <IconButton onClick={() => setSelectedAlert(null)}>
                            <X />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent dividers>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Typography variant="subtitle2" color="text.secondary">Timestamp</Typography>
                                <Typography variant="body1" sx={{ mb: 2 }}>{selectedAlert.timestamp}</Typography>

                                <Typography variant="subtitle2" color="text.secondary">Category</Typography>
                                <Typography variant="body1" sx={{ mb: 2 }}>{selectedAlert.category}</Typography>

                                <Typography variant="subtitle2" color="text.secondary">Source IP</Typography>
                                <Typography variant="body1" sx={{ fontFamily: 'monospace', mb: 2 }}>{selectedAlert.source}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Typography variant="subtitle2" color="text.secondary">Severity</Typography>
                                <Chip
                                    label={selectedAlert.severity.toUpperCase()}
                                    sx={{
                                        bgcolor: getSeverityColor(selectedAlert.severity),
                                        color: '#fff',
                                        fontWeight: 700,
                                        mb: 2
                                    }}
                                />

                                <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                                <Typography variant="body1" sx={{ mb: 2 }}>{selectedAlert.status.toUpperCase()}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.background.default, 0.5), border: '1px dashed', borderColor: 'divider' }}>
                                    <Typography variant="subtitle2" gutterBottom>Full Description</Typography>
                                    <Typography variant="body2">{selectedAlert.description}</Typography>
                                </Paper>
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Typography variant="h6" sx={{ mb: 2 }}>Analyst Notes</Typography>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    placeholder="Enter case notes, investigation findings, or remediation steps..."
                                    variant="outlined"
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setSelectedAlert(null)}>Cancel</Button>
                        <Button variant="contained" color="primary" startIcon={<CheckCircle size={18} />}>
                            Mark as Resolved
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Box>
    );
};

export default Alerts;
