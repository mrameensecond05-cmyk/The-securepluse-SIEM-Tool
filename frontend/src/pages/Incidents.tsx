import React, { useState } from 'react';
import {
    Box, Typography, Paper, Chip, Button, IconButton, Menu, MenuItem,
    useTheme, alpha, Avatar, Grid
} from '@mui/material';
import {
    MoreVertical, Clock, AlertCircle, CheckCircle,
    Activity, Plus
} from 'lucide-react';

// Types
interface Incident {
    id: string;
    title: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    status: 'open' | 'in_progress' | 'resolved';
    assignee: string;
    timestamp: string;
    description: string;
}

// Dummy Data
const initialIncidents: Incident[] = [
    {
        id: 'INC-001',
        title: 'Potential Data Exfiltration',
        severity: 'critical',
        status: 'open',
        assignee: 'Unassigned',
        timestamp: '10 mins ago',
        description: 'Large outbound traffic spike detected from HR-Server to unknown IP.'
    },
    {
        id: 'INC-002',
        title: 'Malware Detected on Dev-01',
        severity: 'high',
        status: 'in_progress',
        assignee: 'John Doe',
        timestamp: '2 hours ago',
        description: 'Anti-virus flagged suspicious executable. Isolating host.'
    },
    {
        id: 'INC-003',
        title: 'Failed Login Brute Force',
        severity: 'medium',
        status: 'resolved',
        assignee: 'Jane Smith',
        timestamp: 'Yesterday',
        description: 'Multiple failed attempts on SSH. IP blocked automatically.'
    },
    {
        id: 'INC-004',
        title: 'Policy Violation - USB',
        severity: 'low',
        status: 'open',
        assignee: 'Unassigned',
        timestamp: '1 hour ago',
        description: 'Unauthorized USB device plugged into reception PC.'
    }
];

const Incidents: React.FC = () => {
    const theme = useTheme();
    const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: string) => {
        setAnchorEl(event.currentTarget);
        setSelectedIncidentId(id);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedIncidentId(null);
    };

    const handleStatusChange = (newStatus: Incident['status']) => {
        if (selectedIncidentId) {
            setIncidents(incidents.map(inc =>
                inc.id === selectedIncidentId ? { ...inc, status: newStatus } : inc
            ));
        }
        handleMenuClose();
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

    const IncidentCard = ({ incident }: { incident: Incident }) => (
        <Paper
            sx={{
                p: 2,
                mb: 2,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: alpha(theme.palette.background.paper, 0.6),
                transition: 'transform 0.2s',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    borderColor: 'primary.main',
                    boxShadow: 2
                }
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Chip
                    label={incident.severity.toUpperCase()}
                    size="small"
                    sx={{
                        bgcolor: alpha(getSeverityColor(incident.severity), 0.1),
                        color: getSeverityColor(incident.severity),
                        fontWeight: 700,
                        height: 20,
                        fontSize: '0.7rem'
                    }}
                />
                <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, incident.id)}
                >
                    <MoreVertical size={16} />
                </IconButton>
            </Box>

            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>
                {incident.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.85rem' }}>
                {incident.description}
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                    <Clock size={14} />
                    <Typography variant="caption">{incident.timestamp}</Typography>
                </Box>
                <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem', bgcolor: 'primary.main' }}>
                    {incident.assignee.charAt(0)}
                </Avatar>
            </Box>
        </Paper>
    );

    const KanbanColumn = ({ title, status, icon: Icon, color }: any) => (
        <Grid item xs={12} md={4}>
            <Paper
                sx={{
                    p: 2,
                    height: '100%',
                    minHeight: 'calc(100vh - 180px)',
                    bgcolor: alpha(theme.palette.background.default, 0.5),
                    border: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <Box sx={{ p: 0.8, borderRadius: 1, bgcolor: alpha(color, 0.1), color: color }}>
                        <Icon size={18} />
                    </Box>
                    <Typography variant="h6" fontWeight={700}>
                        {title}
                    </Typography>
                    <Chip
                        label={incidents.filter(i => i.status === status).length}
                        size="small"
                        sx={{ ml: 'auto', fontWeight: 700 }}
                    />
                </Box>

                {incidents
                    .filter(i => i.status === status)
                    .map(incident => (
                        <IncidentCard key={incident.id} incident={incident} />
                    ))}
            </Paper>
        </Grid>
    );

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                        Incident Response
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage and track security incidents.
                    </Typography>
                </Box>
                <Button variant="contained" startIcon={<Plus size={20} />}>
                    New Incident
                </Button>
            </Box>

            <Grid container spacing={3}>
                <KanbanColumn
                    title="Open"
                    status="open"
                    icon={AlertCircle}
                    color={theme.palette.error.main}
                />
                <KanbanColumn
                    title="In Progress"
                    status="in_progress"
                    icon={Activity}
                    color={theme.palette.warning.main}
                />
                <KanbanColumn
                    title="Resolved"
                    status="resolved"
                    icon={CheckCircle}
                    color={theme.palette.success.main}
                />
            </Grid>

            {/* Context Menu for Moving Cards */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => handleStatusChange('open')}>Move to Open</MenuItem>
                <MenuItem onClick={() => handleStatusChange('in_progress')}>Move to In Progress</MenuItem>
                <MenuItem onClick={() => handleStatusChange('resolved')}>Move to Resolved</MenuItem>
            </Menu>
        </Box>
    );
};

export default Incidents;
