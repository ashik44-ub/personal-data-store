import { useEffect, useState } from 'react';
import api from '../utils/api';
import { Plus, Trash2, Edit2, Check, X, Receipt, Download, Search, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import * as XLSX from 'xlsx';

const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [editId, setEditId] = useState(null);
    const [editMode, setEditMode] = useState({});

    // Pagination & Search & Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteTargetId, setDeleteTargetId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const itemsPerPage = 15;

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [expRes, catRes] = await Promise.all([
                api.get('/expenses'),
                api.get('/categories')
            ]);
            setExpenses(expRes.data);
            setCategories(catRes.data);
            if (catRes.data.length > 0 && !category) setCategory(catRes.data[0]._id);
        } catch (error) {
            console.error('Failed to fetch data');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const addExpense = async (e) => {
        e.preventDefault();
        if (!category) return alert('Please add a category first!');
        try {
            await api.post('/expenses', { amount, description, category, date });
            setAmount('');
            setDescription('');
            setDate(new Date().toISOString().split('T')[0]);
            fetchData();
        } catch (error) {
            alert('Failed to add expense');
        }
    };

    const triggerDelete = (id) => {
        setDeleteTargetId(id);
    };

    const confirmDelete = async () => {
        if (!deleteTargetId) return;
        try {
            await api.delete(`/expenses/${deleteTargetId}`);
            setDeleteTargetId(null);
            fetchData();
        } catch (error) {
            alert('Failed to delete expense');
        }
    };

    const updateExpense = async (id) => {
        try {
            const currentItem = editMode[id];
            await api.put(`/expenses/${id}`, {
                amount: currentItem.amount,
                description: currentItem.description,
                category: currentItem.category,
                date: currentItem.date
            });
            setEditId(null);
            fetchData();
        } catch (error) {
            alert('Failed to update expense');
        }
    };

    const handleEditChange = (id, field, value) => {
        setEditMode(prev => ({
            ...prev,
            [id]: { ...prev[id], [field]: value }
        }));
    };

    const startEdit = (exp) => {
        setEditId(exp._id);
        setEditMode(prev => ({
            ...prev,
            [exp._id]: { amount: exp.amount, description: exp.description, category: exp.category?._id, date: new Date(exp.date).toISOString().split('T')[0] }
        }));
    };

    const exportToExcel = () => {
        const exportData = filteredExpenses.map(exp => ({
            'Date': new Date(exp.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
            'Amount (৳)': exp.amount,
            'Description': exp.description || '-',
            'Category': exp.category?.name || 'N/A'
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Expenses_Log');
        XLSX.writeFile(workbook, 'Expenses_Report.xlsx');
    };

    const filteredExpenses = expenses
        .filter(exp => {
            const matchesSearch = (exp.description && exp.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (exp.category && exp.category.name && exp.category.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (exp.amount && exp.amount.toString().includes(searchQuery));
            const matchesCategory = filterCategory === '' || (exp.category && exp.category._id === filterCategory);

            // Date Filter
            let matchesDate = true;
            if (startDate || endDate) {
                const expDate = new Date(exp.date);
                expDate.setHours(0, 0, 0, 0);

                if (startDate) {
                    const start = new Date(startDate);
                    start.setHours(0, 0, 0, 0);
                    if (expDate < start) matchesDate = false;
                }

                if (endDate) {
                    const end = new Date(endDate);
                    end.setHours(0, 0, 0, 0);
                    if (expDate > end) matchesDate = false;
                }
            }

            return matchesSearch && matchesCategory && matchesDate;
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    const totalFilteredAmount = filteredExpenses.reduce((sum, item) => sum + item.amount, 0);

    const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
    const currentItems = filteredExpenses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Expenses</h1>
                    <p className="text-gray-500 mt-2 font-medium text-base md:text-lg">Add, update, or delete your categorized expenses</p>
                    {(searchQuery || filterCategory || startDate || endDate) && (
                        <div className="mt-4 inline-flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <span className="text-sm font-bold text-rose-500 uppercase tracking-wider mb-1">Filtered Total</span>
                            <span className="text-2xl font-black text-gray-800">৳{totalFilteredAmount.toLocaleString()}</span>
                        </div>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                    {/* Search Bar */}
                    <div className="relative w-full sm:w-64 md:w-72">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search amount, note, cat..."
                            className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-gray-100 ring-1 ring-gray-100 focus:ring-2 focus:ring-rose-400 transition-all outline-none font-medium text-gray-800 placeholder:text-gray-400 shadow-[0_4px_20px_rgb(0,0,0,0.03)]"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>

                    <div className="w-full sm:w-48">
                        <select
                            className="w-full px-4 py-3 bg-white rounded-2xl border border-gray-100 ring-1 ring-gray-100 focus:ring-2 focus:ring-rose-400 transition-all outline-none font-medium text-gray-800 shadow-[0_4px_20px_rgb(0,0,0,0.03)] appearance-none cursor-pointer"
                            value={filterCategory}
                            onChange={(e) => {
                                setFilterCategory(e.target.value);
                                setCurrentPage(1);
                            }}
                        >
                            <option value="">All Categories</option>
                            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                        </select>
                    </div>

                    <div className="flex items-center gap-2 w-full lg:w-auto">
                        <input
                            type="date"
                            className="w-full sm:w-auto px-4 py-3 bg-white rounded-2xl border border-gray-100 ring-1 ring-gray-100 focus:ring-2 focus:ring-rose-400 transition-all outline-none font-medium text-gray-800 shadow-[0_4px_20px_rgb(0,0,0,0.03)]"
                            value={startDate}
                            onChange={(e) => {
                                setStartDate(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                        <span className="text-gray-400 font-bold">to</span>
                        <input
                            type="date"
                            className="w-full sm:w-auto px-4 py-3 bg-white rounded-2xl border border-gray-100 ring-1 ring-gray-100 focus:ring-2 focus:ring-rose-400 transition-all outline-none font-medium text-gray-800 shadow-[0_4px_20px_rgb(0,0,0,0.03)]"
                            value={endDate}
                            onChange={(e) => {
                                setEndDate(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>

                    <button
                        onClick={exportToExcel}
                        disabled={expenses.length === 0}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-100/50 text-emerald-700 hover:bg-emerald-500 hover:text-white px-5 py-3 rounded-2xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm border border-emerald-200"
                    >
                        <Download className="w-5 h-5" />
                        Export
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 mb-10 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-rose-50/50 to-transparent pointer-events-none"></div>
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <div className="p-3 bg-rose-100 text-rose-600 rounded-xl">
                        <Receipt className="w-6 h-6" />
                    </div>
                    New Expense Record
                </h2>
                <form onSubmit={addExpense} className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
                    <div className="relative md:col-span-1">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-gray-400">৳</span>
                        <input
                            type="number"
                            placeholder="Amount"
                            className="w-full pl-10 pr-5 py-4 bg-gray-50 rounded-2xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all outline-none font-bold text-gray-800 placeholder:font-medium placeholder:text-gray-400 shadow-inner"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                    </div>
                    <div className="md:col-span-2">
                        <input
                            type="text"
                            placeholder="Description (Optional)"
                            className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all outline-none font-medium text-gray-800 placeholder:font-medium placeholder:text-gray-400 shadow-inner"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div className="md:col-span-1">
                        <select
                            className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all outline-none font-bold text-gray-700 shadow-inner appearance-none"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        >
                            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                            {categories.length === 0 && <option value="" disabled>No categories</option>}
                        </select>
                    </div>
                    <div className="md:col-span-1">
                        <input
                            type="date"
                            className="w-full px-4 py-4 bg-gray-50 rounded-2xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all outline-none font-medium text-gray-800 shadow-inner"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className="md:col-span-1">
                        <button type="submit" className="w-full h-full bg-rose-500 hover:bg-rose-600 active:scale-95 text-white rounded-2xl font-bold flex items-center justify-center gap-2 py-4 transition-all shadow-lg shadow-rose-500/30">
                            <Plus className="w-5 h-5" /> Add
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gradient-to-r from-rose-50/40 via-white to-rose-50/40 border-b border-rose-100/60 backdrop-blur-md">
                            <tr>
                                <th className="px-8 py-5 font-bold text-[11px] text-rose-400 uppercase tracking-[0.2em]">Date</th>
                                <th className="px-8 py-5 font-bold text-[11px] text-rose-400 uppercase tracking-[0.2em]">Amount</th>
                                <th className="px-8 py-5 font-bold text-[11px] text-rose-400 uppercase tracking-[0.2em]">Description</th>
                                <th className="px-8 py-5 font-bold text-[11px] text-rose-400 uppercase tracking-[0.2em]">Category</th>
                                <th className="px-8 py-5 font-bold text-[11px] text-rose-400 uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100/50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-16 text-center">
                                        <Loader2 className="w-10 h-10 animate-spin text-rose-500 mx-auto mb-4" />
                                        <p className="text-gray-500 font-medium text-lg">Loading expenses...</p>
                                    </td>
                                </tr>
                            ) : currentItems.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-16 text-center text-gray-400 font-medium text-lg">
                                        {searchQuery ? 'No matching expenses found.' : 'No expenses recorded yet.'}
                                    </td>
                                </tr>
                            ) : (
                                currentItems.map((exp) => {
                                    const isEditing = editId === exp._id;
                                    const editState = editMode[exp._id] || {};
                                    return (
                                        <tr key={exp._id} className="hover:bg-gradient-to-r hover:from-white hover:to-rose-50/20 hover:shadow-[0_4px_30px_rgb(0,0,0,0.02)] transition-all duration-300 group">
                                            <td className="px-8 py-6 text-sm font-bold text-gray-600/90">
                                                {isEditing ? (
                                                    <input type="date" className="border-none ring-1 ring-rose-500 bg-rose-50 px-4 py-2 rounded-xl text-rose-800 font-bold w-full outline-none" value={editState.date} onChange={(e) => handleEditChange(exp._id, 'date', e.target.value)} />
                                                ) : (
                                                    new Date(exp.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
                                                )}
                                            </td>
                                            <td className="px-8 py-6">
                                                {isEditing ? (
                                                    <input type="number" className="border-none ring-1 ring-rose-500 bg-rose-50 px-4 py-2 rounded-xl text-rose-800 font-bold w-32 outline-none" value={editState.amount} onChange={(e) => handleEditChange(exp._id, 'amount', e.target.value)} />
                                                ) : (
                                                    <span className="inline-flex items-center px-4 py-1.5 rounded-xl bg-rose-50/80 border border-rose-100 shadow-sm font-black text-[15px] text-rose-600 tracking-tight">৳{exp.amount.toLocaleString()}</span>
                                                )}
                                            </td>
                                            <td className="px-8 py-6">
                                                {isEditing ? (
                                                    <input type="text" className="border-none ring-1 ring-rose-500 bg-rose-50 px-4 py-2 rounded-xl text-rose-800 font-medium w-full outline-none" value={editState.description} onChange={(e) => handleEditChange(exp._id, 'description', e.target.value)} />
                                                ) : (
                                                    <span className="text-gray-700 font-medium">{exp.description || '-'}</span>
                                                )}
                                            </td>
                                            <td className="px-8 py-6">
                                                {isEditing ? (
                                                    <select className="border-none ring-1 ring-rose-500 bg-rose-50 px-4 py-2 rounded-xl text-rose-800 font-bold max-w-xs outline-none" value={editState.category} onChange={(e) => handleEditChange(exp._id, 'category', e.target.value)}>
                                                        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                                    </select>
                                                ) : (
                                                    <span className="bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-black tracking-widest uppercase shadow-[0_2px_10px_rgb(0,0,0,0.02)]">{exp.category?.name || 'N/A'}</span>
                                                )}
                                            </td>
                                            <td className="px-8 py-6 flex justify-end gap-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                                {isEditing ? (
                                                    <>
                                                        <button onClick={() => updateExpense(exp._id)} className="p-2.5 bg-green-50 text-green-600 hover:bg-green-500 hover:text-white rounded-xl transition-colors"><Check className="w-5 h-5" /></button>
                                                        <button onClick={() => setEditId(null)} className="p-2.5 bg-gray-50 text-gray-400 hover:bg-gray-500 hover:text-white rounded-xl transition-colors"><X className="w-5 h-5" /></button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button onClick={() => startEdit(exp)} className="p-2.5 bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white rounded-xl transition-colors"><Edit2 className="w-4 h-4" /></button>
                                                        <button onClick={() => triggerDelete(exp._id)} className="p-2.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-colors"><Trash2 className="w-4 h-4" /></button>
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
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-8 py-5 border-t border-gray-100 bg-gray-50/50">
                        <span className="text-sm text-gray-500 font-medium">
                            Showing <span className="font-bold text-gray-800">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-gray-800">{Math.min(currentPage * itemsPerPage, filteredExpenses.length)}</span> of <span className="font-bold text-gray-800">{filteredExpenses.length}</span> results
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <span className="px-4 py-2 rounded-lg bg-rose-500 text-white font-bold text-sm shadow-sm">
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
                        <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Delete Expense?</h3>
                        <p className="text-gray-500 font-medium mb-8">Are you certain you want to delete this expense log? This action cannot be reversed.</p>
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
export default Expenses;
