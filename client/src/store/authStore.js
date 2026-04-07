import { create } from 'zustand';
import api from '../services/api';

const useAuthStore = create((set) => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    loading: false,
    error: null,

    login: async (email, password) => {
        set({ loading: true, error: null });
        try {
            const { data } = await api.post('/auth/login', { email, password });
            localStorage.setItem('user', JSON.stringify(data));
            set({ user: data, loading: false });
            return true;
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Login failed',
                loading: false,
            });
            return false;
        }
    },

    logout: () => {
        localStorage.removeItem('user');
        set({ user: null });
    },

    setProfile: async () => {
        try {
            const { data } = await api.get('/auth/profile');
            set({ user: { ...data, token: JSON.parse(localStorage.getItem('user')).token } });
        } catch (error) {
            console.error('Failed to fetch profile', error);
        }
    }
}));

export default useAuthStore;
