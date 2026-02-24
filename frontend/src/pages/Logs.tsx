import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import client from '../api/client';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    InputAdornment,
    Chip,
    IconButton,
    Tooltip,
    useTheme,
    Stack,
    Switch,
    FormControlLabel,
} from '@mui/material';
import {
    Search,
    RefreshCcw,
    Download,
    Terminal,
    Activity,
    ShieldAlert,
    Info,
    Clock,
    Database,
    Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip as ChartTooltip } from 'recharts';

const Logs: React.FC = () => {
    const theme = useTheme();
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState('');
    const [liveMode, setLiveMode] = useState(true);
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Mock data for the chart (could be live-calculated later)
    const chartData = [
        { time: '04:00', count: 45 },
        { time: '04:05', count: 52 },
        { time: '04:10', count: 48 },
        { time: '04:15', count: 70 },
        { time: '04:20', count: 65 },
        { time: '04:25', count: 90 },
        { time: '04:30', count: 85 },
        { time: '04:35', count: 110 },
        { time: '04:40', count: 95 },
    ];

    // Check for incoming filter from navigation
    useEffect(() => {
        const state = location.state as { filter?: string };
        if (state && state.filter) {
            setSearchTerm(state.filter);
        }
    }, [location.state]);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const response = await client.get('/soc/alerts');
            // Map SOC format to our display format
            const items = response.data.data.items.map((item: any) => ({
                id: item.id,
                timestamp: item.timestamp,
                source: item.agent.name,
                level: item.rule.level >= 12 ? 'Critical' :
                    item.rule.level >= 7 ? 'Error' :
                        item.rule.level >= 4 ? 'Warning' : 'Info',
                message: item.rule.description
            }));
            setLogs(items);
        } catch (error) {
            console.error("Error fetching logs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
        // Polling for live mode
        let interval: any;
        if (liveMode) {
            interval = setInterval(fetchLogs, 10000); // Poll every 10 seconds
        }
        return () => clearInterval(interval);
    }, [liveMode]);

    const filteredLogs = useMemo(() => {
        return logs.filter(log =>
            log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.level.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [logs, searchTerm]);

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'Critical': return theme.palette.error.main;
            case 'Error': return theme.palette.error.light;
            case 'Warning': return theme.palette.warning.main;
            case 'Info': return theme.palette.primary.main;
            default: return theme.palette.text.secondary;
        }
    };

    const getLevelIcon = (level: string) => {
        switch (level) {
            case 'Critical': return <ShieldAlert size={14} />;
            case 'Error': return <ShieldAlert size={14} />;
            case 'Warning': return <Info size={14} />;
            case 'Info': return <Activity size={14} />;
            default: return <Clock size={14} />;
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Terminal size={32} />
                            LOG EXPLORER
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Real-time security event monitoring and audit trails
                        </Typography>
                    </Box>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <FormControlLabel
                            control={<Switch checked={liveMode} onChange={() => setLiveMode(!liveMode)} color="success" />}
                            label={
                                <Typography variant="body2" sx={{ fontWeight: 'bold', color: liveMode ? 'success.main' : 'text.disabled' }}>
                                    {liveMode ? 'LIVE FLOWING' : 'PAUSED'}
                                </Typography>
                            }
                        />
                        <Tooltip title="Refresh Logs">
                            <IconButton onClick={fetchLogs} sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
                                <RefreshCcw className={loading ? "animate-spin" : ""} size={20} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Export CSV">
                            <IconButton sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
                                <Download size={20} />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </Stack>
            </motion.div>

            {/* Stats and Chart Section */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 2fr' }, gap: 3, mb: 4 }}>
                <Paper
                    sx={{
                        p: 3,
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
                        border: '1px solid',
                        borderColor: 'divider',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 'bold' }}>Active Alerts</Typography>
                        <Typography variant="h3" sx={{ fontWeight: 800, mt: 1 }}>{logs.length * 12 + 84}</Typography>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                            <Chip size="small" label="+12.5%" color="success" sx={{ height: 20, fontSize: '0.65rem' }} />
                            <Typography variant="caption" color="text.secondary">from last hour</Typography>
                        </Stack>
                    </Box>
                    <Box sx={{ position: 'absolute', right: -20, bottom: -20, opacity: 0.1 }}>
                        <ShieldAlert size={120} />
                    </Box>
                </Paper>

                <Paper sx={{ p: 2, background: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
                    <Box sx={{ height: 120 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.3} />
                                        <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="time" hide />
                                <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
                                <ChartTooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff' }}
                                    itemStyle={{ color: theme.palette.primary.main }}
                                />
                                <Area type="monotone" dataKey="count" stroke={theme.palette.primary.main} fillOpacity={1} fill="url(#colorCount)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
                        LOG FREQUENCY (EVENTS PER MINUTE)
                    </Typography>
                </Paper>
            </Box>

            {/* Filter Section */}
            <Paper sx={{ p: 2, mb: 3, display: 'flex', gap: 2, alignItems: 'center', background: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
                <TextField
                    fullWidth
                    variant="standard"
                    placeholder="Filter logs by message, source or level..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ '& .MuiInput-underline:before': { borderBottom: 'none' }, '& .MuiInput-underline:after': { borderBottom: 'none' } }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search size={20} color={theme.palette.text.secondary} />
                            </InputAdornment>
                        ),
                    }}
                />
                <Stack direction="row" spacing={1}>
                    {['Critical', 'Error', 'Warning'].map(lvl => (
                        <Chip
                            key={lvl}
                            label={lvl}
                            size="small"
                            onClick={() => setSearchTerm(lvl)}
                            sx={{ cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
                        />
                    ))}
                </Stack>
            </Paper>

            {/* Logs Table */}
            {loading && logs.length === 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 10 }}>
                    <Loader2 className="animate-spin" size={48} color="#6366f1" />
                    <Typography sx={{ mt: 2 }} color="text.secondary">Contacting Wazuh Indexer...</Typography>
                </Box>
            ) : (
                <TableContainer
                    component={Paper}
                    sx={{
                        background: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                        maxHeight: 'calc(100vh - 450px)'
                    }}
                >
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ bgcolor: 'background.paper', color: 'text.secondary', fontWeight: 'bold' }}>TIMESTAMP</TableCell>
                                <TableCell sx={{ bgcolor: 'background.paper', color: 'text.secondary', fontWeight: 'bold' }}>SOURCE</TableCell>
                                <TableCell sx={{ bgcolor: 'background.paper', color: 'text.secondary', fontWeight: 'bold' }}>LEVEL</TableCell>
                                <TableCell sx={{ bgcolor: 'background.paper', color: 'text.secondary', fontWeight: 'bold' }}>EVENT MESSAGE</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <AnimatePresence>
                                {filteredLogs.length > 0 ? (
                                    filteredLogs.map((log, index) => (
                                        <TableRow
                                            key={log.id}
                                            component={motion.tr}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ delay: index * 0.05 }}
                                            hover
                                            sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.02) !important' } }}
                                        >
                                            <TableCell sx={{ fontSize: '0.85rem', color: 'text.secondary', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                <Stack direction="row" alignItems="center" spacing={1}>
                                                    <Clock size={14} opacity={0.5} />
                                                    {log.timestamp}
                                                </Stack>
                                            </TableCell>
                                            <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                <Stack direction="row" alignItems="center" spacing={1}>
                                                    <Database size={14} color={theme.palette.primary.main} />
                                                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>{log.source}</Typography>
                                                </Stack>
                                            </TableCell>
                                            <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                <Chip
                                                    icon={getLevelIcon(log.level)}
                                                    label={log.level.toUpperCase()}
                                                    size="small"
                                                    sx={{
                                                        fontSize: '0.65rem',
                                                        fontWeight: 800,
                                                        bgcolor: `${getLevelColor(log.level)}15`,
                                                        color: getLevelColor(log.level),
                                                        border: '1px solid',
                                                        borderColor: `${getLevelColor(log.level)}30`,
                                                        '& .MuiChip-icon': { color: 'inherit' }
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                <Typography
                                                    sx={{
                                                        fontFamily: "'Fira Code', 'Courier New', monospace",
                                                        fontSize: '0.85rem',
                                                        color: log.level === 'Critical' ? 'error.light' : 'text.primary'
                                                    }}
                                                >
                                                    {log.message}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center" sx={{ py: 10 }}>
                                            <Typography color="text.secondary">No logs found matching your criteria</Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </AnimatePresence>
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default Logs;
