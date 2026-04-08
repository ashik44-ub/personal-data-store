import { useState } from 'react';
import api from '../utils/api';
import { Link, useNavigate } from 'react-router-dom';
import { KeyRound, ArrowLeft, MailCheck, ShieldCheck } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [status, setStatus] = useState(null);
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    const handleVerifyEmail = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/verify-email', { email });
            setStatus({ type: 'success', msg: 'Email matched! You may now reset your password.' });
            setStep(2);
        } catch (err) {
            setStatus({ type: 'error', msg: err.response?.data?.message || 'Email not found.' });
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/reset-password', { email, newPassword });
            setStatus({ type: 'success', msg: res.data.message });
            setTimeout(() => navigate('/login'), 2500);
        } catch (err) {
            setStatus({ type: 'error', msg: err.response?.data?.message || 'Update failed.' });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 bg-gradient-to-br from-indigo-50 to-blue-50 p-4">
            <div className="bg-white p-8 rounded-[2rem] shadow-2xl w-full max-w-md border border-gray-100 relative animate-in zoom-in-95 duration-500">
                <Link to="/login" className="absolute top-6 left-6 text-gray-400 hover:text-gray-700 transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <div className="text-center mb-8 mt-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-4 shadow-inner">
                        {step === 1 ? <MailCheck className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8" />}
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">{step === 1 ? 'Verify Email' : 'New Password'}</h2>
                    <p className="text-gray-500 mt-2 font-medium">{step === 1 ? 'Enter your registered email address' : 'Enter your strong new password'}</p>
                </div>
                
                {status && (
                    <div className={`p-4 rounded-xl mb-6 font-bold text-sm text-center ${status.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                        {status.msg}
                    </div>
                )}

                {step === 1 ? (
                    <form onSubmit={handleVerifyEmail} className="space-y-5 animate-in fade-in duration-500">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                            <input 
                                type="email" 
                                className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none font-medium text-gray-800" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                                placeholder="you@example.com"
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition-all duration-200 shadow-xl shadow-indigo-600/30 mt-4 active:scale-95 flex items-center justify-center gap-2"
                        >
                            Verify Account
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleUpdatePassword} className="space-y-5 animate-in slide-in-from-right-8 fade-in duration-500">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">New Password</label>
                            <input 
                                type="password" 
                                className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none font-medium text-gray-800" 
                                value={newPassword} 
                                onChange={(e) => setNewPassword(e.target.value)} 
                                required 
                                placeholder="Enter a strong new password"
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl transition-all duration-200 shadow-xl shadow-emerald-600/30 mt-4 active:scale-95"
                        >
                            Update & Login
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
