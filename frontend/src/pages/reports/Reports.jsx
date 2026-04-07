import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  MapPin, 
  Users, 
  Download,
  Calendar,
  Filter
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import api from '../../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Reports = () => {
    const [performanceData, setPerformanceData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPerformance = async () => {
            try {
                const { data } = await api.get('/reports/performance');
                setPerformanceData(data);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch performance data', error);
                setLoading(false);
            }
        };
        fetchPerformance();
    }, []);

    const chartData = {
        labels: performanceData.map(d => d.ad_title),
        datasets: [
            {
                label: 'Playback Impressions',
                data: performanceData.map(d => d.performance_count),
                backgroundColor: '#000',
                borderRadius: 4,
            },
        ],
    };

    const options = {
        indexAxis: 'y',
        responsive: true,
        plugins: {
            legend: { display: false },
        },
        scales: {
            x: { grid: { display: false }, ticks: { font: { size: 10 } } },
            y: { grid: { display: false }, ticks: { font: { size: 10 } } },
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black tracking-tight dark:text-white">Enterprise Reports</h2>
                    <p className="text-gray-400 font-medium mt-1">Advanced analytics and data exports.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="flex items-center px-4 py-2 text-sm font-bold border border-gray-200 dark:border-zinc-800 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-900 dark:text-white transition-colors">
                        <Filter size={16} className="mr-2" />
                        Custom Filters
                    </button>
                    <button className="btn-primary flex items-center">
                        <Download size={16} className="mr-2" />
                        Export to CSV
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Drivers Count', value: '1,240', icon: <Users size={18} />, delta: '+12%' },
                    { label: 'Advertising Partners', value: '84', icon: <BarChart3 size={18} />, delta: '+4' },
                    { label: 'Ads Performance', value: '92.4%', icon: <TrendingUp size={18} />, delta: '+2.1%' },
                    { label: 'Location CTR', value: '18.5%', icon: <MapPin size={18} />, delta: '-0.4%' },
                ].map((item, i) => (
                    <div key={i} className="card dark:bg-black dark:border-zinc-800 transition-colors duration-300">
                        <div className="flex items-center justify-between mb-2">
                             <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-zinc-900 flex items-center justify-center text-black dark:text-white transition-colors duration-300">
                                 {item.icon}
                             </div>
                             <span className="text-[10px] font-black uppercase text-green-500">{item.delta}</span>
                        </div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{item.label}</p>
                        <p className="text-2xl font-black mt-2 dark:text-white transition-colors duration-300">{item.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card dark:bg-black dark:border-zinc-800 transition-colors duration-300">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h4 className="text-lg font-bold dark:text-white">Campaign Performance</h4>
                            <p className="text-xs text-gray-400 mt-1">Playback count per active advertisement.</p>
                        </div>
                    </div>
                    <div className="h-96">
                        {loading ? (
                            <div className="h-full flex items-center justify-center text-gray-400">Loading analytics...</div>
                        ) : performanceData.length > 0 ? (
                            <Bar data={chartData} options={options} />
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400">No data available.</div>
                        )}
                    </div>
                </div>

                <div className="card dark:bg-black dark:border-zinc-800 transition-colors duration-300">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h4 className="text-lg font-bold dark:text-white">Location Analytics</h4>
                            <p className="text-xs text-gray-400 mt-1">Geographical distribution of ad playbacks.</p>
                        </div>
                    </div>
                    <div className="space-y-6">
                        {[
                            { name: 'Downtown Mumbai', value: '45.2%', progress: 85 },
                            { name: 'Suburban Bangalore', value: '28.1%', progress: 60 },
                            { name: 'Chennai Central', value: '12.4%', progress: 35 },
                            { name: 'New Delhi Airport', value: '14.3%', progress: 40 },
                        ].map((loc, i) => (
                            <div key={i}>
                                <div className="flex items-center justify-between mb-2">
                                     <span className="text-sm font-bold text-gray-900 dark:text-zinc-300">{loc.name}</span>
                                     <span className="text-sm font-black dark:text-white">{loc.value}</span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                                    <div className="bg-black dark:bg-white h-full transition-all duration-500" style={{ width: `${loc.progress}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-12 py-3 text-xs font-black uppercase tracking-widest border border-gray-100 dark:border-zinc-800 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-900 rounded-lg transition-colors">
                        Analyze More Regions
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Reports;
