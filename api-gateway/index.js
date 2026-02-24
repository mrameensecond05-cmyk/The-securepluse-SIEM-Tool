const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
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

// Generic proxy function using native http module
function proxyRequest(serviceName, servicePort, stripPrefix, req, res) {
    // Build the target path
    let targetPath = req.originalUrl;
    if (stripPrefix) {
        targetPath = targetPath.replace(stripPrefix, '') || '/';
    }

    const options = {
        hostname: serviceName,
        port: servicePort,
        path: targetPath,
        method: req.method,
        headers: {
            ...req.headers,
            host: `${serviceName}:${servicePort}`,
        },
        timeout: 10000,
    };

    const proxyReq = http.request(options, (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res, { end: true });
    });

    proxyReq.on('error', (err) => {
        console.error(`Proxy error to ${serviceName}:${servicePort}: ${err.message}`);
        if (!res.headersSent) {
            res.status(502).json({ detail: `Service ${serviceName} is unavailable` });
        }
    });

    proxyReq.on('timeout', () => {
        proxyReq.destroy();
        if (!res.headersSent) {
            res.status(504).json({ detail: `Service ${serviceName} timed out` });
        }
    });

    if (req.body && Object.keys(req.body).length > 0) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
    }

    proxyReq.end();
}

// Auth Routes (Proxy to Auth Service) - strip /api/auth prefix
app.use('/api/auth', (req, res) => {
    proxyRequest('auth-service', 8001, '/api/auth', req, res);
});

// Inventory Routes
app.use('/api/inventory', (req, res) => {
    proxyRequest('inventory-service', 8002, null, req, res);
});

// SOC Routes
app.use('/api/soc', (req, res) => {
    proxyRequest('soc-service', 8003, '/api/soc', req, res);
});

// AI Routes
app.use('/api/ai', (req, res) => {
    proxyRequest('ai-service', 8004, null, req, res);
});

// Reports Routes
app.use('/api/reports', (req, res) => {
    proxyRequest('reports-service', 8005, null, req, res);
});

app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});
