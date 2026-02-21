import React from 'react';
import { Box, Typography, Grid, useTheme, Paper, IconButton, LinearProgress } from '@mui/material';
import {
    Shield, AlertTriangle, Activity, Server, Cpu, MoreVertical,
    Wifi, Database, TrendingUp, TrendingDown
} from 'lucide-react';
import {
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { alpha } from '@mui/material/styles';

// --- Dummy Data ---
const alertTrendData = [
    { name: '00:00', alerts: 12, traffic: 400 },
    { name: '04:00', alerts: 19, traffic: 300 },
    { name: '08:00', alerts: 15, traffic: 550 },
    { name: '12:00', alerts: 45, traffic: 800 }, // Peak
    { name: '16:00', alerts: 32, traffic: 600 },
    { name: '20:00', alerts: 20, traffic: 450 },
    { name: '23:59', alerts: 10, traffic: 300 },
];

const severityData = [
    { name: 'Critical', value: 5, color: '#ef4444' },
    { name: 'High', value: 12, color: '#f97316' },
    { name: 'Medium', value: 25, color: '#eab308' },
    { name: 'Low', value: 45, color: '#3b82f6' },
];

const topAttacksData = [
    { name: 'SQL Injection', value: 85, color: '#ef4444' },
    { name: 'XSS', value: 65, color: '#f97316' },
    { name: 'Brute Force', value: 48, color: '#eab308' },
    { name: 'DDoS', value: 30, color: '#3b82f6' },
];

// --- Dummy Data ---

const GlassCard = ({ children, sx = {}, title, action }: any) => {
    const theme = useTheme();
    return (
        <Paper
            elevation={0}
            sx={{
                p: 2.5,
                height: '100%',
                borderRadius: 4,
                bgcolor: alpha(theme.palette.background.paper, 0.4),
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.01) 0%, rgba(255,255,255,0.03) 100%)',
                boxShadow: '0 4px 24px -1px rgba(0, 0, 0, 0.2)',
                transition: 'transform 0.2s',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 32px -2px rgba(0, 0, 0, 0.3)',
                    borderColor: alpha(theme.palette.primary.main, 0.3)
                },
                ...sx
            }}
        >
            {title && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', letterSpacing: '0.02em' }}>
                        {title}
                    </Typography>
                    {action || <IconButton size="small"><MoreVertical size={16} /></IconButton>}
                </Box>
            )}
            {children}
        </Paper>
    );
};

const StatWidget = ({ title, value, trend, icon: Icon, color }: any) => {
    const theme = useTheme();
    return (
        <GlassCard sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 0.5 }}>
                        {title}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
                        {value}
                    </Typography>
                </Box>
                <Box sx={{
                    p: 1.2,
                    borderRadius: '12px',
                    bgcolor: alpha(color, 0.1),
                    color: color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Icon size={22} />
                </Box>
            </Box>
            {trend && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1.5, gap: 1 }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: trend.isPositive ? theme.palette.success.main : theme.palette.error.main,
                        bgcolor: alpha(trend.isPositive ? theme.palette.success.main : theme.palette.error.main, 0.1),
                        px: 0.8, py: 0.3, borderRadius: 1
                    }}>
                        {trend.isPositive ? <TrendingUp size={12} style={{ marginRight: 4 }} /> : <TrendingDown size={12} style={{ marginRight: 4 }} />}
                        {trend.value}%
                    </Box>
                    <Typography variant="caption" color="text.secondary">vs last week</Typography>
                </Box>
            )}
        </GlassCard>
    );
};

const Dashboard: React.FC = () => {
    const theme = useTheme();

    return (
        <Box>
            {/* Header */}
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.03em', mb: 0.5 }}>
                        Security <Box component="span" sx={{ color: theme.palette.primary.main }}>Overview</Box>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Real-time monitoring of infrastructure and threat landscape.
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Box px={2} py={0.5} borderRadius={2} bgcolor={alpha(theme.palette.success.main, 0.1)} display="flex" alignItems="center" gap={1}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: theme.palette.success.main, boxShadow: `0 0 8px ${theme.palette.success.main}` }} />
                        <Typography variant="caption" sx={{ fontWeight: 600, color: theme.palette.success.main }}>SYSTEM ONLINE</Typography>
                    </Box>
                </Box>
            </Box>

            {/* Stats Row */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatWidget title="Total Threats" value="8,245" trend={{ value: 12, isPositive: false }} icon={Shield} color={theme.palette.error.main} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatWidget title="Net Traffic" value="452 GB" trend={{ value: 5, isPositive: true }} icon={Activity} color={theme.palette.primary.main} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatWidget title="Active Agents" value="124" trend={{ value: 2, isPositive: true }} icon={Server} color={theme.palette.success.main} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatWidget title="Vulnerabilities" value="18" trend={{ value: 8, isPositive: false }} icon={AlertTriangle} color={theme.palette.warning.main} />
                </Grid>
            </Grid>

            {/* Main Content Grid */}
            <Grid container spacing={2}>
                {/* Left Column (Charts) */}
                <Grid size={{ xs: 12, md: 8 }} container spacing={2}>
                    {/* Traffic & Threats Chart */}
                    <Grid size={{ xs: 12 }}>
                        <GlassCard title="Threat Traffic Correlation">
                            <ResponsiveContainer width="100%" height={320}>
                                <AreaChart data={alertTrendData}>
                                    <defs>
                                        <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.3} />
                                            <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorAlerts" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={theme.palette.error.main} stopOpacity={0.3} />
                                            <stop offset="95%" stopColor={theme.palette.error.main} stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.1)} vertical={false} />
                                    <XAxis dataKey="name" stroke={theme.palette.text.secondary} fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke={theme.palette.text.secondary} fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: alpha(theme.palette.background.paper, 0.8),
                                            backdropFilter: 'blur(4px)',
                                            border: `1px solid ${theme.palette.divider}`,
                                            borderRadius: 8,
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                                        }}
                                        itemStyle={{ fontSize: 13 }}
                                    />
                                    <Area type="monotone" dataKey="traffic" stroke={theme.palette.primary.main} fillOpacity={1} fill="url(#colorTraffic)" strokeWidth={2} />
                                    <Area type="monotone" dataKey="alerts" stroke={theme.palette.error.main} fillOpacity={1} fill="url(#colorAlerts)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </GlassCard>
                    </Grid>

                    {/* Attack Types & System Health */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <GlassCard title="Top Attack Vectors">
                            <Box sx={{ height: 250 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={topAttacksData} layout="vertical" margin={{ left: -20 }}>
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12, fill: theme.palette.text.secondary }} tickLine={false} axisLine={false} />
                                        <Tooltip cursor={{ fill: alpha(theme.palette.text.primary, 0.05) }} contentStyle={{ backgroundColor: theme.palette.background.paper, borderRadius: 8 }} />
                                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                                            {topAttacksData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                        </GlassCard>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <GlassCard title="System Health">
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
                                {[
                                    { label: 'CPU Load', value: 45, icon: Cpu, color: theme.palette.success.main },
                                    { label: 'Memory', value: 78, icon: Database, color: theme.palette.warning.main },
                                    { label: 'Network', value: 24, icon: Wifi, color: theme.palette.primary.main }
                                ].map((item) => (
                                    <Box key={item.label}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <item.icon size={16} color={theme.palette.text.secondary} />
                                                <Typography variant="caption" sx={{ fontWeight: 600 }}>{item.label}</Typography>
                                            </Box>
                                            <Typography variant="caption" sx={{ fontWeight: 700 }}>{item.value}%</Typography>
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={item.value}
                                            sx={{
                                                height: 6,
                                                borderRadius: 3,
                                                bgcolor: alpha(item.color, 0.1),
                                                '& .MuiLinearProgress-bar': { bgcolor: item.color, borderRadius: 3 }
                                            }}
                                        />
                                    </Box>
                                ))}
                            </Box>
                        </GlassCard>
                    </Grid>
                </Grid>

                {/* Right Column (Side Widgets) */}
                <Grid size={{ xs: 12, md: 4 }} container spacing={2} direction="column">
                    {/* Severity Pie */}
                    <Grid>
                        <GlassCard title="Threat Severity">
                            <Box sx={{ height: 220, position: 'relative' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={severityData}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {severityData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ backgroundColor: theme.palette.background.paper, borderRadius: 8 }} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <Box sx={{
                                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                                    textAlign: 'center'
                                }}>
                                    <Typography variant="h4" sx={{ fontWeight: 700 }}>87</Typography>
                                    <Typography variant="caption" color="text.secondary">Alerts</Typography>
                                </Box>
                            </Box>
                        </GlassCard>
                    </Grid>

                    {/* Recent Activity Feed */}
                    <Grid sx={{ flexGrow: 1 }}>
                        <GlassCard title="Recent Live Activity" sx={{ height: '100%', minHeight: 400 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                                {[
                                    { msg: "SSH Brute Force blocked", ip: "Internal-VLAN", time: "2m ago", type: "error" },
                                    { msg: "New Admin Login from US", ip: "External-GW", time: "15m ago", type: "warning" },
                                    { msg: "Malware signature update", ip: "Cloud-Sync", time: "1h ago", type: "success" },
                                    { msg: "Outbound traffic spike", ip: "Web-Srv-01", time: "3h ago", type: "info" },
                                    { msg: "Unauthorized port scan", ip: "DMZ-Zone", time: "4h ago", type: "error" },
                                    { msg: "Database backup complete", ip: "DB-Prod", time: "5h ago", type: "success" },
                                ].map((item, i) => (
                                    <Box key={i} sx={{
                                        display: 'flex',
                                        gap: 2,
                                        p: 1.5,
                                        borderBottom: i < 5 ? `1px dashed ${alpha(theme.palette.divider, 0.5)}` : 'none',
                                        '&:hover': { bgcolor: alpha(theme.palette.action.hover, 0.1), borderRadius: 1 }
                                    }}>
                                        <Box sx={{ mt: 0.5 }}>
                                            <Box sx={{
                                                width: 8, height: 8, borderRadius: '50%',
                                                bgcolor: theme.palette[item.type as 'error' | 'warning' | 'success' | 'info'].main
                                            }} />
                                        </Box>
                                        <Box>
                                            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>{item.msg}</Typography>
                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.2 }}>
                                                {item.ip} • {item.time}
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </GlassCard>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
