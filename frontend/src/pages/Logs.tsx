import React from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, InputAdornment } from '@mui/material';
import { Search, Filter } from 'lucide-react';

const Logs: React.FC = () => {
    // Mock data for logs
    const mockLogs = [
        { id: 1, timestamp: '2026-02-21 12:00:01', source: 'Firewall', level: 'Info', message: 'Connection allowed from 192.168.1.5' },
        { id: 2, timestamp: '2026-02-21 12:05:22', source: 'Auth Service', level: 'Warning', message: 'Failed login attempt for user admin' },
        { id: 3, timestamp: '2026-02-21 12:10:45', source: 'Web Server', level: 'Error', message: '500 Internal Server Error on /api/data' },
        { id: 4, timestamp: '2026-02-21 12:15:10', source: 'IDS', level: 'Critical', message: 'SQL Injection attempt detected' },
        { id: 5, timestamp: '2026-02-21 12:20:30', source: 'Database', level: 'Info', message: 'Backup completed successfully' },
    ];

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>Log Explorer</Typography>

            <Paper sx={{ p: 2, mb: 3, display: 'flex', gap: 2 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search logs..."
                    size="small"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search size={20} />
                            </InputAdornment>
                        ),
                    }}
                />
                <TextField
                    sx={{ minWidth: 200 }}
                    variant="outlined"
                    placeholder="Filter by source"
                    size="small"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Filter size={20} />
                            </InputAdornment>
                        ),
                    }}
                />
            </Paper>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Timestamp</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Source</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Level</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Message</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {mockLogs.map((log) => (
                            <TableRow key={log.id} hover>
                                <TableCell>{log.timestamp}</TableCell>
                                <TableCell>{log.source}</TableCell>
                                <TableCell>
                                    <Box sx={{
                                        px: 1, py: 0.5, borderRadius: 1, display: 'inline-block',
                                        bgcolor: log.level === 'Critical' ? 'error.dark' :
                                            log.level === 'Error' ? 'error.main' :
                                                log.level === 'Warning' ? 'warning.main' : 'info.main',
                                        color: 'white', fontSize: '0.75rem', fontWeight: 'bold'
                                    }}>
                                        {log.level}
                                    </Box>
                                </TableCell>
                                <TableCell>{log.message}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default Logs;
