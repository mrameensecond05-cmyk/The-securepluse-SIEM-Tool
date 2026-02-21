import React from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, ListItemIcon, Divider, Chip } from '@mui/material';
import { Globe, Target, ExternalLink } from 'lucide-react';

const ThreatIntelligence: React.FC = () => {
    const feeds = [
        { id: 1, name: 'AlienVault OTX', status: 'Active', indicators: 1254, lastUpdate: '10 mins ago' },
        { id: 2, name: 'MISP Community', status: 'Active', indicators: 450, lastUpdate: '2 hours ago' },
        { id: 3, name: 'Abuse.ch URLHaus', status: 'Active', indicators: 89, lastUpdate: '45 mins ago' },
        { id: 4, name: 'ThreatCrowd', status: 'Inactive', indicators: 0, lastUpdate: '1 day ago' },
    ];

    const alerts = [
        { id: 1, type: 'IP Reputation', value: '185.220.101.34', level: 'High', tags: ['Tor Exit Node', 'Scanning'] },
        { id: 2, type: 'Domain', value: 'malware-drop-site.com', level: 'Critical', tags: ['Phishing', 'Malware'] },
        { id: 3, type: 'File Hash', value: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', level: 'High', tags: ['Ransomware'] },
    ];

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>Threat Intelligence</Typography>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Intelligence Feeds</Typography>
                <List>
                    {feeds.map((feed) => (
                        <ListItem key={feed.id} secondaryAction={
                            <Chip
                                label={feed.status}
                                size="small"
                                color={feed.status === 'Active' ? 'success' : 'default'}
                            />
                        }>
                            <ListItemIcon>
                                <Globe size={24} />
                            </ListItemIcon>
                            <ListItemText
                                primary={feed.name}
                                secondary={`${feed.indicators} indicators sync'd • Updated ${feed.lastUpdate}`}
                            />
                        </ListItem>
                    ))}
                </List>
            </Paper>

            <Typography variant="h6" sx={{ mb: 2 }}>High Priority IOCs</Typography>
            <Paper>
                <List>
                    {alerts.map((alert, index) => (
                        <React.Fragment key={alert.id}>
                            <ListItem alignItems="flex-start">
                                <ListItemIcon>
                                    <Target color={alert.level === 'Critical' ? '#ff1744' : '#ff9100'} size={24} />
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography variant="subtitle1" component="span" sx={{ fontWeight: 'bold' }}>
                                                {alert.value}
                                            </Typography>
                                            <Chip label={alert.level} size="small" color={alert.level === 'Critical' ? 'error' : 'warning'} />
                                        </Box>
                                    }
                                    secondary={
                                        <Box sx={{ mt: 1 }}>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                Type: {alert.type}
                                            </Typography>
                                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                {alert.tags.map(tag => (
                                                    <Chip key={tag} label={tag} size="small" variant="outlined" />
                                                ))}
                                            </Box>
                                        </Box>
                                    }
                                />
                                <ExternalLink size={16} style={{ cursor: 'pointer', opacity: 0.6 }} />
                            </ListItem>
                            {index < alerts.length - 1 && <Divider component="li" />}
                        </React.Fragment>
                    ))}
                </List>
            </Paper>
        </Box>
    );
};

export default ThreatIntelligence;
