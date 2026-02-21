-- Initial Admin User (Password: admin123)
-- analyst123: $2b$12$R9h/AIPZ9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z (fake hash same style)
INSERT INTO users (username, email, password_hash, role) VALUES 
('admin', 'admin@securepulse.local', '$2b$10$EpIxT98hP7/q.o7j6.e5.e7P5.e4.e3.e2.e1.e0.e9.e8.e7.e6', 'admin'),
('analyst', 'analyst@securepulse.local', '$2b$10$EpIxT98hP7/q.o7j6.e5.e7P5.e4.e3.e2.e1.e0.e9.e8.e7.e6', 'analyst'),
('jdoe', 'jdoe@securepulse.local', '$2b$10$EpIxT98hP7/q.o7j6.e5.e7P5.e4.e3.e2.e1.e0.e9.e8.e7.e6', 'user');

-- Sample Assets
INSERT INTO assets (name, ip_address, type, criticality, environment) VALUES 
('Web Server 01', '192.168.1.10', 'web-server', 'high', 'production'),
('Web Server 02', '192.168.1.11', 'web-server', 'high', 'production'),
('DB Server 01', '192.168.1.20', 'database', 'critical', 'production'),
('DB Server 02 (Secondary)', '192.168.1.21', 'database', 'high', 'production'),
('Dev Workstation 01', '192.168.1.105', 'workstation', 'low', 'dev'),
('Dev Workstation 02', '192.168.1.106', 'workstation', 'low', 'dev'),
('Core Switch 01', '192.168.1.1', 'network-device', 'critical', 'production'),
('Gateway Firewall', '192.168.1.254', 'network-device', 'critical', 'production'),
('Marketing VM', '172.16.0.15', 'vm', 'medium', 'staging');

-- Sample Alerts
INSERT INTO alerts (wazuh_alert_id, timestamp, level, description, agent_name, rule_id, rule_level) VALUES
('w-1001', NOW() - INTERVAL 5 MINUTE, 12, 'Brute force attack detected on SSH', 'Web Server 01', '5712', 12),
('w-1002', NOW() - INTERVAL 10 MINUTE, 7, 'Suspicious file created in /tmp', 'Dev Workstation 01', '550', 7),
('w-1003', NOW() - INTERVAL 1 HOUR, 15, 'Data exfiltration attempt to blacklisted IP', 'DB Server 01', '100200', 15);

-- Sample Incidents
INSERT INTO incidents (incident_number, title, description, priority, status, assigned_to, created_by) VALUES
('INC-2026-0001', 'Active Brute Force on Web Server', 'Multiple failed login attempts detected across several target accounts.', 'high', 'open', 2, 1),
('INC-2026-0002', 'Suspicious Data Movement', 'Massive outgoing traffic detected from sensitive database server.', 'critical', 'in_progress', 2, 2);
