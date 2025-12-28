import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import BookCard from './components/BookCard';
import BookShelf from './components/BookShelf';
import HomeSlider from './components/HomeSlider';
import AuthorGrid from './components/AuthorGrid';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import QuickViewModal from './components/QuickViewModal';
import AIRecommendationSection from './components/AIRecommendationSection';
import CategoryGrid from './components/CategoryGrid';
import GenrePage from './components/GenrePage';
import AuthorSpotlight from './components/AuthorSpotlight';
import AuthorProfile from './components/AuthorProfile';
import Newsletter from './components/Newsletter';
import Toast from './components/Toast';
import Pagination from './components/Pagination';
import AccountModal from './components/AccountModal';
import BookTrailers from './components/BookTrailers';
import { MOCK_BOOKS, BOOKS_PER_PAGE } from './constants';
import { getRandomLiteraryQuote } from '../services/geminiService';
// Added BookOpen to the lucide-react imports to fix line 632 error
import { Sparkles, ArrowRight, ArrowUpDown, Twitter, Instagram, Linkedin, Facebook, HelpCircle, Zap, ShieldCheck, Rocket, Quote as QuoteIcon, SlidersHorizontal, Filter, Target, Brain, Users, Percent, X, Clapperboard, MapPin, Mail, Phone, Clock, Library, MousePointer2, TrendingUp, BookOpen } from 'lucide-react';
const HERO_TITLES = [
    "Where Stories Find Their Home",
    "Your Next Great Adventure Awaits",
    "A Sanctuary for Every Reader",
    "Discover the Power of Words"
];
const App = () => {
    const [view, setView] = useState('HOME');
    const [cart, setCart] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isWishlistOpen, setIsWishlistOpen] = useState(false);
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState('default');
    const [viewingBook, setViewingBook] = useState(null);
    const [selectedAuthor, setSelectedAuthor] = useState(null);
    const [toastMessage, setToastMessage] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [heroQuote, setHeroQuote] = useState({ text: "A room without books is like a body without a soul.", author: "Cicero" });
    const [isQuoteVisible, setIsQuoteVisible] = useState(true);
    // Rotating Hero Title
    const [heroTitleIndex, setHeroTitleIndex] = useState(0);
    const [isTitleFading, setIsTitleFading] = useState(false);
    // Trailer Global State
    const [activeTrailer, setActiveTrailer] = useState(null);
    const [isGeneratingTrailer, setIsGeneratingTrailer] = useState(false);
    // Curated Lists
    const newArrivals = useMemo(() => MOCK_BOOKS.filter(b => b.isNew), []);
    const bestsellers = useMemo(() => MOCK_BOOKS.filter(b => b.rating >= 4.7), []);
    const uniqueAuthors = useMemo(() => Array.from(new Set(MOCK_BOOKS.map(b => b.author))), []);
    const flashSaleBooks = useMemo(() => MOCK_BOOKS.filter(b => b.discountPercentage).slice(0, 8), []);
    // Filter and Sort books
    const processedBooks = useMemo(() => {
        let filtered = MOCK_BOOKS.filter((book) => {
            const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                book.author.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
        if (sortBy === 'price-asc') {
            filtered = [...filtered].sort((a, b) => a.price - b.price);
        }
        else if (sortBy === 'price-desc') {
            filtered = [...filtered].sort((a, b) => b.price - a.price);
        }
        return filtered;
    }, [searchQuery, selectedCategory, sortBy]);
    // Books by selected author
    const authorBooks = useMemo(() => {
        if (!selectedAuthor)
            return [];
        return MOCK_BOOKS.filter(book => book.author === selectedAuthor);
    }, [selectedAuthor]);
    // Reset to page 1 when filters or sort change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedCategory, sortBy]);
    // Rotating Hero Title Effect (1 minute)
    useEffect(() => {
        const titleInterval = setInterval(() => {
            setIsTitleFading(true);
            setTimeout(() => {
                setHeroTitleIndex((prev) => (prev + 1) % HERO_TITLES.length);
                setIsTitleFading(false);
            }, 500);
        }, 60000);
        return () => clearInterval(titleInterval);
    }, []);
    // Hero Quotes rotation (60 seconds)
    useEffect(() => {
        const fetchNewQuote = async () => {
            setIsQuoteVisible(false);
            setTimeout(async () => {
                const newQuote = await getRandomLiteraryQuote();
                setHeroQuote(newQuote);
                setIsQuoteVisible(true);
            }, 500);
        };
        const interval = setInterval(fetchNewQuote, 60000);
        return () => clearInterval(interval);
    }, []);
    const totalPages = Math.ceil(processedBooks.length / BOOKS_PER_PAGE);
    const paginatedBooks = useMemo(() => {
        const start = (currentPage - 1) * BOOKS_PER_PAGE;
        return processedBooks.slice(start, start + BOOKS_PER_PAGE);
    }, [processedBooks, currentPage]);
    const addToCart = (book) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === book.id);
            if (existing) {
                return prev.map((item) => item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...book, quantity: 1 }];
        });
        setToastMessage(`"${book.title}" added to your collection.`);
    };
    const toggleWishlist = (book) => {
        setWishlist((prev) => {
            const isSaved = prev.some((item) => item.id === book.id);
            if (isSaved) {
                setToastMessage(`Removed "${book.title}" from saved items.`);
                return prev.filter((item) => item.id !== book.id);
            }
            else {
                setToastMessage(`Saved "${book.title}" for later.`);
                return [...prev, book];
            }
        });
    };
    const moveFromWishlistToCart = (book) => {
        addToCart(book);
        toggleWishlist(book);
    };
    const updateQuantity = (id, delta) => {
        setCart((prev) => prev.map((item) => item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item).filter(item => item.quantity > 0));
    };
    const removeFromCart = (id) => {
        setCart((prev) => prev.filter((item) => item.id !== id));
    };
    const handlePageChange = (page) => {
        setCurrentPage(page);
        const element = document.getElementById('collection-start');
        if (element) {
            window.scrollTo({ top: element.offsetTop - 100, behavior: 'smooth' });
        }
    };
    const handleAuthorClick = (authorName) => {
        setSelectedAuthor(authorName);
        setView('AUTHOR_PROFILE');
    };
    const handleGenreSelect = (genre) => {
        setSelectedCategory(genre);
        setToastMessage(`Filtering library for ${genre}...`);
    };
    const handleGenrePageNavigate = (genre) => {
        setSelectedCategory(genre);
        setView('GENRE_PAGE');
    };
    const handleLearnMore = () => {
        const element = document.getElementById('mission-section');
        element?.scrollIntoView({ behavior: 'smooth' });
    };
    const handleExploreNow = () => {
        const element = document.getElementById('collection-start');
        element?.scrollIntoView({ behavior: 'smooth' });
    };
    const handleGenerateTrailer = () => {
        setIsGeneratingTrailer(true);
        setTimeout(() => {
            setIsGeneratingTrailer(false);
            setToastMessage("AI Trailer generated successfully! Scroll through our gallery to see it.");
        }, 3000);
    };
    const renderContent = () => {
        if (selectedAuthor && view === 'AUTHOR_PROFILE') {
            return (_jsx(AuthorProfile, { authorName: selectedAuthor, authorBooks: authorBooks, onBack: () => {
                    setSelectedAuthor(null);
                    setView('HOME');
                }, onAddToCart: addToCart, onToggleWishlist: toggleWishlist, onQuickView: setViewingBook, onPlayTrailer: setActiveTrailer, wishlist: wishlist }));
        }
        if (view === 'GENRE_PAGE') {
            return (_jsx(GenrePage, { genre: selectedCategory, books: processedBooks, onBack: () => setView('HOME'), onAddToCart: addToCart, onToggleWishlist: toggleWishlist, onQuickView: setViewingBook, onPlayTrailer: setActiveTrailer, wishlist: wishlist }));
        }
        return (_jsxs(_Fragment, { children: [_jsxs("section", { className: "bg-[#0f172a] text-white pt-24 pb-40 px-4 relative overflow-hidden", children: [_jsxs("div", { className: "absolute inset-0 opacity-20 pointer-events-none", children: [_jsx("div", { className: "absolute top-0 left-0 w-[800px] h-[800px] bg-indigo-500 rounded-full blur-[180px] -translate-x-1/2 -translate-y-1/2 animate-pulse" }), _jsx("div", { className: "absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-500 rounded-full blur-[180px] translate-x-1/2 translate-y-1/2 opacity-60" }), _jsx("div", { className: "absolute top-1/2 left-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" })] }), _jsxs("div", { className: "max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-16 items-center", children: [_jsxs("div", { className: "text-left space-y-8", children: [_jsxs("div", { className: "inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 backdrop-blur-md border border-indigo-400/30 text-indigo-200 text-xs font-black uppercase tracking-[0.2em] mb-4", children: [_jsx(Sparkles, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Powered by Lumina AI v3.5" })] }), _jsx("div", { className: `transition-all duration-700 transform ${isTitleFading ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'}`, children: _jsx("h1", { className: "text-6xl md:text-8xl font-serif font-bold leading-[1.05] tracking-tight", children: HERO_TITLES[heroTitleIndex].split(' ').map((word, i, arr) => (_jsxs("span", { className: i > 1 ? "text-indigo-400 block md:inline" : "", children: [word, ' '] }, i))) }) }), _jsx("div", { className: `transition-all duration-1000 transform ${isQuoteVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`, children: _jsxs("div", { className: "flex gap-4 max-w-xl", children: [_jsx(QuoteIcon, { className: "w-8 h-8 text-indigo-500 opacity-50 shrink-0" }), _jsxs("div", { children: [_jsxs("p", { className: "text-xl md:text-2xl text-slate-300 leading-relaxed font-light italic mb-3", children: ["\"", heroQuote.text, "\""] }), _jsxs("p", { className: "text-indigo-400 text-xs font-black uppercase tracking-widest", children: ["\u2014 ", heroQuote.author] })] })] }) }), _jsxs("div", { className: "flex flex-wrap items-center gap-6 pt-4", children: [_jsxs("button", { onClick: handleExploreNow, className: "px-12 py-5 bg-indigo-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-500/20 active:scale-95 flex items-center gap-3", children: [_jsx(Library, { className: "w-4 h-4" }), "Enter Library"] }), _jsxs("button", { onClick: handleLearnMore, className: "px-10 py-5 bg-white/5 backdrop-blur-md text-white font-bold rounded-2xl border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2 group", children: ["Our Philosophy ", _jsx(ArrowRight, { className: "w-5 h-5 group-hover:translate-x-1 transition-transform" })] })] })] }), _jsxs("div", { className: "hidden lg:block relative", children: [_jsxs("div", { className: "bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-10 shadow-2xl relative z-10 overflow-hidden group", children: [_jsx("div", { className: "absolute top-0 right-0 p-8 opacity-5", children: _jsx(Brain, { className: "w-48 h-48" }) }), _jsxs("div", { className: "flex items-center gap-4 mb-10", children: [_jsx("div", { className: "w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl", children: _jsx(TrendingUp, { className: "w-8 h-8 text-white" }) }), _jsxs("div", { children: [_jsx("h4", { className: "text-xl font-bold", children: "Lumina Spotlight" }), _jsx("p", { className: "text-indigo-300 text-xs font-black uppercase tracking-widest", children: "Trending Insights" })] })] }), _jsx("div", { className: "space-y-6", children: MOCK_BOOKS.slice(0, 3).map((book, idx) => (_jsxs("div", { className: "flex gap-4 items-center group/item cursor-pointer", onClick: () => setViewingBook(book), children: [_jsx("div", { className: "w-16 h-20 rounded-xl overflow-hidden bg-slate-800 shadow-lg", children: _jsx("img", { src: book.coverImage, className: "w-full h-full object-cover grayscale group-hover/item:grayscale-0 transition-all" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h5", { className: "font-bold text-sm group-hover/item:text-indigo-400 transition-colors", children: book.title }), _jsx("p", { className: "text-[10px] text-slate-400", children: book.author })] }), _jsx(MousePointer2, { className: "w-4 h-4 text-white opacity-0 group-hover/item:opacity-100 transition-opacity" })] }, idx))) }), _jsx("div", { className: "mt-10 pt-8 border-t border-white/5 text-center", children: _jsx("p", { className: "text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400", children: "Join 12k+ Active Readers" }) })] }), _jsx("div", { className: "absolute -top-12 -right-12 w-32 h-32 bg-indigo-600/30 rounded-full blur-3xl animate-bounce duration-[5s]" }), _jsx("div", { className: "absolute -bottom-8 -left-8 w-24 h-24 bg-purple-600/30 rounded-full blur-2xl animate-pulse" })] })] })] }), _jsx(HomeSlider, {}), _jsx("section", { id: "mission-section", className: "py-24 bg-white overflow-hidden scroll-mt-20", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "grid md:grid-cols-2 gap-20 items-center", children: [_jsxs("div", { className: "space-y-10", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center gap-2 text-indigo-600", children: [_jsx(Target, { className: "w-5 h-5" }), _jsx("span", { className: "text-xs font-black uppercase tracking-[0.3em]", children: "Our Philosophy" })] }), _jsxs("h2", { className: "text-4xl md:text-5xl font-serif font-bold text-slate-900 leading-tight", children: ["Beyond Algorithms:", _jsx("br", {}), "A Human-AI Synergy."] }), _jsx("p", { className: "text-xl text-slate-600 font-light leading-relaxed", children: "Lumina Book Store isn't just a store; it's an evolving consciousness dedicated to the art of reading. We use Gemini's deep reasoning to understand the *soul* of a book, not just its metadata." })] }), _jsx("div", { className: "grid gap-6", children: [
                                                { icon: Brain, title: "Cognitive Curation", desc: "Our AI reads between the lines to find thematic resonances often missed by keywords." },
                                                { icon: ShieldCheck, title: "Curated Integrity", desc: "Every recommendation is triple-checked for quality, diversity, and literary value." },
                                                { icon: Users, title: "Community Focused", desc: "Your interactions feed the collective wisdom, making Lumina smarter for everyone." }
                                            ].map((item, i) => (_jsxs("div", { className: "flex gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100 transition-all hover:shadow-lg hover:-translate-y-1", children: [_jsx("div", { className: "p-3 bg-indigo-600 rounded-2xl text-white shadow-lg h-fit", children: _jsx(item.icon, { className: "w-5 h-5" }) }), _jsxs("div", { children: [_jsx("h4", { className: "font-bold text-slate-800 mb-1", children: item.title }), _jsx("p", { className: "text-sm text-slate-500 leading-relaxed", children: item.desc })] })] }, i))) })] }), _jsxs("div", { className: "relative", children: [_jsxs("div", { className: "aspect-[4/5] bg-slate-100 rounded-[3rem] overflow-hidden shadow-2xl relative z-10", children: [_jsx("img", { src: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=1200", className: "w-full h-full object-cover", alt: "Library Scene" }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-indigo-900/40 to-transparent" })] }), _jsxs("div", { className: "absolute top-1/2 -right-8 -translate-y-1/2 bg-white p-8 rounded-[2rem] shadow-2xl z-20 hidden lg:block border border-slate-100", children: [_jsxs("div", { className: "flex items-center gap-4 mb-6", children: [_jsx("div", { className: "w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center", children: _jsx(Sparkles, { className: "w-6 h-6 text-indigo-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-[10px] font-black uppercase tracking-widest text-slate-400", children: "AI Progress" }), _jsx("p", { className: "text-sm font-bold text-slate-900", children: "1.2M Books Analyzed" })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "h-1.5 w-full bg-slate-100 rounded-full overflow-hidden", children: _jsx("div", { className: "h-full bg-indigo-600 animate-pulse w-4/5" }) }), _jsx("p", { className: "text-[10px] text-slate-500 font-medium", children: "System optimizing for context..." })] })] })] })] }) }) }), _jsxs("section", { className: "py-24 bg-rose-50 border-y border-rose-100 relative overflow-hidden", children: [_jsx("div", { className: "absolute top-0 right-0 p-8 opacity-5", children: _jsx(Percent, { className: "w-64 h-64" }) }), _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10", children: [_jsxs("div", { className: "flex flex-col md:flex-row items-center justify-between mb-12 gap-6", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-16 h-16 bg-rose-500 rounded-2xl flex items-center justify-center shadow-xl shadow-rose-200", children: _jsx(Zap, { className: "w-8 h-8 text-white" }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-4xl font-serif font-bold text-slate-900 leading-tight", children: "Flash Sale" }), _jsx("p", { className: "text-rose-600 font-bold uppercase tracking-widest text-xs", children: "Unbeatable savings on curated masterpieces" })] })] }), _jsxs("div", { className: "px-6 py-3 bg-white border-2 border-rose-200 rounded-2xl flex items-center gap-4", children: [_jsx("span", { className: "text-[10px] font-black uppercase tracking-widest text-slate-400", children: "Ends in:" }), _jsx("span", { className: "text-2xl font-black text-rose-500 tabular-nums", children: "12:45:02" })] })] }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8", children: flashSaleBooks.map(book => (_jsx(BookCard, { book: book, onAddToCart: addToCart, onQuickView: setViewingBook, onToggleWishlist: toggleWishlist, isInWishlist: wishlist.some(w => w.id === book.id), onPlayTrailer: setActiveTrailer }, book.id))) })] })] }), _jsx("div", { className: "py-10", children: _jsx(AIRecommendationSection, { activeCategory: selectedCategory }) }), _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsx(BookShelf, { title: "New Arriving", subtitle: "Fresh off the press and ready for your bookshelf.", books: newArrivals, wishlist: wishlist, onAddToCart: addToCart, onQuickView: setViewingBook, onToggleWishlist: toggleWishlist, onAuthorClick: handleAuthorClick, onPlayTrailer: setActiveTrailer }), _jsx(BookShelf, { title: "Bestsellers", subtitle: "The stories everyone is talking about right now.", books: bestsellers, wishlist: wishlist, onAddToCart: addToCart, onQuickView: setViewingBook, onToggleWishlist: toggleWishlist, onAuthorClick: handleAuthorClick, onPlayTrailer: setActiveTrailer }), _jsxs("div", { className: "py-20 scroll-mt-24", id: "collection-start", children: [_jsxs("div", { className: "text-center mb-12", children: [_jsx("h2", { className: "text-3xl font-serif font-bold text-slate-800 mb-4", children: "Browse by Genre" }), _jsx("p", { className: "text-slate-500", children: "Click to filter library \u2022 Double click for genre experience hub" })] }), _jsx(CategoryGrid, { onSelect: handleGenreSelect, onDoubleClick: handleGenrePageNavigate, activeCategory: selectedCategory }), selectedCategory !== 'All' && (_jsx("div", { className: "mb-10 animate-in slide-in-from-top-4 duration-500", children: _jsxs("div", { className: "bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100 flex flex-wrap items-center justify-between gap-6", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "p-3 bg-white rounded-2xl shadow-sm text-indigo-600", children: _jsx(SlidersHorizontal, { className: "w-5 h-5" }) }), _jsxs("div", { children: [_jsxs("h4", { className: "font-bold text-slate-800", children: ["Filters: ", selectedCategory] }), _jsx("p", { className: "text-xs text-slate-500", children: "Refining your discovery experience" })] })] }), _jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [_jsxs("button", { className: "px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:border-indigo-400 hover:text-indigo-600 transition-all flex items-center gap-2", children: [_jsx(Filter, { className: "w-3.5 h-3.5" }), " Best Matches"] }), _jsx("button", { className: "px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:border-indigo-400 hover:text-indigo-600 transition-all", children: "Under $20" }), _jsx("button", { className: "px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:border-indigo-400 hover:text-indigo-600 transition-all", children: "Top Rated" }), _jsx("button", { onClick: () => setSelectedCategory('All'), className: "px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all", children: "Reset" })] }), _jsxs("button", { onClick: () => setView('GENRE_PAGE'), className: "flex items-center gap-2 text-indigo-600 font-black uppercase tracking-widest text-[10px] hover:gap-3 transition-all", children: ["Enter ", selectedCategory, " Hub ", _jsx(ArrowRight, { className: "w-4 h-4" })] })] }) })), _jsxs("div", { className: "flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-4xl font-serif font-bold text-slate-800 mb-2", children: selectedCategory === 'All' ? 'Complete Collection' : `${selectedCategory} Selection` }), _jsxs("p", { className: "text-slate-500", children: ["Showing page ", currentPage, " of ", totalPages || 1] })] }), _jsx("div", { className: "flex flex-wrap items-center gap-4", children: _jsxs("div", { className: "relative group", children: [_jsx("div", { className: "absolute inset-y-0 left-3 flex items-center pointer-events-none", children: _jsx(ArrowUpDown, { className: "w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" }) }), _jsxs("select", { value: sortBy, onChange: (e) => setSortBy(e.target.value), className: "pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all cursor-pointer hover:border-indigo-200", children: [_jsx("option", { value: "default", children: "Sort by: Recommended" }), _jsx("option", { value: "price-asc", children: "Price: Low to High" }), _jsx("option", { value: "price-desc", children: "Price: High to Low" })] })] }) })] }), paginatedBooks.length > 0 ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8", children: paginatedBooks.map((book) => (_jsx(BookCard, { book: book, isInWishlist: wishlist.some(item => item.id === book.id), onAddToCart: addToCart, onQuickView: setViewingBook, onToggleWishlist: toggleWishlist, onAuthorClick: handleAuthorClick, onPlayTrailer: setActiveTrailer }, book.id))) }), _jsx(Pagination, { currentPage: currentPage, totalPages: totalPages, onPageChange: handlePageChange })] })) : (_jsx("div", { className: "text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200", children: _jsx("p", { className: "text-slate-400 text-lg", children: "No books found matching your selection." }) }))] })] }), _jsx(AuthorGrid, { authors: uniqueAuthors, onAuthorClick: handleAuthorClick }), _jsx(AuthorSpotlight, {}), _jsx(BookTrailers, { books: MOCK_BOOKS, onPlayTrailer: setActiveTrailer, isGenerating: isGeneratingTrailer, onGenerateTrailer: handleGenerateTrailer }), _jsx(Newsletter, {})] }));
    };
    return (_jsxs("div", { className: "min-h-screen flex flex-col selection:bg-indigo-100 selection:text-indigo-900", children: [_jsx(Header, { cartCount: cart.reduce((acc, item) => acc + item.quantity, 0), wishlistCount: wishlist.length, onCartClick: () => setIsCartOpen(true), onWishlistClick: () => setIsWishlistOpen(true), onAccountClick: () => setIsAccountOpen(true), onSearch: setSearchQuery }), _jsx("main", { className: "flex-grow", children: renderContent() }), _jsxs("footer", { className: "bg-slate-950 text-slate-400 pt-24 pb-12 px-4 relative overflow-hidden", children: [_jsx("div", { className: "absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" }), _jsx("div", { className: "absolute -bottom-20 -right-20 w-96 h-96 bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none" }), _jsxs("div", { className: "max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20 relative z-10", children: [_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "bg-indigo-600 p-2.5 rounded-xl shadow-lg", children: _jsx(BookOpen, { className: "w-5 h-5 text-white" }) }), _jsxs("div", { className: "flex flex-col", children: [_jsx("span", { className: "text-2xl font-serif font-black text-white tracking-tight leading-none", children: "Lumina" }), _jsx("span", { className: "text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 leading-none mt-1", children: "Book Store" })] })] }), _jsx("p", { className: "text-lg leading-relaxed text-slate-300 font-light", children: "Redefining the relationship between readers and literature through human-centered artificial intelligence." }), _jsxs("div", { className: "flex flex-col gap-4", children: [_jsx("h5", { className: "text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400", children: "Connect With Us" }), _jsx("div", { className: "flex gap-4", children: [Twitter, Instagram, Linkedin, Facebook].map((Icon, idx) => (_jsx("a", { href: "#", className: "p-3 bg-white/5 rounded-xl text-slate-400 hover:text-white hover:bg-indigo-600 transition-all border border-white/5 hover:scale-110 active:scale-95", children: _jsx(Icon, { className: "w-5 h-5" }) }, idx))) })] })] }), _jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "flex items-center gap-2 text-white", children: [_jsx(Mail, { className: "w-5 h-5 text-indigo-400" }), _jsx("h4", { className: "font-bold uppercase text-xs tracking-[0.2em]", children: "Contact & Support" })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-start gap-4", children: [_jsx(MapPin, { className: "w-5 h-5 text-indigo-500 shrink-0 mt-1" }), _jsxs("div", { className: "text-sm", children: [_jsx("p", { className: "text-white font-bold", children: "Lumina Sanctuary" }), _jsxs("p", { className: "text-slate-400 leading-relaxed font-light", children: ["1204 Inkwell Way,", _jsx("br", {}), "San Francisco, CA 94107"] })] })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx(Mail, { className: "w-5 h-5 text-indigo-500 shrink-0" }), _jsx("a", { href: "mailto:sanctuary@lumina.ai", className: "text-sm hover:text-indigo-400 transition-colors", children: "sanctuary@lumina.ai" })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx(Phone, { className: "w-5 h-5 text-indigo-500 shrink-0" }), _jsx("span", { className: "text-sm", children: "+1 (555) 789-0123" })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx(Clock, { className: "w-5 h-5 text-indigo-500 shrink-0" }), _jsx("span", { className: "text-xs italic text-slate-500", children: "24/7 AI Librarian Support" })] })] })] }), _jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "flex items-center gap-2 text-white", children: [_jsx(Rocket, { className: "w-5 h-5 text-indigo-400" }), _jsx("h4", { className: "font-bold uppercase text-xs tracking-[0.2em]", children: "Capabilities" })] }), _jsxs("ul", { className: "space-y-4 text-sm font-medium", children: [_jsxs("li", { className: "flex gap-3", children: [_jsx(Sparkles, { className: "w-4 h-4 text-indigo-500 shrink-0 mt-0.5" }), _jsxs("span", { children: [_jsx("span", { className: "text-white", children: "AI Librarian:" }), " Instant, context-aware suggestions."] })] }), _jsxs("li", { className: "flex gap-3", children: [_jsx(Zap, { className: "w-4 h-4 text-indigo-500 shrink-0 mt-0.5" }), _jsxs("span", { children: [_jsx("span", { className: "text-white", children: "Deep Insights:" }), " Real-time literary analysis."] })] }), _jsxs("li", { className: "flex gap-3", children: [_jsx(Brain, { className: "w-4 h-4 text-indigo-500 shrink-0 mt-0.5" }), _jsxs("span", { children: [_jsx("span", { className: "text-white", children: "Mood Logic:" }), " Recommendations based on emotion."] })] })] })] }), _jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "flex items-center gap-2 text-white", children: [_jsx(HelpCircle, { className: "w-5 h-5 text-indigo-400" }), _jsx("h4", { className: "font-bold uppercase text-xs tracking-[0.2em]", children: "Help & FAQ" })] }), _jsxs("ul", { className: "space-y-4 text-sm font-medium", children: [_jsx("li", { children: _jsx("a", { href: "#", className: "hover:text-indigo-400 transition-colors block", children: "How accurate is the AI?" }) }), _jsx("li", { children: _jsx("a", { href: "#", className: "hover:text-indigo-400 transition-colors block underline decoration-indigo-500/30 underline-offset-4 font-bold", children: "Visit Knowledge Base" }) }), _jsx("li", { children: _jsx("a", { href: "#", className: "hover:text-indigo-400 transition-colors block", children: "Return Policy" }) }), _jsx("li", { children: _jsx("a", { href: "#", className: "hover:text-indigo-400 transition-colors block", children: "Shipping Worldwide" }) })] })] })] }), _jsxs("div", { className: "max-w-7xl mx-auto pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-[11px] font-medium tracking-widest uppercase relative z-10", children: [_jsxs("div", { className: "flex flex-col md:flex-row items-center gap-4 md:gap-8", children: [_jsxs("p", { children: ["\u00A9 ", new Date().getFullYear(), " Lumina Book Store Inc."] }), _jsxs("div", { className: "flex gap-8", children: [_jsx("a", { href: "#", className: "hover:text-indigo-400 transition-colors", children: "Privacy" }), _jsx("a", { href: "#", className: "hover:text-indigo-400 transition-colors", children: "Terms" })] })] }), _jsxs("div", { className: "flex items-center gap-2 text-slate-500", children: [_jsx("span", { children: "Powered by" }), _jsx("span", { className: "text-indigo-400 font-bold", children: "Lumina Intelligence v3.5" })] })] })] }), _jsx(CartDrawer, { isOpen: isCartOpen, onClose: () => setIsCartOpen(false), items: cart, onUpdateQuantity: updateQuantity, onRemove: removeFromCart }), _jsx(WishlistDrawer, { isOpen: isWishlistOpen, onClose: () => setIsWishlistOpen(false), items: wishlist, onRemove: toggleWishlist, onMoveToCart: moveFromWishlistToCart }), _jsx(QuickViewModal, { book: viewingBook, onClose: () => setViewingBook(null), onAddToCart: addToCart }), _jsx(AccountModal, { isOpen: isAccountOpen, onClose: () => setIsAccountOpen(false) }), activeTrailer && (_jsxs("div", { className: "fixed inset-0 z-[200] flex items-center justify-center p-4", children: [_jsx("div", { className: "absolute inset-0 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300", onClick: () => setActiveTrailer(null) }), _jsxs("div", { className: "relative w-full max-w-5xl aspect-video bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 animate-in zoom-in-95 duration-500", children: [_jsx("button", { onClick: () => setActiveTrailer(null), className: "absolute top-6 right-6 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all text-white", children: _jsx(X, { className: "w-6 h-6" }) }), _jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-gradient-to-t from-slate-950 to-transparent", children: _jsxs("div", { className: "text-center space-y-6 px-12", children: [_jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest mb-4", children: [_jsx(Clapperboard, { className: "w-3 h-3" }), "Now Showing"] }), _jsxs("h3", { className: "text-5xl md:text-7xl font-serif font-bold text-white tracking-tight italic", children: ["\"", activeTrailer.title, "\""] }), _jsxs("p", { className: "text-xl text-slate-400 font-light max-w-2xl mx-auto", children: ["Coming to bookshelves near you. A cinematic journey through the world of ", activeTrailer.author, "."] }), _jsxs("div", { className: "flex items-center justify-center gap-8 pt-8", children: [_jsxs("div", { className: "flex flex-col items-center", children: [_jsx("span", { className: "text-indigo-400 font-black text-2xl", children: "4K" }), _jsx("span", { className: "text-slate-600 text-[10px] font-bold uppercase tracking-widest", children: "Ultra HD" })] }), _jsx("div", { className: "w-px h-12 bg-white/10" }), _jsxs("div", { className: "flex flex-col items-center", children: [_jsx("span", { className: "text-indigo-400 font-black text-2xl", children: "7.1" }), _jsx("span", { className: "text-slate-600 text-[10px] font-bold uppercase tracking-widest", children: "Surround" })] })] })] }) }), _jsx("div", { className: "absolute bottom-0 left-0 w-full h-1.5 bg-white/10", children: _jsx("div", { className: "h-full bg-indigo-600 w-1/3 animate-[progress_10s_linear_infinite]" }) })] })] })), _jsx("style", { children: `
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      ` }), _jsx(Toast, { message: toastMessage || '', isVisible: !!toastMessage, onClose: () => setToastMessage(null) })] }));
};
export default App;
