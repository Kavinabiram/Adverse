import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    Building2,
    PlusSquare,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Activity,
    Calendar as CalendarIcon
} from 'lucide-react';
import { Calendar } from 'primereact/calendar';
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
import { Line } from 'react-chartjs-2';
import api from '../../services/api';
import { useTheme } from '../../context/ThemeContext';

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

const Dashboard = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const [stats, setStats] = useState({
        totalDrivers: 0,
        totalCompanies: 0,
        totalAds: 0,
        totalRevenue: 0,
        recentActivity: [],
        performance: [],
        chartLabel: 'Performance'
    });
    const [dates, setDates] = useState([new Date(2026, 3, 1), new Date(2026, 4, 31)]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/reports/dashboard');
                setStats({
                    ...data,
                    recentActivity: data.recentActivity || [],
                    performance: data.performance || []
                });
            } catch (error) {
                console.error('Failed to fetch stats', error);
            }
        };
        fetchStats();
    }, []);

    const isDark = theme === 'dark';

    // Map real performance data to labels and datasets
    // REMOVE HARDCODED LABELS - only show what the backend provides
    const performanceLabels = stats.performance.map(p => p.month || p.month_name);
    const performanceValues = stats.performance.map(p => parseInt(p.impressions || p.count || 0));

    const lineData = {
        labels: performanceLabels.length > 0 ? performanceLabels : ['No Data'],
        datasets: [
            {
                fill: true,
                label: stats.chartLabel,
                data: performanceValues.length > 0 ? performanceValues : [0],
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
                beginAtZero: true,
                ticks: {
                    color: isDark ? '#71717a' : '#000',
                    font: { size: 10, weight: 'bold' },
                    stepSize: 1
                }
            },
        },
    };

    const statCards = [
        { title: 'Total Drivers', value: stats.totalDrivers, icon: <Users size={20} />, change: '+0%', up: true },
        { title: 'Advertising Companies', value: stats.totalCompanies, icon: <Building2 size={20} />, change: '+0%', up: true },
        { title: 'Total Ads Running', value: stats.totalAds, icon: <PlusSquare size={20} />, change: '+0%', up: true },
        { title: 'Total Revenue', value: `$${(stats.totalRevenue || 0).toLocaleString()}`, icon: <TrendingUp size={20} />, change: '+0%', up: true },
    ];

    const getTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        if (seconds < 60) return `${seconds}S AGO`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}M AGO`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}H AGO`;
        return `${Math.floor(hours / 24)}D AGO`;
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-500 font-sans">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between space-y-4 md:space-y-0">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight dark:text-white transition-colors duration-300 italic">Overview</h2>
                    <p className="text-zinc-500 uppercase text-[10px] tracking-[0.2em] mt-1 transition-colors duration-300">Real-time platform performance metrics.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="relative group flex items-center space-x-2 bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 rounded-xl px-4 py-2 text-sm font-semibold shadow-sm transition-colors duration-300 dark:text-white cursor-pointer hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black">
                        <CalendarIcon size={16} />
                        <Calendar
                            value={dates}
                            onChange={(e) => setDates(e.value)}
                            selectionMode="range"
                            readOnlyInput
                            hideOnRangeSelection
                            className="bg-transparent border-none p-0 focus:ring-0 w-52"
                            inputClassName="bg-transparent border-none p-0 text-black dark:text-white font-semibold cursor-pointer group-hover:text-white dark:group-hover:text-black w-full"
                            placeholder="Select Range"
                            dateFormat="M yy"
                        />
                    </div>
                    <button className="btn-primary font-bold shadow-xl">Download Report</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => (
                    <div key={i} className="card group dark:bg-black dark:border-zinc-800 transition-all duration-300 hover:border-black dark:hover:border-white shadow-sm hover:shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 group-hover:bg-black dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black rounded-lg transition-all duration-300 text-black dark:text-white font-bold">
                                {stat.icon}
                            </div>
                            <div className={`flex items-center text-[10px] font-black ${stat.up ? 'text-green-600 bg-green-50 dark:bg-green-900/10' : 'text-red-600 bg-red-50 dark:bg-red-900/10'} px-3 py-1 rounded-full uppercase tracking-widest`}>
                                {stat.up ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
                                {stat.change}
                            </div>
                        </div>
                        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-2">{stat.title}</p>
                        <h3 className="text-3xl font-black text-black dark:text-white transition-colors duration-300 italic">{stat.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 card dark:bg-black dark:border-zinc-800 transition-colors duration-300 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h4 className="text-xl font-black dark:text-white italic">{stats.chartLabel}</h4>
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Operational velocity over time.</p>
                        </div>
                        <div className="flex items-center space-x-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                            <span className="w-3 h-3 bg-black dark:bg-white rounded-full mr-1"></span>
                            Volume
                        </div>
                    </div>
                    <div className="h-80">
                        <Line data={lineData} options={options} />
                    </div>
                </div>

                <div className="card dark:bg-black dark:border-zinc-800 h-full flex flex-col transition-colors duration-300 shadow-sm hover:shadow-xl">
                    <h4 className="text-xl font-black mb-6 dark:text-white border-b dark:border-zinc-800 pb-4 italic underline decoration-zinc-800 underline-offset-8">Recent Activity</h4>
                    <div className="flex-1 space-y-6 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                        {stats.recentActivity.length > 0 ? (
                            stats.recentActivity.map((activity, i) => (
                                <div key={i} className="flex items-start space-x-4">
                                    <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 flex items-center justify-center text-black dark:text-white transition-colors duration-300 shrink-0">
                                        <Activity size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-black text-black dark:text-white truncate transition-colors duration-300">
                                            {activity.type === 'driver' ? 'New Driver' : activity.type === 'ad' ? 'New Campaign' : 'New Partner'}
                                        </p>
                                        <p className="text-xs text-zinc-500 mt-1 truncate transition-colors duration-300 font-bold">{activity.title} was {activity.action}.</p>
                                    </div>
                                    <span className="text-[9px] font-black text-zinc-600 dark:text-zinc-500 uppercase tracking-tighter shrink-0 pt-1">
                                        {getTimeAgo(activity.created_at)}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="py-10 text-center text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">No real-time logs detected.</div>
                        )}
                    </div>
                    <button
                        onClick={() => navigate('/audit-logs')}
                        className="w-full mt-8 py-3 text-xs font-black uppercase tracking-widest border border-gray-100 dark:border-zinc-800 dark:text-zinc-500 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black rounded-lg transition-all duration-300"
                    >
                        View System History
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
