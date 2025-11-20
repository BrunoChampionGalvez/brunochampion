'use client';

import React from 'react';
import { Button } from '../ui/Button';

interface Technology {
    id: string;
    name: string;
}

interface SidebarProps {
    technologies: Technology[];
    selectedTechIds: string[];
    onToggleTech: (id: string) => void;
    isOpen: boolean;
    onClose: () => void;
    onLogout: () => void;
}

export default function Sidebar({ technologies, selectedTechIds, onToggleTech, isOpen, onClose, onLogout }: SidebarProps) {
    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
            >
                <div className="p-4 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-primary">Tech Stack</h2>
                        <button onClick={onClose} className="md:hidden text-muted-foreground">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2">
                        <div className="mb-4">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Select Context</p>
                            <Button
                                variant={selectedTechIds.length === 0 ? 'primary' : 'outline'}
                                className="w-full justify-start"
                                onClick={() => selectedTechIds.length > 0 && selectedTechIds.forEach(id => onToggleTech(id))} // Clear all to select "All" effectively
                            >
                                All Technologies
                            </Button>
                        </div>

                        <div className="space-y-1">
                            {technologies.map((tech) => (
                                <button
                                    key={tech.id}
                                    onClick={() => onToggleTech(tech.id)}
                                    className={`
                    w-full flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${selectedTechIds.includes(tech.id)
                                            ? 'bg-primary/20 text-primary border border-primary/50'
                                            : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}
                  `}
                                >
                                    <span className={`w-2 h-2 rounded-full mr-2 ${selectedTechIds.includes(tech.id) ? 'bg-primary' : 'bg-muted-foreground'}`} />
                                    {tech.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-border">
                        <p className="text-xs text-center text-muted-foreground mb-2">
                            Softbook AI
                        </p>
                        <Button variant="ghost" className="w-full text-red-400 hover:text-red-300 hover:bg-red-900/20 justify-start px-3" onClick={onLogout}>
                            Logout
                        </Button>
                    </div>
                </div>
            </aside>
        </>
    );
}
