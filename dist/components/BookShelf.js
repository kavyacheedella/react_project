import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import BookCard from './BookCard';
import { ChevronRight } from 'lucide-react';
const BookShelf = ({ title, subtitle, books, wishlist, onAddToCart, onQuickView, onToggleWishlist, onAuthorClick, onPlayTrailer }) => {
    if (books.length === 0)
        return null;
    return (_jsxs("section", { className: "py-16", children: [_jsxs("div", { className: "flex items-end justify-between mb-8 px-4 sm:px-0", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-3xl font-serif font-bold text-slate-800 mb-2", children: title }), _jsx("p", { className: "text-slate-500", children: subtitle })] }), _jsxs("button", { className: "hidden sm:flex items-center gap-2 text-indigo-600 font-bold hover:gap-3 transition-all", children: ["View All ", _jsx(ChevronRight, { className: "w-4 h-4" })] })] }), _jsx("div", { className: "flex overflow-x-auto pb-8 gap-6 no-scrollbar snap-x snap-mandatory", children: books.map((book) => (_jsx("div", { className: "w-[280px] flex-shrink-0 snap-start", children: _jsx(BookCard, { book: book, isInWishlist: wishlist.some(item => item.id === book.id), onAddToCart: onAddToCart, onQuickView: onQuickView, onToggleWishlist: onToggleWishlist, onAuthorClick: onAuthorClick, onPlayTrailer: onPlayTrailer }) }, book.id))) })] }));
};
export default BookShelf;
