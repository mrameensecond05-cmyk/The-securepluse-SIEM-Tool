import React, { ReactNode } from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import { MoreHorizontal } from 'lucide-react';

interface ChartCardProps {
    title: string;
    children: ReactNode;
    action?: ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, children, action }) => {
    return (
        <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {title}
                </Typography>
                {action || (
                    <Button sx={{ minWidth: 0, p: 1, color: 'text.secondary' }}>
                        <MoreHorizontal size={20} />
                    </Button>
                )}
            </Box>
            <Box sx={{ flexGrow: 1, minHeight: 0 }}>
                {children}
            </Box>
        </Paper>
    );
};

export default ChartCard;
