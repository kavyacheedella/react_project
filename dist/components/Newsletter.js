import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';
const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email)
            return;
        setSubscribed(true);
    };
    return (_jsx("section", { className: "py-20 bg-white", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsx("div", { className: "bg-slate-900 rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden text-center", children: _jsx("div", { className: "relative z-10 max-w-2xl mx-auto", children: !subscribed ? (_jsxs(_Fragment, { children: [_jsx("h2", { className: "text-3xl md:text-4xl font-serif font-bold text-white mb-4", children: "Join Our Literary Community" }), _jsx("p", { className: "text-slate-400 mb-10 text-lg", children: "Get weekly book recommendations, exclusive author insights, and special member pricing delivered to your inbox." }), _jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col sm:flex-row gap-4", children: [_jsxs("div", { className: "flex-grow relative", children: [_jsx(Mail, { className: "absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" }), _jsx("input", { type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), placeholder: "Your email address", className: "w-full bg-slate-800/50 border border-slate-700 text-white rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500 focus:bg-slate-800 transition-all outline-none" })] }), _jsx("button", { type: "submit", className: "bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-900/40 active:scale-95", children: "Subscribe Now" })] }), _jsx("p", { className: "text-slate-500 text-xs mt-6", children: "By subscribing, you agree to our Privacy Policy. No spam, just stories." })] })) : (_jsxs("div", { className: "animate-in fade-in zoom-in duration-500 py-10", children: [_jsx("div", { className: "inline-flex items-center justify-center w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full mb-6", children: _jsx(CheckCircle2, { className: "w-10 h-10" }) }), _jsx("h3", { className: "text-3xl font-serif font-bold text-white mb-2", children: "You're on the list!" }), _jsx("p", { className: "text-slate-400", children: "Welcome to the inner circle. Keep an eye on your inbox for your first curated list." })] })) }) }) }) }));
};
export default Newsletter;
