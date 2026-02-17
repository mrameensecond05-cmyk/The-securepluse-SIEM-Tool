import React, { useState, useRef, useEffect } from 'react';
import {
    Box, Paper, Typography, TextField, IconButton, Avatar,
    useTheme, alpha, CircularProgress, Tooltip, Zoom
} from '@mui/material';
import { Send, Bot, User, Sparkles, RefreshCw, Trash2, StopCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

const AIChat: React.FC = () => {
    const theme = useTheme();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Hello! I'm your AI Security Analyst. I can help you analyze logs, explain alerts, or suggest remediation steps. How can I assist you today?",
            sender: 'ai',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: input,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsTyping(true);

        try {
            // Call the API Gateway (proxied to ai-service)
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [{ role: "user", content: currentInput }],
                    model: "phi3", // Using installed phi3 model
                    stream: false
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server Error: ${response.status} ${errorText}`);
            }

            const data = await response.json();

            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                text: data.content || "No response from AI.",
                sender: 'ai',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiResponse]);

        } catch (error) {
            console.error("AI Chat Error:", error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: "⚠️ Connection Error: Ensure Backend (port 5000) and Ollama are running.",
                sender: 'ai',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleClearChat = () => {
        setMessages([]);
    };

    return (
        <Box sx={{
            height: 'calc(100vh - 100px)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2
        }}>
            {/* Header Area */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 2,
                borderRadius: 3,
                bgcolor: alpha(theme.palette.background.paper, 0.4),
                backdropFilter: 'blur(10px)',
                border: '1px solid',
                borderColor: alpha(theme.palette.primary.main, 0.1)
            }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{
                            p: 1,
                            borderRadius: '12px',
                            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`
                        }}>
                            <Sparkles size={20} color="#fff" />
                        </Box>
                        AI Security Analyst
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 6 }}>
                        Powered by Ollama • <Box component="span" sx={{ color: 'success.main', fontWeight: 600 }}>● Online</Box>
                    </Typography>
                </Box>

                <Tooltip title="Clear Conversation">
                    <IconButton onClick={handleClearChat} size="small" sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}>
                        <Trash2 size={18} />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Chat Area */}
            <Paper
                elevation={0}
                sx={{
                    flexGrow: 1,
                    p: 3,
                    overflowY: 'auto',
                    bgcolor: alpha(theme.palette.background.paper, 0.2),
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(100,100,255,0.03) 0%, transparent 50%)'
                }}
            >
                <AnimatePresence>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            style={{
                                display: 'flex',
                                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                width: '100%'
                            }}
                        >
                            <Box sx={{
                                display: 'flex',
                                gap: 2,
                                maxWidth: '80%',
                                flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row'
                            }}>
                                <Avatar sx={{
                                    bgcolor: msg.sender === 'user' ? 'secondary.main' : 'primary.main',
                                    width: 36,
                                    height: 36,
                                    boxShadow: 2
                                }}>
                                    {msg.sender === 'user' ? <User size={20} /> : <Bot size={20} />}
                                </Avatar>

                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 2,
                                        borderRadius: 3,
                                        borderTopLeftRadius: msg.sender === 'ai' ? 0 : 20,
                                        borderTopRightRadius: msg.sender === 'user' ? 0 : 20,
                                        bgcolor: msg.sender === 'user'
                                            ? alpha(theme.palette.primary.main, 0.9)
                                            : alpha(theme.palette.background.paper, 0.8),
                                        color: msg.sender === 'user' ? 'common.white' : 'text.primary',
                                        boxShadow: msg.sender === 'user'
                                            ? `0 4px 15px ${alpha(theme.palette.primary.main, 0.3)}`
                                            : '0 2px 10px rgba(0,0,0,0.05)',
                                        border: '1px solid',
                                        borderColor: msg.sender === 'user' ? 'transparent' : alpha(theme.palette.divider, 0.1)
                                    }}
                                >
                                    <Typography variant="body1" sx={{ lineHeight: 1.6 }}>{msg.text}</Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            display: 'block',
                                            mt: 1,
                                            opacity: 0.7,
                                            textAlign: msg.sender === 'user' ? 'right' : 'left',
                                            fontSize: '0.7rem'
                                        }}
                                    >
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </Typography>
                                </Paper>
                            </Box>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', ml: 1 }}>
                            <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
                                <Bot size={20} />
                            </Avatar>
                            <Box sx={{
                                p: 2,
                                bgcolor: alpha(theme.palette.background.paper, 0.8),
                                borderRadius: 3,
                                borderTopLeftRadius: 0,
                                display: 'flex',
                                gap: 1
                            }}>
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ repeat: Infinity, duration: 1 }}
                                    style={{ width: 6, height: 6, background: theme.palette.text.secondary, borderRadius: '50%' }}
                                />
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                                    style={{ width: 6, height: 6, background: theme.palette.text.secondary, borderRadius: '50%' }}
                                />
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                                    style={{ width: 6, height: 6, background: theme.palette.text.secondary, borderRadius: '50%' }}
                                />
                            </Box>
                        </Box>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </Paper>

            {/* Input Area */}
            <Box sx={{
                position: 'relative'
            }}>
                <TextField
                    fullWidth
                    multiline
                    maxRows={4}
                    placeholder="Ask about a security alert, IP address, or remediation..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            bgcolor: alpha(theme.palette.background.paper, 0.6),
                            backdropFilter: 'blur(10px)',
                            borderRadius: 3,
                            pr: 8, // Space for send button
                            '& fieldset': {
                                borderColor: alpha(theme.palette.divider, 0.2),
                                transition: 'all 0.2s'
                            },
                            '&:hover fieldset': {
                                borderColor: theme.palette.primary.main
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: theme.palette.primary.main,
                                borderWidth: 2,
                                boxShadow: `0 0 15px ${alpha(theme.palette.primary.main, 0.15)}`
                            }
                        }
                    }}
                />
                <Box sx={{ position: 'absolute', right: 8, bottom: 8, display: 'flex', gap: 1 }}>
                    <Zoom in={isTyping}>
                        <IconButton
                            onClick={() => setIsTyping(false)} // Mock stop
                            size="small"
                            sx={{ bgcolor: alpha(theme.palette.error.main, 0.1), color: 'error.main' }}
                        >
                            <StopCircle size={20} />
                        </IconButton>
                    </Zoom>
                    <IconButton
                        color="primary"
                        onClick={handleSend}
                        disabled={!input.trim() || isTyping}
                        sx={{
                            bgcolor: input.trim() ? 'primary.main' : alpha(theme.palette.action.disabledBackground, 0.5),
                            color: 'common.white',
                            '&:hover': {
                                bgcolor: 'primary.dark',
                                transform: 'scale(1.05)'
                            },
                            transition: 'all 0.2s',
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            boxShadow: input.trim() ? `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}` : 'none'
                        }}
                    >
                        <Send size={20} />
                    </IconButton>
                </Box>
            </Box>
        </Box>
    );
};

export default AIChat;
