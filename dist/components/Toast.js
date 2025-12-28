import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';
const Toast = ({ message, isVisible, onClose }) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);
    if (!isVisible)
        return null;
    return (_jsx("div", { className: "fixed bottom-8 left-1/2 -translate-x-1/2 z-[150] animate-in slide-in-from-bottom-4 fade-in duration-300", children: _jsxs("div", { className: "bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[300px]", children: [_jsx(CheckCircle, { className: "w-5 h-5 text-emerald-400" }), _jsx("span", { className: "flex-grow font-medium text-sm", children: message }), _jsx("button", { onClick: onClose, className: "p-1 hover:bg-white/10 rounded-full transition-colors", children: _jsx(X, { className: "w-4 h-4 text-white/50" }) })] }) }));
};
export default Toast;
