'use client';
import type { ManufacturerMarkdownContent } from 'lib/shopify';
import { useState } from 'react';

interface ChatInterfaceProps {
    manufacturer: ManufacturerMarkdownContent;
}

export function ChatInterface({ manufacturer }: ChatInterfaceProps) {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<
        Array<{ text: string; sender: 'user' | 'agent'; timestamp: Date }>
    >([
        {
            text: `Hello! Welcome to ${manufacturer.frontmatter.title}. I'm here to help you with any questions about our products and services. How can I assist you today?`,
            sender: 'agent',
            timestamp: new Date(),
        },
    ]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        // Add user message
        const userMessage = {
            text: message,
            sender: 'user' as const,
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMessage]);

        // Simulate agent response (in a real app, this would be an API call)
        setTimeout(() => {
            const agentMessage = {
                text: `Thank you for your message about "${message}". Our team at ${manufacturer.frontmatter.title} will get back to you shortly with a detailed response.`,
                sender: 'agent' as const,
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, agentMessage]);
        }, 1000);

        setMessage('');
    };

    return (
        <div className="flex h-[600px] flex-col rounded-lg border border-gray-700 bg-gray-800/50 shadow-2xl backdrop-blur-sm">
            {/* Chat Messages */}
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-xs rounded-lg px-4 py-2 ${
                                msg.sender === 'user'
                                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                                    : 'border border-gray-600 bg-gray-700/80 text-gray-100'
                            }`}
                        >
                            <p className="text-sm">{msg.text}</p>
                            <p className="mt-1 text-xs opacity-60">
                                {msg.timestamp.toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Chat Input */}
            <div className="border-t border-gray-700 p-4">
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        type="text"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 rounded-lg border border-gray-600 bg-gray-700/50 px-3 py-2 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                    <button
                        type="submit"
                        disabled={!message.trim()}
                        className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-blue-800 disabled:cursor-not-allowed disabled:from-gray-600 disabled:to-gray-700"
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}
