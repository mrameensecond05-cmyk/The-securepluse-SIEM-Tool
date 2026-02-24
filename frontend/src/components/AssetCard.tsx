import React from 'react';
import { Box, Paper, Typography, Button, Chip, useTheme, alpha, Stack } from '@mui/material';
import { Monitor, Server, Smartphone, Circle, Activity, Shield, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export interface Asset {
    id: string;
    name: string;
    ip: string;
    type: 'server' | 'workstation' | 'mobile';
    os: 'windows' | 'linux' | 'macos' | 'ios' | 'android';
    status: 'online' | 'offline' | 'warning';
    lastSeen: string;
}

interface AssetCardProps {
    asset: Asset;
    onViewLogs: (id: string) => void;
}

const AssetCard: React.FC<AssetCardProps> = ({ asset, onViewLogs }) => {
    const theme = useTheme();

    const getIcon = () => {
        switch (asset.type) {
            case 'server': return <Server size={22} />;
            case 'mobile': return <Smartphone size={22} />;
            default: return <Monitor size={22} />;
        }
    };

    const getStatusColor = () => {
        switch (asset.status) {
            case 'online': return theme.palette.success.main;
            case 'warning': return theme.palette.warning.main;
            case 'offline': return theme.palette.error.main;
            default: return theme.palette.text.disabled;
        }
    };

    // Format timestamp to be shorter and readable
    const formatLastSeen = (ts: string) => {
        if (!ts || ts === 'Unknown') return 'Never';
        try {
            const date = new Date(ts);
            if (isNaN(date.getTime())) return ts.substring(0, 16).replace('T', ' ');
            return date.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        } catch (e) {
            return ts;
        }
    };

    return (
        <Paper
            component={motion.div}
            whileHover={{ y: -5 }}
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                p: 2.5,
                borderRadius: 4,
                bgcolor: alpha(theme.palette.background.paper, 0.4),
                backdropFilter: 'blur(10px)',
                border: '1px solid',
                borderColor: alpha(theme.palette.divider, 0.1),
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                    boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.15)}`,
                    '& .asset-glow': {
                        opacity: 0.2
                    }
                }
            }}
        >
            {/* Background Glow Effect */}
            <Box
                className="asset-glow"
                sx={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    bgcolor: getStatusColor(),
                    filter: 'blur(40px)',
                    opacity: 0,
                    transition: 'opacity 0.3s'
                }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, zIndex: 1 }}>
                <Box
                    sx={{
                        p: 1.25,
                        borderRadius: 2.5,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        border: '1px solid',
                        borderColor: alpha(theme.palette.primary.main, 0.2)
                    }}
                >
                    {getIcon()}
                </Box>
                <Chip
                    icon={<Circle size={8} fill={getStatusColor()} style={{ marginLeft: 4 }} />}
                    label={asset.status.toUpperCase()}
                    size="small"
                    sx={{
                        fontSize: '0.65rem',
                        fontWeight: 900,
                        height: 22,
                        bgcolor: alpha(getStatusColor(), 0.1),
                        color: getStatusColor(),
                        border: '1px solid',
                        borderColor: alpha(getStatusColor(), 0.3),
                        '& .MuiChip-icon': { color: 'inherit' }
                    }}
                />
            </Box>

            <Box sx={{ flexGrow: 1, zIndex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: '-0.01em', wordBreak: 'break-word' }}>
                    {asset.name}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                    <Shield size={14} color={theme.palette.text.secondary} />
                    <Typography variant="body2" sx={{
                        color: 'text.secondary',
                        fontFamily: "'Fira Code', 'Courier New', monospace",
                        fontSize: '0.8rem',
                        opacity: 0.8
                    }}>
                        {asset.ip}
                    </Typography>
                </Stack>

                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                    <Clock size={12} color={theme.palette.text.disabled} />
                    <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600 }}>
                        LAST SEEN: {formatLastSeen(asset.lastSeen)}
                    </Typography>
                </Stack>
            </Box>

            <Button
                variant="contained"
                fullWidth
                startIcon={<Activity size={16} />}
                onClick={() => onViewLogs(asset.id)}
                sx={{
                    mt: 'auto',
                    borderRadius: 2.5,
                    textTransform: 'none',
                    fontWeight: 700,
                    py: 1,
                    background: alpha(theme.palette.primary.main, 1),
                    '&:hover': {
                        background: theme.palette.primary.dark,
                    },
                    zIndex: 1
                }}
            >
                View Logs
            </Button>
        </Paper>
    );
};

export default AssetCard;
