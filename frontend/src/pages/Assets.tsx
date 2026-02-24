import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Button } from '@mui/material';
import { Plus, Filter, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AssetCard, { type Asset } from '../components/AssetCard';
import client from '../api/client';

const Assets: React.FC = () => {
    const navigate = useNavigate();
    const [assets, setAssets] = useState<Asset[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAssets = async () => {
            try {
                const response = await client.get('/soc/agents');
                // Map Wazuh format to our Asset type if needed
                const items = response.data.data.affected_items.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    ip: item.ip,
                    type: item.os.name.toLowerCase().includes('windows') ? 'workstation' : 'server',
                    os: item.os.name.toLowerCase().includes('windows') ? 'windows' : 'linux',
                    status: item.status === 'active' ? 'online' : 'offline',
                    lastSeen: item.lastKeepAlive || 'Unknown'
                }));
                setAssets(items);
            } catch (error) {
                console.error("Error fetching agents:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAssets();
    }, []);

    const handleViewLogs = (id: string) => {
        const asset = assets.find(a => a.id === id);
        if (asset) {
            navigate('/logs', { state: { filter: asset.name } });
        }
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

            {loading ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 10 }}>
                    <Loader2 className="animate-spin" size={48} color="#6366f1" />
                    <Typography sx={{ mt: 2 }} color="text.secondary">Fetching live assets from Wazuh...</Typography>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {assets.map((asset) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={asset.id}>
                            <AssetCard asset={asset} onViewLogs={handleViewLogs} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default Assets;
