import React from 'react';
import { Box, Typography, Grid, Button } from '@mui/material';
import { Plus, Filter } from 'lucide-react';
import AssetCard, { type Asset } from '../components/AssetCard';

const dummyAssets: Asset[] = [
    { id: '1', name: 'Web-Server-01', ip: '192.168.1.10', type: 'server', os: 'linux', status: 'online', lastSeen: 'Just now' },
    { id: '2', name: 'DB-Prod-01', ip: '192.168.1.20', type: 'server', os: 'linux', status: 'online', lastSeen: '2 mins ago' },
    { id: '3', name: 'Workstation-HR', ip: '192.168.2.15', type: 'workstation', os: 'windows', status: 'offline', lastSeen: '2 days ago' },
    { id: '4', name: 'Dev-Laptop-04', ip: '192.168.2.33', type: 'workstation', os: 'macos', status: 'online', lastSeen: '5 mins ago' },
    { id: '5', name: 'CEO-iPad', ip: '192.168.3.10', type: 'mobile', os: 'ios', status: 'warning', lastSeen: '1 hour ago' },
    { id: '6', name: 'Firewall-Main', ip: '192.168.0.1', type: 'server', os: 'linux', status: 'online', lastSeen: 'Just now' },
    { id: '7', name: 'Backup-Server', ip: '192.168.1.99', type: 'server', os: 'windows', status: 'offline', lastSeen: '5 hours ago' },
    { id: '8', name: 'Guest-Reception', ip: '192.168.4.12', type: 'workstation', os: 'windows', status: 'online', lastSeen: '10 mins ago' },
];

const Assets: React.FC = () => {
    const handleViewLogs = (id: string) => {
        console.log(`View logs for asset ${id}`);
        // Navigate or show modal
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                        Asset Management
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Monitor connected assets and their real-time status.
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button variant="outlined" startIcon={<Filter size={20} />}>
                        Filter
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<Plus size={18} />}
                        onClick={() => window.open('https://documentation.wazuh.com/current/installation-guide/wazuh-agent/wazuh-agent-package-windows.html', '_blank')}
                    >
                        Add Asset
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={3}>
                {dummyAssets.map((asset) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={asset.id}>
                        <AssetCard asset={asset} onViewLogs={handleViewLogs} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default Assets;
