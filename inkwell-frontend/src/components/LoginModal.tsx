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
  const [successMsg, setSuccessMsg] = useState("");

  const handleLogin = async () => {
    setError("");
    setSuccessMsg("");
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

  // NEW: Handle the Registration
  const handleRegister = async () => {
    setError("");
    setSuccessMsg("");
    
    // Basic validation
    if (username.length < 3) return setError("Username must be at least 3 characters.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");

    try {
      const res = await api.register(username, password);
      if (res.success) {
        // If successful, the backend gives us a token instantly!
        setSuccessMsg("Account created! Booting OS...");
        
        // Wait 1 second so the user can see the success message before switching screens
        setTimeout(() => {
            onLoginSuccess(res.token);
        }, 1000);
      } else {
        setError(res.message || "Registration failed");
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
          <p className="text-sm">Enter an existing username to Sign In, or type a new one and hit Sign Up.</p>
          
          {/* Error and Success Messages */}
          {error && <p className="text-red-600 font-bold text-sm bg-red-100 p-1 border border-red-600">{error}</p>}
          {successMsg && <p className="text-green-700 font-bold text-sm bg-green-100 p-1 border border-green-700">{successMsg}</p>}

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
              onClick={handleRegister}
              className="bg-[#c0c0c0] font-bold px-4 py-1 border-2 border-t-white border-l-white border-b-black border-r-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white"
            >
              Sign Up
            </button>
            <button 
              onClick={handleLogin}
              className="bg-[#c0c0c0] font-bold px-6 py-1 border-2 border-t-white border-l-white border-b-black border-r-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}