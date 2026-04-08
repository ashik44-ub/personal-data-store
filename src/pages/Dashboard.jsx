import { useEffect, useState, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { Wallet, TrendingUp, TrendingDown, RefreshCw, HandCoins, Tags } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [totalSalary, setTotalSalary] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [salRes, expRes] = await Promise.all([
                api.get('/salaries/total'),
                api.get('/expenses/total')
            ]);
            setTotalSalary(salRes.data.total || 0);
            setTotalExpense(expRes.data.total || 0);
        } catch (error) {
            console.error('Error fetching dashboard stats', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const balance = totalSalary - totalExpense;

    return (
        <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between bg-white/70 p-8 rounded-[2rem] backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
                <div className="absolute -right-20 -top-20 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
                <div className="relative z-10 w-full flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 tracking-tight">Welcome back, {user?.username}! 👋</h1>
                        <p className="text-gray-500 mt-2 font-medium text-lg">Here's what's happening with your finances today.</p>
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Total Salary */}
                <div className="bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col justify-between hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 animate-in zoom-in-95 fade-in duration-500 delay-150 fill-mode-both">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-gray-500 font-bold uppercase tracking-widest text-xs">Total Salary</h3>
                        <div className="w-14 h-14 bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600 rounded-2xl flex justify-center items-center shadow-inner">
                            <TrendingUp className="w-7 h-7 drop-shadow-sm" />
                        </div>
                    </div>
                    <div className="flex items-end justify-between">
                        <div>
                            {loading ? (
                                <RefreshCw className="animate-spin w-8 h-8 text-gray-300" />
                            ) : (
                                <span className="text-5xl font-black text-gray-800 tracking-tighter">৳{totalSalary.toLocaleString()}</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Total Expenses */}
                <div className="bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col justify-between hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 animate-in zoom-in-95 fade-in duration-500 delay-300 fill-mode-both">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-gray-500 font-bold uppercase tracking-widest text-xs">Total Expenses</h3>
                        <div className="w-14 h-14 bg-gradient-to-br from-rose-50 to-rose-100 text-rose-600 rounded-2xl flex justify-center items-center shadow-inner">
                            <TrendingDown className="w-7 h-7 drop-shadow-sm" />
                        </div>
                    </div>
                    <div className="flex items-end justify-between">
                        <div>
                            {loading ? (
                                <RefreshCw className="animate-spin w-8 h-8 text-gray-300" />
                            ) : (
                                <span className="text-5xl font-black text-gray-800 tracking-tighter">৳{totalExpense.toLocaleString()}</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Current Balance */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 rounded-[2rem] shadow-2xl shadow-gray-900/20 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 relative overflow-hidden animate-in zoom-in-95 fade-in duration-500 delay-[450ms] fill-mode-both">
                    <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full blur-2xl animate-pulse"></div>
                    <div className="flex items-center justify-between mb-6 relative z-10">
                        <h3 className="text-gray-300 font-bold uppercase tracking-widest text-xs">
                            Current Balance <span className="text-gray-400 block mt-1.5 normal-case text-[11px] font-medium tracking-normal">(Salary - Expense)</span>
                        </h3>
                        <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex justify-center items-center border border-white/10 shadow-inner">
                            <Wallet className="w-7 h-7 text-white" />
                        </div>
                    </div>
                    <div className="flex items-end justify-between relative z-10">
                        <div>
                            {loading ? (
                                <RefreshCw className="animate-spin w-8 h-8 text-gray-500" />
                            ) : (
                                <span className={`text-5xl font-black tracking-tighter ${balance >= 0 ? 'text-white' : 'text-red-400'}`}>
                                    {balance < 0 ? '-' : ''}৳{Math.abs(balance).toLocaleString()}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center text-xs text-white font-bold tracking-wide uppercase bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                            Available
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Links Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Link to="/salaries" className="group relative overflow-hidden p-8 rounded-[2rem] text-white transform transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.4)] animate-in slide-in-from-bottom-8 fade-in duration-500 delay-500 fill-mode-both">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-600 transition-transform duration-500 group-hover:scale-110"></div>
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                <h3 className="font-bold text-emerald-100 uppercase tracking-widest text-xs mb-2 opacity-80">Income</h3>
                                <p className="text-3xl font-extrabold tracking-tight">Add Salary</p>
                            </div>
                            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm border border-white/10 shadow-inner">
                                <HandCoins className="w-8 h-8 text-white drop-shadow-md" />
                            </div>
                        </div>
                        <div className="text-emerald-50 text-sm flex items-center font-bold tracking-wide uppercase">
                            Manage Salaries <span className="ml-2 group-hover:translate-x-2 transition-transform">&rarr;</span>
                        </div>
                    </div>
                </Link>

                <Link to="/expenses" className="group relative overflow-hidden p-8 rounded-[2rem] text-white transform transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_40px_-15px_rgba(244,63,94,0.4)] animate-in slide-in-from-bottom-8 fade-in duration-500 delay-[600ms] fill-mode-both">
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-400 to-rose-600 transition-transform duration-500 group-hover:scale-110"></div>
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                <h3 className="font-bold text-rose-100 uppercase tracking-widest text-xs mb-2 opacity-80">Expenditure</h3>
                                <p className="text-3xl font-extrabold tracking-tight">Add Expenses</p>
                            </div>
                            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm border border-white/10 shadow-inner">
                                <TrendingDown className="w-8 h-8 text-white drop-shadow-md" />
                            </div>
                        </div>
                        <div className="text-rose-50 text-sm flex items-center font-bold tracking-wide uppercase">
                            Manage Expenses <span className="ml-2 group-hover:translate-x-2 transition-transform">&rarr;</span>
                        </div>
                    </div>
                </Link>

                <Link to="/categories" className="group relative overflow-hidden p-8 rounded-[2rem] text-white transform transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_40px_-15px_rgba(79,70,229,0.4)] animate-in slide-in-from-bottom-8 fade-in duration-500 delay-[700ms] fill-mode-both">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-blue-600 transition-transform duration-500 group-hover:scale-110"></div>
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                <h3 className="font-bold text-blue-100 uppercase tracking-widest text-xs mb-2 opacity-80">Settings</h3>
                                <p className="text-3xl font-extrabold tracking-tight">Categories</p>
                            </div>
                            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm border border-white/10 shadow-inner">
                                <Tags className="w-8 h-8 text-white drop-shadow-md" />
                            </div>
                        </div>
                        <div className="text-blue-50 text-sm flex items-center font-bold tracking-wide uppercase">
                            Manage Types <span className="ml-2 group-hover:translate-x-2 transition-transform">&rarr;</span>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
};
export default Dashboard;
