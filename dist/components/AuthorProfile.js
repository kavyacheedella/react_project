import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Quote, Sparkles, BookOpen, ChevronDown, ChevronUp, Twitter, Globe } from 'lucide-react';
import { getFullAuthorBio, getAuthorQuote } from '../../services/geminiService';
import BookCard from './BookCard';
const AuthorProfile = ({ authorName, authorBooks, onBack, onAddToCart, onToggleWishlist, onQuickView, onPlayTrailer, wishlist }) => {
    const [bio, setBio] = useState(null);
    const [quote, setQuote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const fetchData = async () => {
            setLoading(true);
            const [bioRes, quoteRes] = await Promise.all([
                getFullAuthorBio(authorName),
                getAuthorQuote(authorName)
            ]);
            setBio(bioRes);
            setQuote(quoteRes);
            setLoading(false);
        };
        fetchData();
    }, [authorName]);
    // Logic to split bio into sentences and determine if it needs truncation
    const bioInfo = useMemo(() => {
        if (!bio)
            return { firstTwo: '', hasMore: false };
        // Split by sentence endings (. ! ?) followed by whitespace or end of string
        const sentences = bio.match(/[^.!?]+[.!?]+(?:\s|$)/g) || [bio];
        if (sentences.length <= 2) {
            return { firstTwo: bio, hasMore: false };
        }
        return {
            firstTwo: sentences.slice(0, 2).join('').trim(),
            hasMore: true
        };
    }, [bio]);
    return (_jsxs("div", { className: "animate-in fade-in duration-700", children: [_jsxs("section", { className: "bg-slate-900 text-white pt-24 pb-32 px-4 relative overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 opacity-20", children: _jsx("div", { className: "absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500 rounded-full blur-[150px] translate-x-1/2 -translate-y-1/2" }) }), _jsxs("div", { className: "max-w-7xl mx-auto relative z-10", children: [_jsxs("button", { onClick: onBack, className: "flex items-center gap-2 text-indigo-300 hover:text-white transition-colors mb-12 group", children: [_jsx(ArrowLeft, { className: "w-5 h-5 transition-transform group-hover:-translate-x-1" }), _jsx("span", { className: "font-bold", children: "Back to Library" })] }), _jsxs("div", { className: "flex flex-col md:flex-row gap-12 items-center md:items-start", children: [_jsx("div", { className: "w-48 h-48 md:w-64 md:h-64 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 flex-shrink-0 bg-slate-800", children: _jsx("img", { src: `https://picsum.photos/seed/${authorName}/600/600`, alt: authorName, className: "w-full h-full object-cover grayscale brightness-90 contrast-110" }) }), _jsxs("div", { className: "flex-grow text-center md:text-left", children: [_jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-bold uppercase tracking-widest mb-4", children: [_jsx(Sparkles, { className: "w-3 h-3" }), "Featured Author"] }), _jsx("h1", { className: "text-5xl md:text-7xl font-serif font-bold mb-6 tracking-tight", children: authorName }), loading ? (_jsxs("div", { className: "space-y-3 max-w-2xl", children: [_jsx("div", { className: "h-5 w-full bg-slate-800 rounded-lg animate-pulse" }), _jsx("div", { className: "h-5 w-[90%] bg-slate-800 rounded-lg animate-pulse" }), _jsx("div", { className: "h-5 w-[60%] bg-slate-800 rounded-lg animate-pulse" })] })) : (_jsxs("div", { className: "space-y-8 animate-reveal", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "text-xl text-slate-300 max-w-2xl leading-relaxed font-light", children: [_jsxs("p", { className: "transition-all duration-500 ease-in-out", children: [isExpanded ? bio : bioInfo.firstTwo, !isExpanded && bioInfo.hasMore && "..."] }), bioInfo.hasMore && (_jsx("button", { onClick: () => setIsExpanded(!isExpanded), className: "mt-4 flex items-center gap-1.5 text-sm font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors", children: isExpanded ? (_jsxs(_Fragment, { children: ["Read Less ", _jsx(ChevronUp, { className: "w-4 h-4" })] })) : (_jsxs(_Fragment, { children: ["Read More ", _jsx(ChevronDown, { className: "w-4 h-4" })] })) }))] }), _jsxs("div", { className: "relative py-6 px-8 bg-white/5 rounded-3xl border border-white/10 max-w-2xl group overflow-hidden", children: [_jsx("div", { className: "absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity", children: _jsx(Quote, { className: "w-20 h-20 rotate-12" }) }), _jsxs("p", { className: "text-2xl font-serif italic text-indigo-200 leading-snug mb-3", children: ["\"", quote, "\""] }), _jsxs("div", { className: "flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400", children: [_jsx("div", { className: "w-6 h-[1px] bg-slate-600" }), _jsxs("span", { children: ["\u2014 ", authorName] })] })] })] }), _jsxs("div", { className: "flex flex-wrap items-center justify-center md:justify-start gap-4", children: [_jsxs("a", { href: "#", target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center gap-2.5 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:border-indigo-400/50 transition-all group", children: [_jsx(Twitter, { className: "w-4 h-4 text-indigo-400" }), _jsx("span", { className: "text-sm font-medium text-slate-200 group-hover:text-white transition-colors", children: "Twitter" })] }), _jsxs("a", { href: "#", target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center gap-2.5 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:border-indigo-400/50 transition-all group", children: [_jsx(Globe, { className: "w-4 h-4 text-indigo-400" }), _jsx("span", { className: "text-sm font-medium text-slate-200 group-hover:text-white transition-colors", children: "Goodreads Profile" })] })] })] }))] })] })] })] }), _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20", children: _jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 bg-indigo-100 rounded-xl", children: _jsx(BookOpen, { className: "w-6 h-6 text-indigo-600" }) }), _jsx("h2", { className: "text-3xl font-serif font-bold text-slate-800", children: "Published Works" })] }), _jsxs("span", { className: "bg-white shadow-sm border border-slate-100 px-4 py-1.5 rounded-full text-slate-500 text-sm font-bold", children: [authorBooks.length, " ", authorBooks.length === 1 ? 'Book' : 'Books'] })] }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8", children: authorBooks.map((book) => (_jsx(BookCard, { book: book, isInWishlist: wishlist.some(item => item.id === book.id), onAddToCart: onAddToCart, onQuickView: onQuickView, onToggleWishlist: onToggleWishlist, onPlayTrailer: onPlayTrailer }, book.id))) })] }) }), _jsx("div", { className: "py-20" })] }));
};
export default AuthorProfile;
