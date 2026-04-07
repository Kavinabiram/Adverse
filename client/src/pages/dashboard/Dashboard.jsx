import React, { useEffect, useState } from 'react';
import {
    Users,
    Building2,
    PlusSquare,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Activity,
    Calendar
} from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import api from '../../services/api';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

import { useTheme } from '../../context/ThemeContext';

const Dashboard = () => {
    const { theme } = useTheme();
    const [stats, setStats] = useState({
        totalDrivers: 0,
        totalCompanies: 0,
        totalAds: 0,
        totalRevenue: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/reports/dashboard');
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch stats', error);
            }
        };
        fetchStats();
    }, []);

    const isDark = theme === 'dark';

    const lineData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                fill: true,
                label: 'Ads Performance',
                data: [30, 45, 42, 50, 65, 55, 70, 85, 80, 90, 85, 100],
                borderColor: isDark ? '#fff' : '#000',
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: isDark ? '#000' : '#fff',
                pointBorderColor: isDark ? '#fff' : '#000',
                pointBorderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: isDark ? '#18181b' : '#fff',
                titleColor: isDark ? '#fff' : '#000',
                bodyColor: isDark ? '#a1a1aa' : '#666',
                borderColor: isDark ? '#27272a' : '#eee',
                borderWidth: 1,
                padding: 12,
                boxPadding: 4,
                usePointStyle: true,
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: isDark ? '#71717a' : '#000', font: { size: 10, weight: 'bold' } }
            },
            y: {
                grid: { color: isDark ? '#27272a' : 'rgba(0,0,0,0.1)' },
                ticks: { color: isDark ? '#71717a' : '#000', font: { size: 10, weight: 'bold' } }
            },
        },
    };

    const statCards = [
        { title: 'Total Drivers', value: stats.totalDrivers, icon: <Users size={20} />, change: '+12%', up: true },
        { title: 'Advertising Companies', value: stats.totalCompanies, icon: <Building2 size={20} />, change: '+5%', up: true },
        { title: 'Total Ads Running', value: stats.totalAds, icon: <PlusSquare size={20} />, change: '-2%', up: false },
        { title: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: <TrendingUp size={20} />, change: '+24%', up: true },
    ];

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between space-y-4 md:space-y-0">
                <div>
                    <h2 className="text-3xl font-black tracking-tight dark:text-white">Overview</h2>
                    <p className="text-black font-black dark:text-zinc-500 mt-1 uppercase text-[10px] tracking-[0.2em]">Real-time platform performance metrics.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2 bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 rounded-xl px-4 py-2 text-sm font-black shadow-sm transition-colors duration-300 dark:text-white">
                        <Calendar size={16} />
                        <span className="text-black dark:text-white">Apr 2026 - May 2026</span>
                    </div>
                    <button className="btn-primary">Download Report</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => (
                    <div key={i} className="card group dark:bg-black dark:border-zinc-800 transition-all duration-300 hover:border-black dark:hover:border-white">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2.5 bg-gray-50 dark:bg-zinc-900 group-hover:bg-black dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black rounded-lg transition-all duration-300 dark:text-zinc-400">
                                {stat.icon}
                            </div>
                            <div className={`flex items-center text-xs font-black ${stat.up ? 'text-green-600 bg-green-50 dark:bg-green-900/10' : 'text-red-600 bg-red-50 dark:bg-red-900/10'} px-2 py-1 rounded-full`}>
                                {stat.up ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
                                {stat.change}
                            </div>
                        </div>
                        <p className="text-[9px] font-black text-black dark:text-zinc-500 uppercase tracking-[0.2em] mb-2">{stat.title}</p>
                        <h3 className="text-3xl font-black text-black dark:text-white transition-colors duration-300">{stat.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 card dark:bg-black dark:border-zinc-800 transition-colors duration-300">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h4 className="text-lg font-black dark:text-white">Ads Performance</h4>
                            <p className="text-[10px] font-black text-black dark:text-zinc-500 uppercase tracking-widest mt-1">Monthly playback data.</p>
                        </div>
                        <div className="flex items-center space-x-2 text-[10px] font-black text-black dark:text-zinc-400 uppercase tracking-widest">
                            <span className="w-3 h-3 bg-black dark:bg-white rounded-full mr-1"></span>
                            Impressions
                        </div>
                    </div>
                    <div className="h-80">
                        <Line data={lineData} options={options} />
                    </div>
                </div>

                <div className="card dark:bg-black dark:border-zinc-800 h-full flex flex-col transition-colors duration-300">
                    <h4 className="text-lg font-bold mb-6 dark:text-white border-b dark:border-zinc-800 pb-4">Recent Activity</h4>
                    <div className="flex-1 space-y-6">
                        {[1, 2, 3, 4, 5].map((_, i) => (
                            <div key={i} className="flex items-start space-x-4">
                                <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-zinc-900 flex items-center justify-center shrink-0 transition-colors duration-300">
                                    <Activity size={18} className="text-gray-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-black text-black dark:text-white truncate transition-colors duration-300">New Driver Registered</p>
                                    <p className="text-xs text-black font-bold dark:text-zinc-500 mt-1">John Doe joined the platform.</p>
                                </div>
                                <span className="text-[10px] font-black text-black dark:text-zinc-500 uppercase tracking-widest bg-gray-50 dark:bg-zinc-900 px-2 py-1 rounded">2m ago</span>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-8 py-3 text-xs font-black uppercase tracking-widest border border-gray-100 dark:border-zinc-800 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-900 rounded-lg transition-colors">
                        View All Logs
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
