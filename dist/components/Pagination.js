import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ChevronLeft, ChevronRight } from 'lucide-react';
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1)
        return null;
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    return (_jsxs("div", { className: "flex items-center justify-center gap-2 mt-12 pb-8", children: [_jsx("button", { onClick: () => onPageChange(currentPage - 1), disabled: currentPage === 1, className: "p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all", "aria-label": "Previous page", children: _jsx(ChevronLeft, { className: "w-5 h-5" }) }), _jsx("div", { className: "flex items-center gap-2", children: pages.map((page) => (_jsx("button", { onClick: () => onPageChange(page), className: `w-10 h-10 rounded-xl text-sm font-bold transition-all ${currentPage === page
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                        : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-200 hover:text-indigo-600'}`, children: page }, page))) }), _jsx("button", { onClick: () => onPageChange(currentPage + 1), disabled: currentPage === totalPages, className: "p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all", "aria-label": "Next page", children: _jsx(ChevronRight, { className: "w-5 h-5" }) })] }));
};
export default Pagination;
