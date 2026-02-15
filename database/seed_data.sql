-- Initial Admin User (Password: admin123 - bcrypt hash to be generated in app logic usually, placing placeholder here)
-- Note: In a real scenario, we'd insert a valid bcrypt hash.
INSERT INTO users (username, email, password_hash, role) VALUES 
('admin', 'admin@securepulse.local', '$2b$10$EpIxT98hP7/q.o7j6.e5.e7P5.e4.e3.e2.e1.e0.e9.e8.e7.e6', 'admin');

-- Sample Assets
INSERT INTO assets (name, ip_address, type, criticality, environment) VALUES 
('Web Server 01', '192.168.1.10', 'web-server', 'high', 'production'),
('DB Server 01', '192.168.1.20', 'database', 'critical', 'production'),
('Dev Workstation', '192.168.1.105', 'workstation', 'low', 'dev');
