import React from 'react';
import { Box, Paper, Typography, Button, Chip, useTheme, alpha } from '@mui/material';
import { Monitor, Server, Smartphone, Circle, Activity } from 'lucide-react';

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
            case 'server': return <Server size={24} />;
            case 'mobile': return <Smartphone size={24} />;
            default: return <Monitor size={24} />;
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

    return (
        <Paper
            sx={{
                p: 3,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.2s',
                '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.1)}`,
                    transform: 'translateY(-2px)'
                }
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box
                    sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main
                    }}
                >
                    {getIcon()}
                </Box>
                <Chip
                    label={asset.status.toUpperCase()}
                    size="small"
                    sx={{
                        bgcolor: alpha(getStatusColor(), 0.1),
                        color: getStatusColor(),
                        fontWeight: 700,
                        border: '1px solid',
                        borderColor: alpha(getStatusColor(), 0.2)
                    }}
                />
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                {asset.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontFamily: 'monospace' }}>
                {asset.ip}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Circle size={8} fill={getStatusColor()} color={getStatusColor()} />
                <Typography variant="caption" color="text.secondary">
                    Last seen: {asset.lastSeen}
                </Typography>
            </Box>

            <Button
                variant="outlined"
                fullWidth
                startIcon={<Activity size={16} />}
                onClick={() => onViewLogs(asset.id)}
                sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600
                }}
            >
                View Logs
            </Button>
        </Paper>
    );
};

export default AssetCard;
