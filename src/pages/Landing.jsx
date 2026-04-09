import { Link, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Wallet, Shield, PieChart, ArrowRight, Lock, Receipt } from 'lucide-react';

const Landing = () => {
    const { user } = useContext(AuthContext);

    // If user is already logged in, they can still see it, but we can just redirect them or show a "Go to Dashboard" button.
    // Let's keep it visible so they can admire it, but the primary button will say "Go to Dashboard" if logged in.

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-rose-500/10 blur-[120px] pointer-events-none"></div>

            {/* Navbar */}
            <nav className="relative z-20 flex flex-col sm:flex-row items-center justify-between px-4 sm:px-8 py-6 max-w-7xl mx-auto gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/30">
                        <Wallet className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">FinVault<span className="text-indigo-600">.</span></h1>
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                    {user ? (
                        <Link to="/dashboard" className="px-4 py-2 sm:px-6 sm:py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/20 text-sm sm:text-base">
                            Go to Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link to="/login" className="px-3 py-2 sm:px-6 sm:py-3 text-gray-600 font-bold hover:text-gray-900 transition-colors text-sm sm:text-base">
                                Sign In
                            </Link>
                            <Link to="/register" className="px-4 py-2 sm:px-6 sm:py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/30 hover:-translate-y-0.5 text-sm sm:text-base">
                                Create Account
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-20 pb-32 max-w-5xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200/60 shadow-sm mb-8 animate-in slide-in-from-bottom-4 fade-in duration-700">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-sm font-bold text-gray-600">Everything securely in one place</span>
                </div>
                
                <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tight leading-[1.1] mb-8 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-150 fill-mode-both">
                    Manage Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-rose-500">Wealth</span> & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-500">Security</span>
                </h1>
                
                <p className="text-xl text-gray-500 max-w-2xl mb-12 font-medium leading-relaxed animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-300 fill-mode-both">
                    A premium personal workspace to track expenses, manage endless income streams, and secure your most heavily-guarded passwords. All seamlessly designed for daily use.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-500 fill-mode-both">
                    <Link to={user ? "/dashboard" : "/register"} className="w-full sm:w-auto px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-gray-800 hover:scale-[1.02] transition-all shadow-xl shadow-gray-900/20">
                        Get Started Now <ArrowRight className="w-5 h-5" />
                    </Link>
                    <a href="#features" className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-2xl font-bold text-lg flex items-center justify-center hover:bg-gray-50 transition-all shadow-sm">
                        Explore Features
                    </a>
                </div>

                {/* Dashboard Preview Mockup */}
                <div className="mt-24 w-full relative animate-in zoom-in-95 fade-in duration-1000 delay-700 fill-mode-both">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC] via-transparent to-transparent z-10 bottom-0 top-1/2"></div>
                    <div className="bg-white p-4 rounded-[2rem] shadow-2xl border border-gray-200/50 mx-auto w-full max-w-4xl rotate-[2deg] hover:rotate-0 transition-transform duration-700 ease-out">
                        <div className="w-full h-8 bg-gray-50 border-b border-gray-100 rounded-t-xl flex items-center gap-2 px-4 mb-4">
                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-12 px-4">
                            <div className="h-28 sm:h-32 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col justify-center items-center gap-2">
                                <Wallet className="w-8 h-8 text-indigo-400" />
                                <div className="w-24 h-3 bg-gray-200 rounded-full"></div>
                                <div className="w-16 h-2 bg-gray-200 rounded-full"></div>
                            </div>
                            <div className="h-28 sm:h-32 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col justify-center items-center gap-2">
                                <Receipt className="w-8 h-8 text-rose-400" />
                                <div className="w-24 h-3 bg-gray-200 rounded-full"></div>
                                <div className="w-16 h-2 bg-gray-200 rounded-full"></div>
                            </div>
                            <div className="h-28 sm:h-32 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col justify-center items-center gap-2">
                                <Lock className="w-8 h-8 text-emerald-400" />
                                <div className="w-24 h-3 bg-gray-200 rounded-full"></div>
                                <div className="w-16 h-2 bg-gray-200 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Features Info Section */}
            <section id="features" className="relative z-10 py-24 bg-white/50 border-t border-gray-100">
                <div className="max-w-6xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <PieChart className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Track Expenses</h3>
                        <p className="text-gray-500 font-medium leading-relaxed">Categorize your spending habits and find exactly where your money goes every month with beautifully structured lists.</p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <Lock className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Secure Credentials</h3>
                        <p className="text-gray-500 font-medium leading-relaxed">Your passwords, cleanly hidden and ready to copy whenever you need them. Equipped with custom search and pagination.</p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <Shield className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Private & Local</h3>
                        <p className="text-gray-500 font-medium leading-relaxed">Your very own dashboard built on robust JWT security structure to keep everything safely tied exclusively to your account.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Landing;
