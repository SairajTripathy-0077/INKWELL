 'use client';
 import {useState, useEffect} from 'react';
 import PowerButton from '@/components/PowerButton';
 import LoginModal from '@/components/LoginModal';
 import Dashboard from '@/components/Dashboard';

 export default function Home() {
  const [appState, setAppState] = useState<'POWER_OFF' | 'BOOTING' | 'LOGIN' | 'DASHBOARD'>('POWER_OFF');
  const [token,setToken] = useState<string | null>(null);
  const bootTV = () => {
    setAppState('BOOTING');
    setTimeout(() => {
      setAppState('LOGIN');
    }, 3000);
  }
  const handleLoginSuccess = (jwttoken: string) => {
    setToken(jwttoken);
    setAppState('DASHBOARD');
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-center w-full h-full">
      {appState === "POWER_OFF" && (
        <PowerButton onPowerOn={bootTV} />
      )}
      {appState !== "POWER_OFF" && (
        <div className="relative w-full h-full max-w-6xl h-[80vh] bg-blue-900 border-[10px] border-zinc-900 rounded-2xl shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center">
          <div className="scanlines"></div>
          {appState === "BOOTING" && (
            <div className="text-green-500 text-2xl tracking-widest uppercase animate-pulse">
              BOOTING INKWELL OS...
            </div>
          )}
          {appState === "LOGIN" && (
            <LoginModal onLoginSuccess={handleLoginSuccess} />
          )}
          {appState === "DASHBOARD" && token && (
            <Dashboard token={token} />
          )}
        </div>
      )}
    </main>
  );
}
