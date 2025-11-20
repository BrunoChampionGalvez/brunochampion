'use client';

import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    references?: Array<{
        id: string;
        chunk: string;
        source: string;
        position: number;
    }>;
}

interface ChatAreaProps {
    messages: Message[];
    onSendMessage: (message: string) => void;
    isLoading: boolean;
    onOpenSidebar: () => void;
}

export default function ChatArea({ messages, onSendMessage, isLoading, onOpenSidebar }: ChatAreaProps) {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
        onSendMessage(input);
        setInput('');
    };

    return (
        <div className="flex-1 flex flex-col h-screen bg-background relative">
            {/* Header */}
            <header className="h-16 border-b border-border flex items-center px-4 justify-between md:justify-end bg-background/80 backdrop-blur-sm sticky top-0 z-10">
                <button onClick={onOpenSidebar} className="md:hidden text-foreground p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                </button>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-sm font-medium text-muted-foreground">AI Online</span>
                </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                        </div>
                        <h3 className="text-xl font-semibold">Start a conversation</h3>
                        <p className="max-w-md text-muted-foreground">Select technologies from the sidebar and ask questions to get AI-powered answers based on documentation.</p>
                    </div>
                ) : (
                    messages.map((msg, idx) => {
                        console.log(`[ChatArea] Rendering message ${idx}:`, { role: msg.role, content: msg.content, contentLength: msg.content.length });
                        return (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className={`
                  max-w-[85%] md:max-w-[70%] rounded-2xl px-6 py-4 shadow-sm
                  ${msg.role === 'user'
                                            ? 'bg-primary text-primary-foreground rounded-br-none'
                                            : 'bg-card border border-border text-card-foreground rounded-bl-none'}
                `}
                                >
                                    <div className="prose prose-invert text-sm md:text-base max-w-none">
                                        {msg.role === 'assistant' && msg.content.trim() === '' ? (
                                            <div className="flex space-x-1 h-6 items-center">
                                                <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                                <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                                <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                                            </div>
                                        ) : (
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                components={{
                                                    h1: ({ node, className, ...props }) => (
                                                        <h1
                                                            {...props}
                                                            className={`text-2xl md:text-3xl font-semibold mb-4 tracking-tight ${className ?? ''}`.trim()}
                                                        />
                                                    ),
                                                    h2: ({ node, className, ...props }) => (
                                                        <h2
                                                            {...props}
                                                            className={`text-xl md:text-2xl font-semibold mt-4 mb-2 ${className ?? ''}`.trim()}
                                                        />
                                                    ),
                                                    h3: ({ node, className, ...props }) => (
                                                        <h3
                                                            {...props}
                                                            className={`text-lg md:text-xl font-semibold mt-3 mb-1 ${className ?? ''}`.trim()}
                                                        />
                                                    ),
                                                    a: ({ node, children, className, ...props }) => (
                                                        <a
                                                            {...props}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            onClick={(e) => e.stopPropagation()}
                                                            className={`text-blue-400 hover:underline font-medium inline-flex items-center gap-0.5 ${className ?? ''}`.trim()}
                                                        >
                                                            {children}
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                                                        </a>
                                                    ),
                                                    ul: ({ node, className, ...props }) => (
                                                        <ul {...props} className={`list-disc pl-5 space-y-1 ${className ?? ''}`.trim()} />
                                                    ),
                                                    ol: ({ node, className, ...props }) => (
                                                        <ol {...props} className={`list-decimal pl-5 space-y-1 ${className ?? ''}`.trim()} />
                                                    ),
                                                    li: ({ node, className, ...props }) => (
                                                        <li {...props} className={`leading-relaxed ${className ?? ''}`.trim()} />
                                                    ),
                                                    p: ({ node, className, ...props }) => (
                                                        <p {...props} className={`whitespace-pre-wrap leading-relaxed ${className ?? ''}`.trim()} />
                                                    ),
                                                }}
                                            >
                                                {msg.content}
                                            </ReactMarkdown>
                                        )}
                                    </div>

                                    {/* References Tooltips */}
                                    {msg.references && msg.references.length > 0 && (
                                        <div className="mt-4 pt-3 border-t border-border/50">
                                            <p className="text-xs font-semibold text-muted-foreground mb-2">References:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {msg.references.map((ref, i) => (
                                                    <div key={i} className="group relative">
                                                        <span className="cursor-help inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-secondary hover:bg-secondary/80 transition-colors text-secondary-foreground border border-border">
                                                            {ref.source}
                                                        </span>
                                                        {/* Tooltip */}
                                                        <div className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-popover text-popover-foreground text-xs rounded-md shadow-lg border border-border opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                                            <p className="font-semibold mb-1">{ref.source}</p>
                                                            <p className="line-clamp-4 italic">"{ref.chunk}"</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative flex gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about the selected technologies..."
                        className="pr-12 py-6 text-base shadow-lg border-primary/20 focus-visible:ring-primary/50"
                        disabled={isLoading}
                    />
                    <Button
                        type="submit"
                        size="lg"
                        disabled={isLoading || !input.trim()}
                        className="absolute right-1 top-1 bottom-1 h-auto px-4 rounded-md"
                    >
                        {isLoading ? (
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                        )}
                    </Button>
                </form>
                <p className="text-center text-xs text-muted-foreground mt-2">
                    AI can make mistakes. Check references.
                </p>
            </div>
        </div>
    );
}
