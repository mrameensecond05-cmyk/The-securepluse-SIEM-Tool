import React from 'react';
import { Box, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, alpha } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShieldAlert, Server, Activity, LogOut, Bot, Shield, FileSearch, Bug, Globe, FileBarChart, Users } from 'lucide-react';

const drawerWidth = 240;

const MainLayout: React.FC = () => {
    const navigate = useNavigate();

    const menuItems = [
        { text: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
        { text: 'Assets', icon: <Server size={20} />, path: '/assets' },
        { text: 'Alerts', icon: <ShieldAlert size={20} />, path: '/alerts' },
        { text: 'Incidents', icon: <Activity size={20} />, path: '/incidents' },
        { text: 'Logs', icon: <FileSearch size={20} />, path: '/logs' },
        { text: 'Vulnerabilities', icon: <Bug size={20} />, path: '/vulnerabilities' },
        { text: 'Threat Intel', icon: <Globe size={20} />, path: '/threat-intel' },
        { text: 'Reports', icon: <FileBarChart size={20} />, path: '/reports' },
        { text: 'UEBA', icon: <Users size={20} />, path: '/ueba' },
        { text: 'AI Analyst', icon: <Bot size={20} />, path: '/ai' },
    ];

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{
                            p: 0.8,
                            borderRadius: 1.5,
                            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.15),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Shield size={22} />
                        </Box>
                        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700, letterSpacing: '-0.02em', fontSize: '1.2rem' }}>
                            Secure<Box component="span" sx={{ color: 'primary.main' }}>Pulse</Box>
                        </Typography>
                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        {menuItems.map((item) => (
                            <ListItem key={item.text} disablePadding>
                                <ListItemButton onClick={() => navigate(item.path)}>
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => navigate('/login')}>
                                <ListItemIcon><LogOut size={20} /></ListItemIcon>
                                <ListItemText primary="Logout" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
};

export default MainLayout;
