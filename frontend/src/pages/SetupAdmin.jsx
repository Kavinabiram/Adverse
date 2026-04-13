import React, { useState } from 'react';
import api from '../services/api';
import { User, Mail, Lock, CheckCircle, XCircle, Loader2, Eye, EyeOff } from 'lucide-react';

const SetupAdmin = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validate = () => {
        if (!formData.name || !formData.email || !formData.password) {
            setMessage({ type: 'error', text: 'All fields are required.' });
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match.' });
            return false;
        }
        if (formData.password.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters long.' });
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (!validate()) return;

        setLoading(true);
        try {
            const response = await api.post('/setup-admin', {
                name: formData.name,
                email: formData.email,
                password: formData.password
            });

            setMessage({ 
                type: 'success', 
                text: response.data.message || 'Admin account created successfully! You can now delete this file.' 
            });
            setFormData({ name: '', email: '', password: '', confirmPassword: '' });
        } catch (error) {
            setMessage({ 
                type: 'error', 
                text: error.response?.data?.message || 'An error occurred during setup.' 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 flex items-center justify-center p-2 md:p-4 bg-[var(--bg)] min-h-[100svh] overflow-hidden">
            <div className="max-w-md w-full bg-white dark:bg-[#1c1c24] rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden transition-all duration-300">
                <div className="p-4 md:p-6">
                    <div className="text-center mb-4">
                        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--accent-bg)] border border-[var(--accent-border)] mb-2">
                            <User className="w-5 h-5 text-[#aa3bff]" />
                        </div>
                        <h1 className="text-xl md:text-2xl font-bold text-[var(--text-h)] m-0 leading-tight">Admin Setup</h1>
                        <p className="text-[var(--text)] text-[10px] md:text-xs">Create the initial administrator account.</p>
                    </div>

                    {message.text && (
                        <div className={`mb-3 p-2.5 rounded-lg flex items-start gap-2 animate-in fade-in slide-in-from-top-2 duration-300 ${
                            message.type === 'success' 
                                ? 'bg-green-50 dark:bg-green-900/10 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800/30' 
                                : 'bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/30'
                        }`}>
                            {message.type === 'success' ? <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" /> : <XCircle className="w-4 h-4 mt-0.5 shrink-0" />}
                            <span className="text-xs font-semibold">{message.text}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div className="space-y-1">
                            <label className="text-[10px] md:text-xs font-bold text-[var(--text-h)] ml-1 uppercase tracking-wider">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#aa3bff] focus:border-transparent transition-all text-xs md:text-sm dark:text-white"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] md:text-xs font-bold text-[var(--text-h)] ml-1 uppercase tracking-wider">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="admin@example.com"
                                    className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#aa3bff] focus:border-transparent transition-all text-xs md:text-sm dark:text-white"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] md:text-xs font-bold text-[var(--text-h)] ml-1 uppercase tracking-wider">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full pl-9 pr-10 py-2 bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#aa3bff] focus:border-transparent transition-all text-xs md:text-sm dark:text-white"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-[#aa3bff]"
                                >
                                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] md:text-xs font-bold text-[var(--text-h)] ml-1 uppercase tracking-wider">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full pl-9 pr-10 py-2 bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#aa3bff] focus:border-transparent transition-all text-xs md:text-sm dark:text-white"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-[#aa3bff]"
                                >
                                    {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 bg-[#aa3bff] hover:bg-[#8e2ee6] text-white font-bold rounded-lg shadow-lg transition-all duration-300 transform active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 mt-2 text-xs md:text-sm"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Complete Setup'}
                        </button>
                    </form>
                    
                    <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 text-center">
                        <p className="text-[10px] text-gray-400 uppercase tracking-tighter font-bold">
                            Security: Delete after use
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SetupAdmin;
