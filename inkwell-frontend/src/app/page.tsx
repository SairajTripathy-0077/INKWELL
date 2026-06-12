'use client';

import { useState, useEffect } from 'react';
import PowerButton from '@/components/PowerButton';
import LoginModal from '@/components/LoginModal';
import Dashboard from '@/components/Dashboard';
import CrtStatic from '@/components/CrtStatic';

export default function Home() {
  const [appState, setAppState] = useState<'POWER_OFF' | 'TURNING_ON' | 'BOOTING' | 'LOGIN' | 'DASHBOARD' | 'TURNING_OFF'>('POWER_OFF');
  const [token, setToken] = useState<string | null>(null);

  const bootTV = () => {
    setAppState('TURNING_ON');
    setTimeout(() => {
      setAppState('BOOTING');
    }, 1200);
  };

  useEffect(() => {
    if (appState === 'BOOTING') {
      const timer = setTimeout(() => {
        setAppState('LOGIN');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [appState]);

  const handleLoginSuccess = (jwttoken: string) => {
    setToken(jwttoken);
    setAppState('DASHBOARD');
  };

  const handleLogout = () => {
    setAppState('TURNING_OFF');
    setTimeout(() => {
      setAppState('POWER_OFF');
      setToken(null);
    }, 800);
  };

  // Decide screen contents
  const renderScreenContent = () => {
    switch (appState) {
      case 'TURNING_ON':
        return null;
      case 'BOOTING':
        return (
          <div className="text-green-500 text-2xl tracking-widest uppercase animate-pulse select-none font-mono">
            BOOTING INKWELL OS...
          </div>
        );
      case 'LOGIN':
        return <LoginModal onLoginSuccess={handleLoginSuccess} />;
      case 'DASHBOARD':
        return token ? <Dashboard token={token} onLogout={handleLogout} /> : null;
      case 'TURNING_OFF':
        return null;
      default:
        return null;
    }
  };

  const screenAnimationClass = 
    appState === 'TURNING_ON' ? 'power-on' :
    appState === 'TURNING_OFF' ? 'power-off' :
    appState === 'POWER_OFF' ? '' :
    'power-on';

  return (
    <main className="flex min-h-screen flex-col items-center justify-center w-full h-full p-4 bg-[#050505]">
      {appState === 'POWER_OFF' ? (
        <PowerButton onPowerOn={bootTV} />
      ) : (
        <div className="relative w-full max-w-6xl h-[80vh] bg-black border-[10px] border-zinc-900 rounded-2xl shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center overflow-hidden">
          
          {/* Glass reflection and static/scanline filters */}
          <div className="screen-glass-overlay" />
          <div className="scanlines" />
          <div className="scanlines-scrolling" />
          
          {/* Animated Screen Content Container */}
          <div className={`tv-screen-content crt-flicker-effect w-full h-full flex flex-col justify-center items-center ${screenAnimationClass}`}>
            <div className="w-full h-full p-6 relative flex flex-col justify-center items-center">
              {renderScreenContent()}
            </div>
          </div>

          {/* CRT Static Noise Overlay (fades out during BOOTING) */}
          {(appState === 'TURNING_ON' || appState === 'BOOTING') && (
            <CrtStatic 
              className={appState === 'BOOTING' ? 'transition-opacity duration-1000 opacity-0' : 'opacity-100'} 
            />
          )}
        </div>
      )}
    </main>
  );
}
