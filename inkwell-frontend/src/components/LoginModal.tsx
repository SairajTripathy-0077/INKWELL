"use client";

import { useState } from "react";
import { api } from "@/lib/api";

interface LoginModalProps {
  onLoginSuccess: (token: string) => void;
}

export default function LoginModal({ onLoginSuccess }: LoginModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError(""); 
    try {
      const res = await api.login(username, password);
      
      if (res.success) {
        onLoginSuccess(res.token);
      } else {
        setError(res.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Cannot connect to server. Is Node running?");
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50">
      {/* The Win95 Window */}
      <div className="bg-[#c0c0c0] border-[3px] border-t-white border-l-white border-b-black border-r-black w-[400px] font-sans text-black shadow-2xl p-1">
        
        {/* Title Bar */}
        <div className="bg-[#000080] text-white font-bold px-2 py-1 flex justify-between items-center text-sm">
          <span>Logon to Inkwell OS</span>
          <button className="bg-[#c0c0c0] text-black border-2 border-t-white border-l-white border-b-black border-r-black font-bold px-2 cursor-pointer active:border-t-black active:border-l-black active:border-b-white active:border-r-white">
            X
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-4">
          <p className="text-sm">Enter a user name and password to access your library database.</p>
          
          {error && <p className="text-red-600 font-bold text-sm bg-red-100 p-1 border border-red-600">{error}</p>}

          <div className="flex flex-col gap-1">
            <label className="font-bold text-sm">User name:</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border-2 border-t-black border-l-black border-b-white border-r-white p-1"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-sm">Password:</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-2 border-t-black border-l-black border-b-white border-r-white p-1"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-2">
            <button 
              onClick={handleLogin}
              className="bg-[#c0c0c0] font-bold px-6 py-1 border-2 border-t-white border-l-white border-b-black border-r-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}