'use client';

import { useState, useEffect } from 'react';
import PowerButton from '@/components/PowerButton';
import LoginModal from '@/components/LoginModal';
import Dashboard from '@/components/Dashboard';
import CrtStatic from '@/components/CrtStatic';
import { api } from '@/lib/api';

export default function Home() {
  const [appState, setAppState] = useState<'POWER_OFF' | 'TURNING_ON' | 'BOOTING' | 'LOGIN' | 'DASHBOARD' | 'TURNING_OFF'>('POWER_OFF');
  const [token, setToken] = useState<string | null>(null);
  const [bootLogs, setBootLogs] = useState<string[]>([]);

  const bootTV = () => {
    setAppState('TURNING_ON');
    // Pre-populate initial boot diagnostic logs
    setBootLogs([
      "BOOTING INKWELL OS v1.0.4...",
      "CORE MEMORY: 640KB SYSTEM RAM OK",
      "ESTABLISHING DATABASE NETWORK LINK...",
      "WAITING FOR SYSTEM RESPONSE (COLD STARTING API)..."
    ]);
    setTimeout(() => {
      setAppState('BOOTING');
    }, 1200);
  };

  // Poll Backend health endpoint during the booting phase
  useEffect(() => {
    if (appState !== 'BOOTING') return;

    let active = true;
    let dotTimer: NodeJS.Timeout;
    let checkTimer: NodeJS.Timeout;

    const updateDots = () => {
      setBootLogs(prev => {
        const last = prev[prev.length - 1];
        if (last && last.startsWith("PINGING CLIENT HOST")) {
          // If the last log was a ping log, append another dot
          return [...prev.slice(0, -1), last + "."];
        } else {
          // Start a new ping line
          return [...prev, "PINGING CLIENT HOST."];
        }
      });
      dotTimer = setTimeout(updateDots, 1500);
    };

    const checkHealth = async () => {
      try {
        const res = await api.healthCheck();
        if (res && res.success && active) {
          clearTimeout(dotTimer);
          setBootLogs(prev => [
            ...prev,
            "SUCCESS: SYSTEM INTERFACE ONLINE!",
            "INITIALIZING RETRO USER SHELL..."
          ]);
          // Transition to the LOGIN screen after a brief delay for readability
          setTimeout(() => {
            if (active) setAppState('LOGIN');
          }, 1200);
        } else if (active) {
          checkTimer = setTimeout(checkHealth, 2000);
        }
      } catch (err) {
        if (active) {
          checkTimer = setTimeout(checkHealth, 2000);
        }
      }
    };

    updateDots();
    checkTimer = setTimeout(checkHealth, 1000);

    return () => {
      active = false;
      clearTimeout(dotTimer);
      clearTimeout(checkTimer);
    };
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
          <div className="text-green-500 font-mono text-left w-full h-full flex flex-col justify-start items-start p-4 md:p-8 gap-1 select-none overflow-y-auto leading-relaxed text-sm md:text-lg self-start">
            {bootLogs.map((log, index) => (
              <div key={index} className="tracking-widest uppercase">
                {log}
              </div>
            ))}
            <div className="w-2 h-4 bg-green-500 animate-pulse mt-1" />
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
            <div className="w-full h-full p-2 relative flex flex-col justify-center items-center">
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
