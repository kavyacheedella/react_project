import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Sparkles, Send, Loader2, BookOpen, Wand2, Coffee, Ghost, Microscope, Zap } from 'lucide-react';
import { getBookRecommendations } from '../../services/geminiService';
const MOODS = [
    { label: 'Cozy & Gentle', icon: Coffee, prompt: 'Suggest some cozy, gentle, and heartwarming books.' },
    { label: 'Mind-Bending', icon: Zap, prompt: 'Suggest some complex, philosophical, and mind-bending books.' },
    { label: 'Eerie & Deep', icon: Ghost, prompt: 'Suggest some dark, mysterious, or slightly eerie literary works.' },
    { label: 'Scholarly', icon: Microscope, prompt: 'Suggest some intellectually rigorous and informative scholarly books.' }
];
const AIRecommendationSection = ({ activeCategory }) => {
    const [prompt, setPrompt] = useState('');
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isAutoLoading, setIsAutoLoading] = useState(false);
    const [activeMood, setActiveMood] = useState(null);
    // Auto-fetch recommendations when category changes with debouncing
    useEffect(() => {
        let isMounted = true;
        const timer = setTimeout(async () => {
            if (!isMounted)
                return;
            setIsAutoLoading(true);
            const genrePrompt = activeCategory === 'All'
                ? "Suggest 3 must-read classic and contemporary books across all genres."
                : `Suggest 3 influential or hidden gem books specifically for the ${activeCategory} genre.`;
            try {
                const results = await getBookRecommendations(genrePrompt);
                if (isMounted) {
                    setRecommendations(results);
                }
            }
            finally {
                if (isMounted)
                    setIsAutoLoading(false);
            }
        }, 500);
        return () => {
            isMounted = false;
            clearTimeout(timer);
        };
    }, [activeCategory]);
    const handleRecommend = async (customPrompt) => {
        const finalPrompt = customPrompt || prompt;
        if (!finalPrompt.trim())
            return;
        setLoading(true);
        try {
            const results = await getBookRecommendations(finalPrompt);
            setRecommendations(results);
        }
        finally {
            setLoading(false);
        }
    };
    const handleMoodClick = (mood) => {
        setActiveMood(mood.label);
        handleRecommend(mood.prompt);
    };
    return (_jsx("section", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20", children: _jsxs("div", { className: "bg-white rounded-[3rem] shadow-2xl shadow-indigo-200/50 border border-slate-100 p-8 md:p-12 overflow-hidden relative", children: [_jsx("div", { className: "absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-bl-full pointer-events-none opacity-30" }), _jsxs("div", { className: "max-w-4xl mx-auto", children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-10 mb-10", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "w-16 h-16 bg-indigo-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-indigo-200 relative group", children: [_jsx(Sparkles, { className: "w-8 h-8 text-white relative z-10 group-hover:scale-110 transition-transform" }), _jsx("div", { className: `absolute inset-0 bg-indigo-400 rounded-[2rem] blur-xl opacity-50 ${loading || isAutoLoading ? 'animate-pulse scale-125' : ''}` })] }), _jsxs("div", { children: [_jsx("h2", { className: "text-3xl font-serif font-bold text-slate-800", children: "Lumina Librarian" }), _jsx("p", { className: "text-slate-500 text-sm font-light", children: "Deep literary resonance powered by AI" })] })] }), _jsxs("form", { onSubmit: (e) => { e.preventDefault(); handleRecommend(); }, className: "relative flex-1 max-w-md", children: [_jsx("input", { type: "text", value: prompt, onChange: (e) => setPrompt(e.target.value), placeholder: "What are you in the mood for?", className: "w-full bg-slate-50 border border-slate-100 rounded-3xl py-4 pl-6 pr-14 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-500 transition-all outline-none text-sm text-slate-800 shadow-inner" }), _jsx("button", { type: "submit", disabled: loading, className: "absolute right-2 top-2 bottom-2 px-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all disabled:opacity-70 active:scale-95", children: loading ? _jsx(Loader2, { className: "w-5 h-5 animate-spin" }) : _jsx(Send, { className: "w-5 h-5" }) })] })] }), _jsxs("div", { className: "flex flex-wrap items-center justify-center gap-3 mb-10", children: [_jsx("span", { className: "text-[10px] font-black uppercase tracking-widest text-slate-400 mr-2", children: "Quick Moods:" }), MOODS.map((mood) => (_jsxs("button", { onClick: () => handleMoodClick(mood), className: `flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all text-sm font-medium ${activeMood === mood.label
                                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg'
                                        : 'bg-white border-slate-100 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'}`, children: [_jsx(mood.icon, { className: "w-4 h-4" }), mood.label] }, mood.label)))] }), (isAutoLoading || loading) ? (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [1, 2, 3].map((i) => (_jsxs("div", { className: "h-48 bg-slate-50 rounded-[2rem] border border-slate-100 animate-pulse flex flex-col items-center justify-center gap-4 p-8", children: [_jsx("div", { className: "w-10 h-10 bg-indigo-100 rounded-xl animate-bounce" }), _jsx("div", { className: "h-2 w-32 bg-indigo-100 rounded" }), _jsx("div", { className: "h-1.5 w-full bg-slate-100 rounded" })] }, i))) })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-700", children: recommendations.length > 0 ? recommendations.map((rec, i) => (_jsxs("div", { className: "group p-8 bg-slate-50/50 rounded-[2rem] border border-slate-100 hover:border-indigo-300 hover:bg-white hover:shadow-2xl hover:shadow-indigo-100/30 transition-all duration-500", children: [_jsxs("div", { className: "flex items-center gap-2 mb-6", children: [_jsx("div", { className: "w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300", children: _jsx(BookOpen, { className: "w-5 h-5" }) }), _jsx("span", { className: "text-[10px] font-black uppercase tracking-widest text-indigo-400", children: "Recommendation" })] }), _jsx("h4", { className: "font-serif text-lg font-bold text-slate-800 mb-3 leading-tight group-hover:text-indigo-600 transition-colors", children: rec.title }), _jsx("p", { className: "text-xs text-slate-500 leading-relaxed line-clamp-4 font-light", children: rec.reason })] }, i))) : (_jsx("div", { className: "col-span-full py-12 text-center text-slate-400 italic font-light", children: "No recommendations found. Try a different mood or search term." })) })), _jsx("div", { className: "mt-12 pt-8 border-t border-slate-100 flex items-center justify-center", children: _jsxs("p", { className: "text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] flex items-center gap-3", children: [_jsx("div", { className: "h-1 w-8 bg-indigo-100 rounded-full" }), _jsx(Wand2, { className: "w-3.5 h-3.5" }), "Lumina Librarian v3.1 \u2022 Contextual Logic Engaged", _jsx("div", { className: "h-1 w-8 bg-indigo-100 rounded-full" })] }) })] })] }) }));
};
export default AIRecommendationSection;
