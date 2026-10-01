import React from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronRight, House, List, MessageSquare, PlusSquare, Sparkles } from 'lucide-react';

const Sidebar = ({ open = false, onClose = () => {} }) => {
    const items = [
        { to: '/admin', label: 'Overview', icon: House, end: true },
        { to: '/admin/add-blog', label: 'Create article', icon: PlusSquare },
        { to: '/admin/list-blog', label: 'All articles', icon: List },
        { to: '/admin/comments', label: 'Comments', icon: MessageSquare },
    ];

    return (
        <>
            <div className={`fixed inset-0 z-90 hidden bg-[rgba(15,16,25,.35)] backdrop-blur-[2px] ${open ? 'max-[900px]:block' : ''}`} onClick={onClose}></div>
            <aside className={`flex w-[238px] flex-none flex-col border-r border-[#e7e9f0] bg-white px-[13px] pb-5 pt-[25px] max-[1100px]:w-[215px] max-[900px]:fixed max-[900px]:inset-y-0 max-[900px]:left-0 max-[900px]:z-100 max-[900px]:shadow-[20px_0_50px_rgba(20,22,40,.14)] max-[900px]:transition-transform max-[900px]:duration-[250ms] ${open ? 'max-[900px]:translate-x-0' : 'max-[900px]:-translate-x-[105%]'}`}>
                <div className="px-[11px] pb-[18px]">
                    <span className="text-[9px] font-extrabold tracking-[.14em] text-[#aaaebb]">WORKSPACE</span>
                    <p className="mb-0 mt-[5px] text-[11px] text-[#7e8291]">Manage your publication</p>
                </div>

                <nav className="grid gap-1">
                    {items.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.end}
                                onClick={onClose}
                                className={({ isActive }) => `group relative flex items-center gap-[11px] rounded-[10px] p-[11px] text-xs font-semibold transition hover:bg-[#f7f6ff] hover:text-primary ${isActive ? 'bg-[#f1efff] text-primary' : 'text-[#7b8090]'}`}
                            >
                                {({ isActive }) => (
                                    <>
                                        <span className={`grid h-8 w-8 place-items-center rounded-lg ${isActive ? 'bg-[#e7e3ff]' : 'bg-[#f6f6f9]'}`}>
                                            <Icon size={17} />
                                        </span>
                                        <span>{item.label}</span>
                                        <ChevronRight size={17} className={`ml-auto ${isActive ? 'text-primary' : 'text-[#b8bbc6]'}`} />
                                    </>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="mx-1 mb-0 mt-auto flex gap-[9px] rounded-xl bg-[#f7f6ff] p-[13px]">
                    <span className="text-primary"><Sparkles size={16} /></span>
                    <div>
                        <strong className="block text-[10px]">Quick tip</strong>
                        <p className="mb-0 mt-[3px] text-[9px] leading-[1.5] text-[#8d91a0]">Use the AI writer when you need a starting point.</p>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
