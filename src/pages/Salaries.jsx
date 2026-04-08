import { useEffect, useState } from 'react';
import api from '../utils/api';
import { Plus, Trash2, Edit2, Check, X, Wallet, Download, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import * as XLSX from 'xlsx';

const Salaries = () => {
    const [salaries, setSalaries] = useState([]);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [editId, setEditId] = useState(null);
    const [editMode, setEditMode] = useState({});
    
    // Pagination, Search & Delete Modal
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteTargetId, setDeleteTargetId] = useState(null);
    const itemsPerPage = 10;

    const fetchData = async () => {
        try {
            const res = await api.get('/salaries');
            setSalaries(res.data);
        } catch (error) {
            console.error('Failed to fetch data');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const addSalary = async (e) => {
        e.preventDefault();
        try {
            await api.post('/salaries', { amount, description, date });
            setAmount('');
            setDescription('');
            setDate(new Date().toISOString().split('T')[0]);
            fetchData();
        } catch (error) {
            alert('Failed to add salary');
        }
    };

    const triggerDelete = (id) => {
        setDeleteTargetId(id);
    };

    const confirmDelete = async () => {
        if (!deleteTargetId) return;
        try {
            await api.delete(`/salaries/${deleteTargetId}`);
            setDeleteTargetId(null);
            fetchData();
        } catch (error) {
            alert('Failed to delete salary');
        }
    };

    const updateSalary = async (id) => {
        try {
            const currentItem = editMode[id];
            await api.put(`/salaries/${id}`, { 
                amount: currentItem.amount,
                description: currentItem.description,
                date: currentItem.date
            });
            setEditId(null);
            fetchData();
        } catch (error) {
            alert('Failed to update salary');
        }
    };

    const handleEditChange = (id, field, value) => {
        setEditMode(prev => ({
            ...prev,
            [id]: { ...prev[id], [field]: value }
        }));
    };

    const startEdit = (sal) => {
        setEditId(sal._id);
        setEditMode(prev => ({
            ...prev,
            [sal._id]: { amount: sal.amount, description: sal.description, date: new Date(sal.date).toISOString().split('T')[0] }
        }));
    };

    const exportToExcel = () => {
        const exportData = salaries.map(sal => ({
            'Date': new Date(sal.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
            'Amount (৳)': sal.amount,
            'Description': sal.description || '-'
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Salaries_Log');
        XLSX.writeFile(workbook, 'Salaries_Report.xlsx');
    };

    const filteredSalaries = salaries.filter(sal => 
        (sal.description && sal.description.toLowerCase().includes(searchQuery.toLowerCase())) || 
        (sal.amount && sal.amount.toString().includes(searchQuery))
    );

    const totalPages = Math.ceil(filteredSalaries.length / itemsPerPage);
    const currentItems = filteredSalaries.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Income / Salaries</h1>
                    <p className="text-gray-500 mt-2 font-medium text-base md:text-lg">Add, update, or delete your income logs</p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                    {/* Search Bar */}
                    <div className="relative w-full sm:w-64 md:w-72">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search amount, note..."
                            className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-gray-100 ring-1 ring-gray-100 focus:ring-2 focus:ring-emerald-400 transition-all outline-none font-medium text-gray-800 placeholder:text-gray-400 shadow-[0_4px_20px_rgb(0,0,0,0.03)]"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                
                    <button 
                        onClick={exportToExcel}
                        disabled={salaries.length === 0}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-100/50 text-emerald-700 hover:bg-emerald-500 hover:text-white px-5 py-3 rounded-2xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm border border-emerald-200"
                    >
                        <Download className="w-5 h-5" />
                        Export Excel
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 mb-10 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-emerald-50/50 to-transparent pointer-events-none"></div>
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                        <Wallet className="w-6 h-6" />
                    </div>
                    New Income Record
                </h2>
                <form onSubmit={addSalary} className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
                    <div className="relative">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-gray-400">৳</span>
                        <input 
                            type="number" 
                            placeholder="Amount" 
                            className="w-full pl-10 pr-5 py-4 bg-gray-50 rounded-2xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none font-bold text-gray-800 placeholder:font-medium placeholder:text-gray-400 shadow-inner" 
                            value={amount} 
                            onChange={(e) => setAmount(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="md:col-span-2">
                        <input 
                            type="text" 
                            placeholder="Description (Optional)" 
                            className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none font-medium text-gray-800 placeholder:font-medium placeholder:text-gray-400 shadow-inner" 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                        />
                    </div>
                    <div className="md:col-span-1">
                        <input 
                            type="date" 
                            className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none font-medium text-gray-800 shadow-inner" 
                            value={date} 
                            onChange={(e) => setDate(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit" className="md:col-span-1 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white rounded-2xl font-bold flex items-center justify-center gap-2 py-4 transition-all shadow-lg shadow-emerald-500/30">
                        <Plus className="w-5 h-5" /> Add Income
                    </button>
                </form>
            </div>

            <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/80 border-b border-gray-100">
                            <tr>
                                <th className="px-8 py-5 font-bold text-xs text-gray-400 uppercase tracking-widest">Date</th>
                                <th className="px-8 py-5 font-bold text-xs text-gray-400 uppercase tracking-widest">Amount</th>
                                <th className="px-8 py-5 font-bold text-xs text-gray-400 uppercase tracking-widest">Description</th>
                                <th className="px-8 py-5 font-bold text-xs text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {currentItems.map((sal) => {
                                const isEditing = editId === sal._id;
                                const editState = editMode[sal._id] || {};
                                return (
                                <tr key={sal._id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-8 py-6 text-sm font-semibold text-gray-500">
                                        {isEditing ? (
                                            <input type="date" className="border-none ring-1 ring-emerald-500 bg-emerald-50 px-4 py-2 rounded-xl text-emerald-800 font-bold w-full outline-none" value={editState.date} onChange={(e) => handleEditChange(sal._id, 'date', e.target.value)} />
                                        ) : (
                                            new Date(sal.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
                                        )}
                                    </td>
                                    <td className="px-8 py-6">
                                        {isEditing ? (
                                            <input type="number" className="border-none ring-1 ring-emerald-500 bg-emerald-50 px-4 py-2 rounded-xl text-emerald-800 font-bold w-32 outline-none" value={editState.amount} onChange={(e) => handleEditChange(sal._id, 'amount', e.target.value)} />
                                        ) : (
                                            <span className="font-extrabold text-lg text-emerald-600">৳{sal.amount.toLocaleString()}</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6">
                                        {isEditing ? (
                                            <input type="text" className="border-none ring-1 ring-emerald-500 bg-emerald-50 px-4 py-2 rounded-xl text-emerald-800 font-medium w-full outline-none" value={editState.description} onChange={(e) => handleEditChange(sal._id, 'description', e.target.value)} />
                                        ) : (
                                            <span className="text-gray-700 font-medium">{sal.description || '-'}</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6 flex justify-end gap-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                        {isEditing ? (
                                            <>
                                                <button onClick={() => updateSalary(sal._id)} className="p-2.5 bg-green-50 text-green-600 hover:bg-green-500 hover:text-white rounded-xl transition-colors"><Check className="w-5 h-5" /></button>
                                                <button onClick={() => setEditId(null)} className="p-2.5 bg-gray-50 text-gray-400 hover:bg-gray-500 hover:text-white rounded-xl transition-colors"><X className="w-5 h-5" /></button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => startEdit(sal)} className="p-2.5 bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white rounded-xl transition-colors"><Edit2 className="w-4 h-4" /></button>
                                                <button onClick={() => triggerDelete(sal._id)} className="p-2.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-colors"><Trash2 className="w-4 h-4" /></button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            )})}
                            {currentItems.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-8 py-16 text-center text-gray-400 font-medium text-lg">
                                        {searchQuery ? 'No matching incomes found.' : 'No income recorded yet. Add some above!'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-8 py-5 border-t border-gray-100 bg-gray-50/50">
                        <span className="text-sm text-gray-500 font-medium">
                            Showing <span className="font-bold text-gray-800">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-gray-800">{Math.min(currentPage * itemsPerPage, filteredSalaries.length)}</span> of <span className="font-bold text-gray-800">{filteredSalaries.length}</span> results
                        </span>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <span className="px-4 py-2 rounded-lg bg-emerald-500 text-white font-bold text-sm shadow-sm">
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
                        <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Delete Income?</h3>
                        <p className="text-gray-500 font-medium mb-8">Are you certain you want to delete this specific log? This action cannot be reversed.</p>
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
export default Salaries;
