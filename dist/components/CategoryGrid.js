import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BookText, BrainCircuit, History, Atom, PenTool, ShieldCheck, Baby, GraduationCap, FileText, MousePointerClick } from 'lucide-react';
export const CATEGORY_DATA = [
    { name: 'Fiction', icon: BookText, color: 'bg-rose-50 text-rose-600', border: 'hover:border-rose-200', description: 'Immerse yourself in worlds created by master storytellers.' },
    { name: 'Non-Fiction', icon: FileText, color: 'bg-slate-50 text-slate-600', border: 'hover:border-slate-200', description: 'Explore reality, biographies, and true accounts of our world.' },
    { name: 'Technology', icon: BrainCircuit, color: 'bg-blue-50 text-blue-600', border: 'hover:border-blue-200', description: 'The code, culture, and ethics shaping our digital tomorrow.' },
    { name: 'History', icon: History, color: 'bg-amber-50 text-amber-600', border: 'hover:border-amber-200', description: 'Uncover the stories and figures that shaped our past.' },
    { name: 'Science', icon: Atom, color: 'bg-emerald-50 text-emerald-600', border: 'hover:border-emerald-200', description: 'From quantum particles to the vast reaches of the cosmos.' },
    { name: 'Philosophy', icon: ShieldCheck, color: 'bg-indigo-50 text-indigo-600', border: 'hover:border-indigo-200', description: 'Navigate life\'s biggest questions with timeless wisdom.' },
    { name: 'Poetry', icon: PenTool, color: 'bg-purple-50 text-purple-600', border: 'hover:border-purple-200', description: 'The art of rhythmic language and profound emotion.' },
    { name: 'Children', icon: Baby, color: 'bg-yellow-50 text-yellow-600', border: 'hover:border-yellow-200', description: 'Magic and wonder for the youngest of readers.' },
    { name: 'Education', icon: GraduationCap, color: 'bg-teal-50 text-teal-600', border: 'hover:border-teal-200', description: 'Resources for lifelong learners and dedicated students.' },
];
const CategoryGrid = ({ onSelect, onDoubleClick, activeCategory }) => {
    return (_jsxs("div", { className: "relative", children: [_jsxs("div", { className: "flex items-center gap-2 mb-4 px-1", children: [_jsx(MousePointerClick, { className: "w-4 h-4 text-slate-400" }), _jsx("span", { className: "text-[10px] font-black uppercase tracking-widest text-slate-400", children: "Click to Filter \u2022 Double Click for Genre Hub" })] }), _jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4 mb-12 overflow-x-auto pb-4 no-scrollbar", children: CATEGORY_DATA.map((cat) => {
                    const Icon = cat.icon;
                    const isActive = activeCategory === cat.name;
                    return (_jsxs("button", { onClick: () => onSelect(cat.name), onDoubleClick: () => onDoubleClick(cat.name), title: `Single click: Filter library | Double click: Visit ${cat.name} hub`, className: `flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 group min-w-[120px] relative overflow-hidden ${isActive
                            ? 'bg-white border-indigo-600 shadow-lg shadow-indigo-100 -translate-y-1'
                            : `bg-white border-transparent ${cat.border} shadow-sm hover:-translate-y-1`}`, children: [_jsx("div", { className: `p-3 rounded-xl mb-3 transition-colors ${cat.color} ${isActive ? 'bg-indigo-600 text-white' : ''}`, children: _jsx(Icon, { className: "w-6 h-6" }) }), _jsx("span", { className: `text-sm font-bold tracking-tight whitespace-nowrap ${isActive ? 'text-indigo-600' : 'text-slate-600'}`, children: cat.name }), _jsx("div", { className: "absolute bottom-1 w-full flex justify-center opacity-0 group-hover:opacity-100 transition-opacity", children: _jsx("div", { className: "h-0.5 w-4 bg-indigo-300 rounded-full" }) })] }, cat.name));
                }) })] }));
};
export default CategoryGrid;
