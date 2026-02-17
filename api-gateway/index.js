const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { createProxyMiddleware } = require('http-proxy-middleware');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(helmet());
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'healthy', service: 'api-gateway' });
});

// Auth Middleware (Placeholder for now)
const authenticateToken = (req, res, next) => {
    // Skip auth for login/register
    if (req.path.startsWith('/api/auth/login') || req.path.startsWith('/api/auth/register')) {
        return next();
    }

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next(); // Pass to next middleware/proxy
    });
};

// Routes

// Auth Routes (Proxy to Auth Service)
app.use('/api/auth', createProxyMiddleware({
    target: 'http://auth-service:8001',
    changeOrigin: true,
    pathRewrite: {
        '^/api/auth': '', // Strip /api/auth prefix when forwarding
    }
}));

// Inventory Routes (Protected)
app.use('/api/inventory', authenticateToken, createProxyMiddleware({
    target: 'http://inventory-service:8002',
    changeOrigin: true
}));

// SOC Routes (Protected)
app.use('/api/soc', authenticateToken, createProxyMiddleware({
    target: 'http://soc-service:8003',
    changeOrigin: true
}));

// AI Routes (Protected)
app.use('/api/ai', createProxyMiddleware({
    target: 'http://ai-service:8004',
    changeOrigin: true
}));

// Reports Routes (Protected)
app.use('/api/reports', authenticateToken, createProxyMiddleware({
    target: 'http://reports-service:8005',
    changeOrigin: true
}));

app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});
