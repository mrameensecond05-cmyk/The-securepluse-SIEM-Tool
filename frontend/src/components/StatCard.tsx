import React from 'react';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, color }) => {
    const theme = useTheme();
    const iconColor = color || theme.palette.primary.main;

    return (
        <Paper
            sx={{
                p: 3,
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '100px',
                    height: '100%',
                    background: `linear-gradient(90deg, transparent 0%, ${theme.palette.background.paper} 100%)`,
                    zIndex: 0
                }
            }}
        >
            <Box sx={{ zIndex: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
                    {title}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {value}
                </Typography>
                {trend && (
                    <Typography
                        variant="caption"
                        sx={{
                            color: trend.isPositive ? 'success.main' : 'error.main',
                            display: 'flex',
                            alignItems: 'center',
                            fontWeight: 600,
                            bgcolor: trend.isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            py: 0.5,
                            px: 1,
                            borderRadius: 1,
                            width: 'fit-content'
                        }}
                    >
                        {trend.isPositive ? '+' : ''}{trend.value}%
                    </Typography>
                )}
            </Box>
            <Box
                sx={{
                    p: 1.5,
                    borderRadius: 3,
                    bgcolor: `${iconColor}20`, // 20 hex opacity
                    color: iconColor,
                    zIndex: 1
                }}
            >
                <Icon size={24} />
            </Box>
        </Paper>
    );
};

export default StatCard;
