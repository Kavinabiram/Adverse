import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import useAuthStore from '../../store/authStore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="h-screen overflow-hidden flex items-center justify-center bg-gray-50 dark:bg-zinc-950 px-4 transition-colors duration-500">
      <div className="max-w-[450px] w-full animate-in fade-in zoom-in duration-500 scale-90 md:scale-100">
        <div className="bg-white dark:bg-black rounded-[2.5rem] shadow-2xl p-10 md:p-14 border border-gray-100 dark:border-zinc-900 transition-all duration-300">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-black dark:bg-zinc-800 rounded-3xl mb-6 transition-colors shadow-2xl">
                 <LogIn className="text-white" size={36} />
            </div>
            <h1 className="text-5xl font-black tracking-tighter mb-2 text-black dark:text-white transition-colors">ADVERSE</h1>
            <p className="text-gray-400 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">ENTERPRISE ADMIN TERMINAL</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500 text-red-700 dark:text-red-400 text-xs rounded font-bold transition-all">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-gray-500 dark:text-zinc-500 uppercase tracking-widest mb-3 px-1">GLOBAL ACCESS EMAIL</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-black dark:text-zinc-500" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-900 border-2 border-black dark:border-white rounded-2xl pl-12 pr-4 py-4 text-sm outline-none transition-all dark:text-white placeholder:text-gray-300 dark:placeholder:text-zinc-700 font-bold"
                  placeholder="admin@adverse.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-500 dark:text-zinc-500 uppercase tracking-widest mb-3 px-1">SECURITY KEYPHRASE</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-zinc-900 border-2 border-transparent rounded-2xl pl-12 pr-12 py-4 text-sm outline-none transition-all dark:text-white placeholder:text-gray-300 dark:placeholder:text-zinc-700"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between py-1">
              <label className="flex items-center group cursor-pointer">
                <input type="checkbox" className="w-6 h-6 rounded-md border-gray-300 dark:border-zinc-800 text-black dark:text-white bg-white dark:bg-zinc-900 focus:ring-0 transition-all cursor-pointer" />
                <span className="ml-3 text-sm text-gray-400 dark:text-zinc-400 font-bold group-hover:text-black dark:group-hover:text-white transition-colors">Keep me signed in</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-zinc-200 py-5 rounded-2xl flex items-center justify-center space-x-2 font-black uppercase tracking-[0.2em] text-[10px] transition-all shadow-xl active:scale-95 disabled:opacity-50"
            >
              <span>{loading ? 'Decrypting...' : 'AUTHENTICATE'}</span>
              {!loading && <LogIn size={18} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
