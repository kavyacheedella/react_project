import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
const SLIDES = [
    {
        image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=2000',
        title: 'The Future of Fiction',
        subtitle: 'Discover narratives that push the boundaries of imagination and reality.',
        tag: 'Featured Collection',
        color: 'from-indigo-900/80'
    },
    {
        image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=2000',
        title: 'Masters of Philosophy',
        subtitle: 'Timeless wisdom curated for the modern thinker navigating a digital world.',
        tag: 'Thought Leaders',
        color: 'from-slate-900/80'
    },
    {
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000',
        title: 'The Tech Revolution',
        subtitle: 'Deep dives into the code, culture, and ethics shaping our tomorrow.',
        tag: 'Technology',
        color: 'from-purple-900/80'
    }
];
const HomeSlider = () => {
    const [current, setCurrent] = useState(0);
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % SLIDES.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);
    const next = () => setCurrent((prev) => (prev + 1) % SLIDES.length);
    const prev = () => setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
    const handleExplore = () => {
        const element = document.getElementById('collection-start');
        element?.scrollIntoView({ behavior: 'smooth' });
    };
    return (_jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-20", children: _jsxs("div", { className: "relative h-[500px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl group", children: [SLIDES.map((slide, index) => (_jsxs("div", { className: `absolute inset-0 transition-all duration-1000 ease-in-out ${index === current ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none'}`, children: [_jsx("img", { src: slide.image, className: "w-full h-full object-cover", alt: slide.title }), _jsx("div", { className: `absolute inset-0 bg-gradient-to-r ${slide.color} to-transparent flex items-center`, children: _jsxs("div", { className: "pl-12 md:pl-20 max-w-2xl text-white", children: [_jsx("span", { className: "inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-[0.2em] mb-6 animate-in slide-in-from-left-4 duration-700", children: slide.tag }), _jsx("h2", { className: "text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight animate-in slide-in-from-left-8 duration-700 delay-100", children: slide.title }), _jsx("p", { className: "text-xl text-white/80 mb-10 leading-relaxed font-light animate-in slide-in-from-left-12 duration-700 delay-200", children: slide.subtitle }), _jsxs("button", { onClick: handleExplore, className: "px-8 py-4 bg-white text-slate-900 font-bold rounded-full hover:bg-indigo-50 transition-all flex items-center gap-2 group/btn animate-in slide-in-from-left-16 duration-700 delay-300", children: ["Explore Now ", _jsx(ArrowRight, { className: "w-5 h-5 group-hover/btn:translate-x-1 transition-transform" })] })] }) })] }, index))), _jsx("button", { onClick: prev, className: "absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-slate-900", children: _jsx(ChevronLeft, { className: "w-6 h-6" }) }), _jsx("button", { onClick: next, className: "absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-slate-900", children: _jsx(ChevronRight, { className: "w-6 h-6" }) }), _jsx("div", { className: "absolute bottom-10 left-12 md:left-20 flex gap-2", children: SLIDES.map((_, i) => (_jsx("button", { onClick: () => setCurrent(i), className: `h-1.5 transition-all duration-500 rounded-full ${i === current ? 'w-12 bg-white' : 'w-4 bg-white/30'}` }, i))) })] }) }));
};
export default HomeSlider;
