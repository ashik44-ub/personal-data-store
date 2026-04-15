import { useEffect, useState } from 'react';
import api from '../utils/api';
import { Plus, Trash2, Edit2, Check, X, Shield, Eye, EyeOff, Copy, Search, ChevronLeft, ChevronRight, Download, Loader2 } from 'lucide-react';
import * as XLSX from 'xlsx';

const Passwords = () => {
    const [passwords, setPasswords] = useState([]);
    const [websiteName, setWebsiteName] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [editId, setEditId] = useState(null);
    const [editMode, setEditMode] = useState({});
    const [visiblePasswords, setVisiblePasswords] = useState({});
    
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteTargetId, setDeleteTargetId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const itemsPerPage = 10;

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/passwords');
            setPasswords(res.data);
        } catch (error) {
            console.error('Failed to fetch passwords');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const addPassword = async (e) => {
        e.preventDefault();
        try {
            await api.post('/passwords', { websiteName, emailAddress, password: passwordInput });
            setWebsiteName('');
            setEmailAddress('');
            setPasswordInput('');
            fetchData();
        } catch (error) {
            alert('Failed to add password');
        }
    };

    const triggerDelete = (id) => {
        setDeleteTargetId(id);
    };

    const confirmDelete = async () => {
        if (!deleteTargetId) return;
        try {
            await api.delete(`/passwords/${deleteTargetId}`);
            setDeleteTargetId(null);
            fetchData();
        } catch (error) {
            alert('Failed to delete password');
        }
    };

    const updatePassword = async (id) => {
        try {
            const currentItem = editMode[id];
            await api.put(`/passwords/${id}`, { 
                websiteName: currentItem.websiteName,
                emailAddress: currentItem.emailAddress,
                password: currentItem.password
            });
            setEditId(null);
            fetchData();
        } catch (error) {
            alert('Failed to update password');
        }
    };

    const handleEditChange = (id, field, value) => {
        setEditMode(prev => ({
            ...prev,
            [id]: { ...prev[id], [field]: value }
        }));
    };

    const startEdit = (pwd) => {
        setEditId(pwd._id);
        setEditMode(prev => ({
            ...prev,
            [pwd._id]: { websiteName: pwd.websiteName, emailAddress: pwd.emailAddress, password: pwd.password }
        }));
    };

    const toggleVisibility = (id) => {
        setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('Password copied to clipboard!');
    };

    const exportToExcel = () => {
        const exportData = passwords.map(pwd => ({
            'Website Name': pwd.websiteName,
            'Email/Username': pwd.emailAddress,
            'Password': pwd.password // Note: Exports actual passwords to an Excel file
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Credentials_Log');
        XLSX.writeFile(workbook, 'Passwords_Report.xlsx');
    };

    const filteredPasswords = passwords.filter(pwd => 
        pwd.websiteName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        pwd.emailAddress.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredPasswords.length / itemsPerPage);
    const currentItems = filteredPasswords.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Password Manager</h1>
                    <p className="text-gray-500 mt-2 font-medium text-lg">Securely save and manage your website credentials</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    <div className="relative w-full sm:w-64 md:w-72">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search website or email..."
                            className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-slate-500 transition-all outline-none font-medium text-gray-800 placeholder:text-gray-400 shadow-[0_4px_20px_rgb(0,0,0,0.03)]"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>

                    <button 
                        onClick={exportToExcel}
                        disabled={passwords.length === 0}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-100/50 text-emerald-700 hover:bg-emerald-500 hover:text-white px-5 py-3 rounded-2xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm border border-emerald-200"
                    >
                        <Download className="w-5 h-5" />
                        Export Excel
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 mb-10 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-slate-100/50 to-transparent pointer-events-none"></div>
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <div className="p-3 bg-slate-100 text-slate-700 rounded-xl border border-slate-200 shadow-sm">
                        <Shield className="w-6 h-6" />
                    </div>
                    Save New Credentials
                </h2>
                <form onSubmit={addPassword} className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
                    <div className="md:col-span-1">
                        <input 
                            type="text" 
                            placeholder="Website Name" 
                            className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-slate-500 focus:bg-white transition-all outline-none font-bold text-gray-800 placeholder:font-medium placeholder:text-gray-400 shadow-inner" 
                            value={websiteName} 
                            onChange={(e) => setWebsiteName(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="md:col-span-1">
                        <input 
                            type="email" 
                            placeholder="Email / Username" 
                            className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-slate-500 focus:bg-white transition-all outline-none font-medium text-gray-800 placeholder:font-medium placeholder:text-gray-400 shadow-inner" 
                            value={emailAddress} 
                            onChange={(e) => setEmailAddress(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="md:col-span-1">
                        <input 
                            type="password" 
                            placeholder="Password" 
                            className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-slate-500 focus:bg-white transition-all outline-none font-medium text-gray-800 placeholder:font-medium placeholder:text-gray-400 shadow-inner" 
                            value={passwordInput} 
                            onChange={(e) => setPasswordInput(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="md:col-span-1">
                        <button type="submit" className="w-full h-full bg-slate-800 hover:bg-slate-900 active:scale-95 text-white rounded-2xl font-bold flex items-center justify-center gap-2 py-4 transition-all shadow-lg shadow-slate-900/20">
                            <Plus className="w-5 h-5" /> Save Data
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/80 border-b border-gray-100">
                            <tr>
                                <th className="px-8 py-5 font-bold text-xs text-gray-400 uppercase tracking-widest">Website</th>
                                <th className="px-8 py-5 font-bold text-xs text-gray-400 uppercase tracking-widest">Email Address</th>
                                <th className="px-8 py-5 font-bold text-xs text-gray-400 uppercase tracking-widest">Password</th>
                                <th className="px-8 py-5 font-bold text-xs text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="4" className="px-8 py-16 text-center">
                                        <Loader2 className="w-10 h-10 animate-spin text-slate-500 mx-auto mb-4" />
                                        <p className="text-gray-500 font-medium text-lg">Loading passwords...</p>
                                    </td>
                                </tr>
                            ) : currentItems.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-8 py-16 text-center text-gray-400 font-medium text-lg">
                                        {searchQuery ? 'No matching passwords found.' : 'No passwords saved yet.'}
                                    </td>
                                </tr>
                            ) : (
                                currentItems.map((pwd) => {
                                    const isEditing = editId === pwd._id;
                                    const editState = editMode[pwd._id] || {};
                                    const isVisible = visiblePasswords[pwd._id] || false;
    
                                    return (
                                <tr key={pwd._id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        {isEditing ? (
                                            <input type="text" className="border-none ring-1 ring-slate-500 bg-slate-50 px-4 py-2 rounded-xl text-slate-800 font-bold w-full outline-none" value={editState.websiteName} onChange={(e) => handleEditChange(pwd._id, 'websiteName', e.target.value)} />
                                        ) : (
                                            <span className="font-extrabold text-lg text-slate-800">{pwd.websiteName}</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6">
                                        {isEditing ? (
                                            <input type="email" className="border-none ring-1 ring-slate-500 bg-slate-50 px-4 py-2 rounded-xl text-slate-800 font-medium w-full outline-none" value={editState.emailAddress} onChange={(e) => handleEditChange(pwd._id, 'emailAddress', e.target.value)} />
                                        ) : (
                                            <span className="text-gray-600 font-medium">{pwd.emailAddress}</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            {isEditing ? (
                                                <input type="text" className="border-none ring-1 ring-slate-500 bg-slate-50 px-4 py-2 rounded-xl text-slate-800 font-medium w-full outline-none" value={editState.password} onChange={(e) => handleEditChange(pwd._id, 'password', e.target.value)} />
                                            ) : (
                                                <>
                                                    <span className="font-mono text-gray-700 bg-gray-100 px-3 py-1.5 rounded-lg text-sm font-semibold tracking-widest">
                                                        {isVisible ? pwd.password : '••••••••••••'}
                                                    </span>
                                                    <button onClick={() => toggleVisibility(pwd._id)} className="text-gray-400 hover:text-slate-700 transition-colors" title={isVisible ? "Hide Password" : "Show Password"}>
                                                        {isVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                    </button>
                                                    <button onClick={() => copyToClipboard(pwd.password)} className="text-gray-400 hover:text-slate-700 transition-colors" title="Copy Password">
                                                        <Copy className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 flex justify-end gap-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                        {isEditing ? (
                                            <>
                                                <button onClick={() => updatePassword(pwd._id)} className="p-2.5 bg-green-50 text-green-600 hover:bg-green-500 hover:text-white rounded-xl transition-colors"><Check className="w-5 h-5" /></button>
                                                <button onClick={() => setEditId(null)} className="p-2.5 bg-gray-50 text-gray-400 hover:bg-gray-500 hover:text-white rounded-xl transition-colors"><X className="w-5 h-5" /></button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => startEdit(pwd)} className="p-2.5 bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white rounded-xl transition-colors"><Edit2 className="w-4 h-4" /></button>
                                                <button onClick={() => triggerDelete(pwd._id)} className="p-2.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-colors"><Trash2 className="w-4 h-4" /></button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-8 py-5 border-t border-gray-100 bg-gray-50/50">
                        <span className="text-sm text-gray-500 font-medium">
                            Showing <span className="font-bold text-gray-800">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-gray-800">{Math.min(currentPage * itemsPerPage, filteredPasswords.length)}</span> of <span className="font-bold text-gray-800">{filteredPasswords.length}</span> results
                        </span>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <span className="px-4 py-2 rounded-lg bg-slate-800 text-white font-bold text-sm shadow-sm">
                                {currentPage} / {totalPages}
                            </span>
                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteTargetId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200 px-4">
                    <div className="bg-white p-6 rounded-[2rem] shadow-2xl w-full max-w-sm animate-in zoom-in-95 duration-300">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4 shadow-inner">
                            <Trash2 className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Delete Password?</h3>
                        <p className="text-gray-500 font-medium mb-8">Are you certain you want to delete these credentials? This action cannot be reversed.</p>
                        <div className="flex gap-4">
                            <button onClick={() => setDeleteTargetId(null)} className="flex-1 px-4 py-3.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-2xl font-bold transition-all">No, Cancel</button>
                            <button onClick={confirmDelete} className="flex-1 px-4 py-3.5 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold transition-all shadow-lg shadow-red-500/30">Yes, Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default Passwords;
