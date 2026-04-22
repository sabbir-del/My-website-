import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, ShieldAlert } from 'lucide-react';

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, ShieldAlert, Mail, Lock, UserPlus } from 'lucide-react';

export default function LoginPage() {
  const { login, loginWithEmail, signUpWithEmail, loading, error } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      await signUpWithEmail(email, password);
    } else {
      await loginWithEmail(email, password);
    }
  };

  return (
    <div className="min-h-screen bg-sky-light flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] border border-border-editorial shadow-2xl shadow-midnight/5">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-midnight text-sky-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tighter text-midnight uppercase">
            Sabbir<span className="text-sky-accent font-black italic">CMS</span>
          </h1>
          <p className="text-[#64748B] text-xs mt-2 font-medium uppercase tracking-widest">
            {isSignUp ? 'Create Admin Account' : 'Authorized Access Only'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[11px] font-bold leading-relaxed whitespace-pre-wrap">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input 
              type="email" 
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-border-editorial rounded-xl text-sm focus:outline-sky-accent transition-all"
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input 
              type="password" 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-border-editorial rounded-xl text-sm focus:outline-sky-accent transition-all"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-midnight text-white py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-midnight/90 transition-all hover:shadow-lg disabled:opacity-50"
          >
            {isSignUp ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
            {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Login with Email')}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border-editorial"></span>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
            <span className="bg-white px-4 text-[#94A3B8]">Or use Google</span>
          </div>
        </div>

        <button 
          onClick={login}
          disabled={loading}
          className="w-full border border-border-editorial py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-gray-50 transition-all active:scale-[0.98]"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/smartlock/google.svg" className="w-4 h-4" alt="Google" />
          Sign in with Google
        </button>

        <p className="mt-8 text-center text-[10px] font-bold text-[#94A3B8]">
          {isSignUp ? 'Already have an account?' : 'Need to register?'}
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="ml-2 text-sky-accent hover:underline uppercase tracking-widest"
          >
            {isSignUp ? 'Log In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
}
