import React from 'react';
import { Box, Typography, Paper, Grid, Button, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { FileText, Download, Calendar, History } from 'lucide-react';

const Reports: React.FC = () => {
    const reportTemplates = [
        { id: 1, name: 'Weekly Security Summary', description: 'Overview of all security events and alerts from the past 7 days.' },
        { id: 2, name: 'Compliance Audit (PCI-DSS)', description: 'Detailed report mapped to PCI-DSS version 4.0 requirements.' },
        { id: 3, name: 'Unusual Login Activity', description: 'Analysis of potentially compromised user accounts based on login patterns.' },
        { id: 4, name: 'Asset Inventory & Vulnerability', description: 'Comprehensive list of all tracked assets and their risk levels.' },
    ];

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>Reports & Compliance</Typography>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>Available Templates</Typography>
                        <List>
                            {reportTemplates.map((template) => (
                                <ListItem key={template.id} divider>
                                    <ListItemIcon>
                                        <FileText size={24} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={template.name}
                                        secondary={template.description}
                                    />
                                    <Button variant="contained" size="small" startIcon={<Download size={16} />}>
                                        Generate
                                    </Button>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>Scheduled Reports</Typography>
                        <List>
                            <ListItem>
                                <ListItemIcon><Calendar size={20} /></ListItemIcon>
                                <ListItemText primary="Weekly Summary" secondary="Every Monday, 08:00" />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><Calendar size={20} /></ListItemIcon>
                                <ListItemText primary="PCI-DSS Audit" secondary="First day of month" />
                            </ListItem>
                        </List>
                    </Paper>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>Recent History</Typography>
                        <List dense>
                            <ListItem>
                                <ListItemIcon><History size={18} /></ListItemIcon>
                                <ListItemText primary="weekly_02-14.pdf" secondary="Generated 7 days ago" />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><History size={18} /></ListItemIcon>
                                <ListItemText primary="assets_vuln_02-20.pdf" secondary="Generated yesterday" />
                            </ListItem>
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Reports;
