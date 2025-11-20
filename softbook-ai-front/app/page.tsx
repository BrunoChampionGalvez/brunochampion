'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user, isLoading, logout } = useAuth();
  const [shadowStyle, setShadowStyle] = useState<React.CSSProperties>({});
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!titleRef.current) return;

      const rect = titleRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const mouseX = e.clientX;
      const mouseY = e.clientY;

      const distX = mouseX - centerX;
      const distY = mouseY - centerY;
      const distance = Math.sqrt(distX * distX + distY * distY);

      // Only apply effect if cursor is "near" (e.g., within 500px)
      if (distance < 500) {
        // Calculate shadow offset (limit it to avoid extreme values)
        // Factor controls how much the shadow moves. 
        // If cursor is to right (positive distX), shadow goes right (positive offsetX)
        const factor = 0.05;
        const offsetX = distX * factor;
        const offsetY = distY * factor;
        const blur = 20 + (distance / 20); // Blur increases with distance? Or decreases? Let's keep it dynamic.

        // Opacity decreases with distance
        const opacity = Math.max(0, 1 - distance / 500);

        setShadowStyle({
          textShadow: `${offsetX}px ${offsetY}px ${blur}px rgba(6, 182, 212, ${opacity * 0.8})`,
          transition: 'text-shadow 0.1s ease-out'
        });
      } else {
        setShadowStyle({
          textShadow: '0 0 30px rgba(6, 182, 212, 0)', // Fade out
          transition: 'text-shadow 0.5s ease-out'
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center space-y-8 relative">

      {/* Logout Button for Landing Page */}
      {!isLoading && user && (
        <div className="absolute top-4 right-4">
          <Button variant="ghost" onClick={logout} className="text-muted-foreground hover:text-red-400">
            Logout
          </Button>
        </div>
      )}

      {/* Re-implementing with drop-shadow filter for better compatibility with gradient text */}
      <ShadowTitle user={user} isLoading={isLoading} logout={logout} />

      <div className="flex flex-col sm:flex-row gap-4 z-10">
        {!isLoading && (
          <>
            {!user ? (
              <Link href="/login">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-shadow">
                  Login to Start
                </Button>
              </Link>
            ) : (
              <>
                {user.role === 'user' && (
                  <Link href="/chat">
                    <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-shadow">
                      Start Chatting
                    </Button>
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link href="/admin">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-6 shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-shadow">
                      Admin Dashboard
                    </Button>
                  </Link>
                )}
              </>
            )}
          </>
        )}
      </div>

      <div className="absolute bottom-8 text-sm text-muted-foreground">
        <p>Powered by NestJS, Next.js, and LangChain.js</p>
      </div>
    </div>
  );
}

function ShadowTitle({ user, isLoading, logout }: any) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const padding = 60; // Padding to prevent clipping

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="space-y-4 relative z-10">
      <div className="relative inline-block" ref={containerRef}>

        {/* Spotlight Glow Layer (Back - Low Z-Index, Padded to avoid clipping) */}
        <h1
          className="absolute top-1/2 left-1/2 w-auto h-auto text-6xl font-extrabold tracking-tighter text-cyan-400 blur-md select-none pointer-events-none whitespace-nowrap"
          style={{
            transform: 'translate(-50%, -50%)',
            padding: `${padding}px`,
            maskImage: `radial-gradient(circle 120px at ${mousePos.x + padding}px ${mousePos.y + padding}px, black, transparent)`,
            WebkitMaskImage: `radial-gradient(circle 120px at ${mousePos.x + padding}px ${mousePos.y + padding}px, black, transparent)`,
            zIndex: 10,
            filter: 'brightness(1.5) drop-shadow(0 0 20px rgba(34, 211, 238, 0.8))',
          }}
          aria-hidden="true"
        >
          Softbook AI
        </h1>
        {/* Sharp Text Layer (Front - High Z-Index) */}
        <h1
          className="relative text-6xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-primary z-30"
        >
          Softbook AI
        </h1>
      </div>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
        Your intelligent assistant for software documentation. Select technologies, ask questions, and get accurate answers with references.
      </p>
    </div>
  );
}
