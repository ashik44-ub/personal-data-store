import { useEffect, useState } from 'react';
import api from '../utils/api';
import { Plus, Trash2, FolderPlus, Tags, Loader2 } from 'lucide-react';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [deleteTargetId, setDeleteTargetId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/categories');
            setCategories(res.data);
        } catch (error) {
            console.error('Failed to fetch categories');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const addCategory = async (e) => {
        e.preventDefault();
        try {
            await api.post('/categories', { name: newCategory });
            setNewCategory('');
            fetchCategories();
        } catch (error) {
            alert('Failed to add category');
        }
    };

    const triggerDelete = (id) => {
        setDeleteTargetId(id);
    };

    const confirmDelete = async () => {
        if (!deleteTargetId) return;
        try {
            await api.delete(`/categories/${deleteTargetId}`);
            setDeleteTargetId(null);
            fetchCategories();
        } catch (error) {
            alert('Failed to delete category');
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Categories</h1>
                    <p className="text-gray-500 mt-2 font-medium text-lg">Manage your classification labels for expenses</p>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden mb-10 relative">
               <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-indigo-50/50 to-transparent pointer-events-none"></div>
               <div className="p-8 border-b border-gray-50 bg-white relative z-10">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                            <FolderPlus className="w-6 h-6" />
                        </div>
                        Add New Category
                    </h2>
                    <form onSubmit={addCategory} className="flex flex-col sm:flex-row gap-4">
                        <input 
                            type="text" 
                            className="flex-1 px-6 py-4 bg-gray-50 rounded-2xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none font-bold text-gray-800 placeholder:font-medium placeholder:text-gray-400 shadow-inner" 
                            placeholder="e.g. Food, Transport, Utilities" 
                            value={newCategory} 
                            onChange={(e) => setNewCategory(e.target.value)} 
                            required 
                        />
                        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white px-8 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30">
                            <Plus className="w-5 h-5" /> Create
                        </button>
                    </form>
               </div>
               
               <div className="p-0 bg-gray-50/30">
                   {isLoading ? (
                       <div className="p-16 text-center">
                           <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mx-auto mb-4" />
                           <p className="text-gray-500 font-medium text-lg">Loading categories...</p>
                       </div>
                   ) : categories.length === 0 ? (
                       <div className="p-16 text-center text-gray-400 font-medium text-lg">No categories found. Start by creating one above.</div>
                   ) : (
                       <ul className="divide-y divide-gray-100">
                           {categories.map((cat) => (
                               <li key={cat._id} className="px-8 py-6 flex items-center justify-between hover:bg-white transition-all group border-l-4 border-transparent hover:border-indigo-500 hover:shadow-sm cursor-default">
                                   <div className="flex items-center gap-4">
                                       <div className="p-2 bg-indigo-50 rounded-lg text-indigo-400">
                                            <Tags className="w-5 h-5" />
                                       </div>
                                       <span className="font-bold text-gray-700 text-lg">{cat.name}</span>
                                   </div>
                                   <button 
                                       onClick={() => triggerDelete(cat._id)} 
                                       className="text-gray-400 hover:text-red-500 p-3 rounded-xl hover:bg-red-50 transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100"
                                       title="Delete category"
                                   >
                                       <Trash2 className="w-5 h-5" />
                                   </button>
                               </li>
                           ))}
                       </ul>
                   )}
               </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteTargetId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200 px-4">
                    <div className="bg-white p-6 rounded-[2rem] shadow-2xl w-full max-w-sm animate-in zoom-in-95 duration-300">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4 shadow-inner">
                            <Trash2 className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Delete Category?</h3>
                        <p className="text-gray-500 font-medium mb-8">Are you sure you want to remove this category? This action cannot be directly undone.</p>
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
export default Categories;
