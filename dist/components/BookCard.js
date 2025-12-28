import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Star, Plus, Eye, Heart, Sparkles, Loader2, ShoppingCart, Share2, Check, Percent, Play } from 'lucide-react';
import { getAuthorBio, getBookSummary } from '../../services/geminiService';
const BookCard = ({ book, isInWishlist, onAddToCart, onQuickView, onToggleWishlist, onAuthorClick, onPlayTrailer }) => {
    const [authorBio, setAuthorBio] = useState(null);
    const [literaryAnalysis, setLiteraryAnalysis] = useState(null);
    const [loadingAnalysis, setLoadingAnalysis] = useState(false);
    const [isBumping, setIsBumping] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    useEffect(() => {
        let isMounted = true;
        // Add a small staggered delay based on book ID or random to prevent bulk request bursts
        const staggerDelay = Math.random() * 800;
        const timeoutId = setTimeout(async () => {
            if (!isMounted)
                return;
            // Fetch Author Bio
            getAuthorBio(book.author).then(bio => {
                if (isMounted)
                    setAuthorBio(bio);
            });
            // Fetch Literary Analysis
            setLoadingAnalysis(true);
            getBookSummary(book.title).then(analysis => {
                if (isMounted) {
                    setLiteraryAnalysis(analysis || null);
                    setLoadingAnalysis(false);
                }
            });
        }, staggerDelay);
        return () => {
            isMounted = false;
            clearTimeout(timeoutId);
        };
    }, [book.author, book.title]);
    const handleAddToCart = () => {
        onAddToCart(book);
        setIsBumping(true);
        setTimeout(() => setIsBumping(false), 300);
    };
    const handleShare = async (e) => {
        e.stopPropagation();
        const shareData = {
            title: `Check out ${book.title} by ${book.author} on Lumina`,
            text: book.description,
            url: window.location.href, // In a real app, this would be the book's specific URL
        };
        if (navigator.share) {
            try {
                await navigator.share(shareData);
            }
            catch (err) {
                console.error('Error sharing:', err);
            }
        }
        else {
            // Fallback: Copy to clipboard
            try {
                await navigator.clipboard.writeText(`${shareData.title}\n${shareData.url}`);
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            }
            catch (err) {
                console.error('Failed to copy text: ', err);
            }
        }
    };
    // Helper to render star rating
    const renderStars = (rating) => {
        return (_jsx("div", { className: "flex items-center gap-0.5 text-amber-500", "aria-hidden": "true", children: [1, 2, 3, 4, 5].map((star) => (_jsx(Star, { className: `w-3 h-3 ${star <= Math.round(rating) ? 'fill-current' : 'text-slate-200'}` }, star))) }));
    };
    return (_jsxs("article", { className: "group relative bg-white rounded-2xl p-4 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-slate-100 overflow-hidden flex flex-col h-full focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2", "aria-labelledby": `book-title-${book.id}`, children: [_jsxs("div", { className: "relative aspect-[2/3] overflow-hidden rounded-xl bg-slate-100 mb-4 flex-shrink-0", children: [_jsx("img", { src: book.coverImage, alt: `Cover of ${book.title} by ${book.author}`, className: "w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" }), _jsx("button", { onClick: (e) => {
                            e.stopPropagation();
                            onToggleWishlist(book);
                        }, "aria-label": isInWishlist ? `Remove ${book.title} from saved items` : `Save ${book.title} for later`, "aria-pressed": isInWishlist, className: `absolute top-3 right-3 z-30 p-2 rounded-full backdrop-blur-md shadow-lg transition-all duration-300 hover:scale-110 active:scale-90 focus:outline-none focus:ring-2 focus:ring-rose-500 ${isInWishlist
                            ? 'bg-rose-500 text-white'
                            : 'bg-white/90 text-slate-500 hover:text-rose-500'}`, children: _jsx(Heart, { className: `w-4 h-4 ${isInWishlist ? 'fill-current' : ''}` }) }), _jsxs("button", { onClick: handleShare, "aria-label": `Share ${book.title}`, className: `absolute top-3 right-14 z-30 p-2 rounded-full backdrop-blur-md shadow-lg transition-all duration-300 hover:scale-110 active:scale-90 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isCopied
                            ? 'bg-emerald-500 text-white'
                            : 'bg-white/90 text-slate-500 hover:text-indigo-600'}`, children: [isCopied ? _jsx(Check, { className: "w-4 h-4" }) : _jsx(Share2, { className: "w-4 h-4" }), isCopied && (_jsx("span", { className: "absolute -bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap animate-in fade-in slide-in-from-top-1", children: "Link Copied!" }))] }), book.trailerThumb && (_jsx("button", { onClick: (e) => {
                            e.stopPropagation();
                            onPlayTrailer?.(book);
                        }, className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-md border border-white/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-indigo-600 hover:scale-110 hover:border-indigo-400 shadow-2xl", title: "Watch Trailer", children: _jsx(Play, { className: "w-5 h-5 fill-current" }) })), _jsxs("div", { className: "absolute top-3 left-3 z-20 flex flex-col gap-1", children: [book.isNew && (_jsx("span", { className: "bg-indigo-600 text-white text-[9px] font-black px-2 py-1 rounded-md shadow-lg tracking-widest uppercase", children: "New Arrival" })), book.discountPercentage && (_jsxs("span", { className: "bg-rose-500 text-white text-[9px] font-black px-2 py-1 rounded-md shadow-lg tracking-widest uppercase flex items-center gap-1", children: [_jsx(Percent, { className: "w-2.5 h-2.5" }), book.discountPercentage, "% OFF"] }))] }), _jsxs("div", { className: "absolute inset-0 bg-slate-900/60 backdrop-blur-[3px] opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-500 flex flex-col justify-end p-5 translate-y-4 group-hover:translate-y-0 group-focus-within:translate-y-0 z-10", children: [_jsxs("div", { className: "mb-4 space-y-2 transform translate-y-4 group-hover:translate-y-0 group-focus-within:translate-y-0 transition-transform duration-500 delay-75", children: [_jsx("span", { className: "text-[10px] text-white font-bold uppercase tracking-widest opacity-80", children: "Sneak Peek" }), _jsxs("p", { className: "text-white text-xs leading-relaxed line-clamp-3 italic font-light", children: ["\"", book.description, "\""] })] }), _jsxs("div", { className: "flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 group-focus-within:translate-y-0 transition-transform duration-500 delay-150", children: [_jsxs("button", { onClick: () => onQuickView(book), "aria-label": `View details of ${book.title}`, className: "flex-1 flex items-center justify-center gap-2 py-2.5 bg-white text-slate-900 rounded-xl hover:bg-indigo-50 transition-colors shadow-xl text-[11px] font-black uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900 animate-pop", children: [_jsx(Eye, { className: "w-3.5 h-3.5", "aria-hidden": "true" }), "Details"] }), _jsx("button", { onClick: handleAddToCart, "aria-label": `Quick add ${book.title} to cart`, className: `p-2.5 rounded-xl shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${isBumping ? 'scale-110 bg-emerald-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`, children: isBumping ? _jsx(Loader2, { className: "w-5 h-5 animate-spin" }) : _jsx(Plus, { className: "w-5 h-5", "aria-hidden": "true" }) })] })] })] }), _jsxs("div", { className: "space-y-2 flex-grow flex flex-col", children: [_jsxs("div", { className: "flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-[0.1em]", children: [_jsx("span", { className: "bg-slate-100 px-2 py-0.5 rounded-md", children: book.category }), _jsxs("div", { className: "flex items-center gap-2", "aria-label": `Rating: ${book.rating} out of 5 stars`, children: [renderStars(book.rating), _jsx("span", { className: "text-slate-600", children: book.rating })] })] }), _jsx("h3", { id: `book-title-${book.id}`, className: "text-base font-bold text-slate-800 line-clamp-1 leading-tight transition-colors group-hover:text-indigo-600", children: book.title }), _jsxs("div", { className: "space-y-1", children: [_jsx("button", { onClick: () => onAuthorClick?.(book.author), "aria-label": `View more books by ${book.author}`, className: "text-sm text-slate-600 font-medium hover:text-indigo-600 hover:underline transition-colors text-left focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded", children: book.author }), authorBio ? (_jsx("p", { className: "text-[10px] text-slate-500 italic line-clamp-1 leading-tight animate-in fade-in duration-700", children: authorBio })) : (_jsx("div", { className: "h-2 w-20 bg-slate-100 rounded animate-pulse mt-1", "aria-hidden": "true" }))] }), _jsxs("div", { className: "mt-2 p-2.5 bg-indigo-50/40 rounded-xl border border-indigo-100/50 flex-grow", "aria-live": "polite", children: [_jsxs("div", { className: "flex items-center gap-1.5 mb-1 text-indigo-700", children: [_jsx(Sparkles, { className: "w-3 h-3", "aria-hidden": "true" }), _jsx("span", { className: "text-[9px] font-black uppercase tracking-wider", children: "AI Insight" })] }), loadingAnalysis ? (_jsxs("div", { className: "flex items-center gap-2 py-1", children: [_jsx(Loader2, { className: "w-3 h-3 animate-spin text-indigo-400" }), _jsx("div", { className: "h-1.5 w-full bg-indigo-100/50 rounded animate-pulse" })] })) : (_jsx("p", { className: "text-[10px] text-slate-700 leading-snug line-clamp-3 animate-in fade-in duration-500", children: literaryAnalysis || "Analysis unavailable." }))] }), _jsxs("div", { className: "pt-3 flex items-center justify-between mt-auto", children: [_jsxs("div", { className: "flex flex-col", children: [_jsxs("span", { className: "text-lg font-bold text-slate-900", children: ["$", book.price.toFixed(2)] }), book.oldPrice && (_jsxs("span", { className: "text-[10px] text-slate-400 line-through", children: ["$", book.oldPrice.toFixed(2)] }))] }), _jsxs("button", { onClick: handleAddToCart, "aria-label": isBumping ? `${book.title} added to cart` : `Add ${book.title} to cart`, className: `text-[10px] font-black tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg p-1 -m-1 ${isBumping ? 'text-emerald-600 scale-105' : 'text-indigo-600 hover:text-indigo-800'}`, children: [isBumping ? _jsx(Loader2, { className: "w-3 h-3 animate-spin" }) : _jsx(ShoppingCart, { className: "w-3 h-3", "aria-hidden": "true" }), isBumping ? 'Added' : 'Add to Cart'] })] })] })] }));
};
export default BookCard;
