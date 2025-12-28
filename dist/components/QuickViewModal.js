import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { X, Star, ShoppingCart, Sparkles, Loader2 } from 'lucide-react';
import { getBookSummary } from '../../services/geminiService';
const QuickViewModal = ({ book, onClose, onAddToCart }) => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (book) {
            setLoading(true);
            getBookSummary(book.title).then((res) => {
                setSummary(res);
                setLoading(false);
            });
        }
        else {
            setSummary(null);
        }
    }, [book]);
    if (!book)
        return null;
    return (_jsxs("div", { className: "fixed inset-0 z-[100] flex items-center justify-center p-4", children: [_jsx("div", { className: "absolute inset-0 bg-slate-900/60 backdrop-blur-md", onClick: onClose }), _jsxs("div", { className: "relative bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in fade-in zoom-in duration-300", children: [_jsx("button", { onClick: onClose, className: "absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur rounded-full hover:bg-white shadow-md transition-colors", children: _jsx(X, { className: "w-6 h-6 text-slate-800" }) }), _jsx("div", { className: "md:w-5/12 bg-slate-100 flex items-center justify-center p-8", children: _jsx("div", { className: "w-full aspect-[2/3] max-w-[300px] shadow-2xl rounded-xl overflow-hidden group", children: _jsx("img", { src: book.coverImage, alt: book.title, className: "w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" }) }) }), _jsxs("div", { className: "md:w-7/12 p-8 md:p-12 overflow-y-auto max-h-[80vh] md:max-h-none", children: [_jsxs("div", { className: "mb-8", children: [_jsx("span", { className: "text-indigo-600 font-bold text-xs uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded-md mb-4 inline-block", children: book.category }), _jsx("h2", { className: "text-4xl font-serif font-bold text-slate-800 mb-2 leading-tight", children: book.title }), _jsxs("p", { className: "text-xl text-slate-500 font-medium", children: ["by ", book.author] })] }), _jsxs("div", { className: "flex items-center gap-6 mb-8", children: [_jsxs("div", { className: "flex items-center gap-1 text-amber-500", children: [[...Array(5)].map((_, i) => (_jsx(Star, { className: `w-5 h-5 ${i < Math.floor(book.rating) ? 'fill-current' : 'text-slate-200'}` }, i))), _jsx("span", { className: "ml-2 text-slate-800 font-bold", children: book.rating })] }), _jsx("div", { className: "h-4 w-[1px] bg-slate-200" }), _jsxs("span", { className: "text-2xl font-bold text-indigo-600", children: ["$", book.price.toFixed(2)] })] }), _jsxs("div", { className: "space-y-6 mb-10", children: [_jsxs("div", { children: [_jsx("h4", { className: "text-xs font-bold text-slate-400 uppercase tracking-widest mb-3", children: "Description" }), _jsx("p", { className: "text-slate-600 leading-relaxed", children: book.description })] }), _jsxs("div", { className: "p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100/50", children: [_jsxs("div", { className: "flex items-center gap-2 mb-3", children: [_jsx(Sparkles, { className: "w-4 h-4 text-indigo-600" }), _jsx("h4", { className: "text-xs font-bold text-indigo-600 uppercase tracking-widest", children: "AI Literary Insight" })] }), loading ? (_jsxs("div", { className: "flex items-center gap-3 text-slate-400", children: [_jsx(Loader2, { className: "w-4 h-4 animate-spin" }), _jsx("span", { className: "text-sm italic", children: "Analyzing literary themes..." })] })) : (_jsxs("p", { className: "text-slate-700 text-sm italic leading-relaxed", children: ["\"", summary, "\""] }))] })] }), _jsxs("button", { onClick: () => onAddToCart(book), className: "w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 active:scale-[0.98]", children: [_jsx(ShoppingCart, { className: "w-5 h-5" }), "Add to Cart"] })] })] })] }));
};
export default QuickViewModal;
