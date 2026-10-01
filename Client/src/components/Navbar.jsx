import React, { useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';

const Navbar = () => {
    const { navigate, token } = useAppContext();
    const [open, setOpen] = useState(false);

    const linkClass = 'cursor-pointer bg-transparent text-sm font-semibold text-[#6b7081] transition-colors hover:text-primary max-[900px]:rounded-lg max-[900px]:p-3 max-[900px]:text-left max-[900px]:hover:bg-[#f7f6ff]';

    return (
        <header className="sticky top-0 z-50 border-b border-[#e7e9f0]/80 bg-white/90 backdrop-blur-[18px]">
            <div className="mx-auto flex min-h-[78px] w-[min(1240px,calc(100%-48px))] items-center justify-between gap-7 max-[1100px]:w-[min(100%-32px,1240px)] max-[650px]:min-h-[68px] max-[650px]:w-[calc(100%-24px)]">
                <button className="cursor-pointer bg-transparent p-0" onClick={() => navigate('/')} aria-label="QuickBlog home">
                    <img src={assets.logo} alt="QuickBlog" className="block w-[158px] max-w-full max-[650px]:w-[130px]" />
                </button>

                <nav className={`ml-auto items-center gap-[30px] ${open ? 'max-[900px]:absolute max-[900px]:left-4 max-[900px]:right-4 max-[900px]:top-[72px] max-[900px]:grid max-[900px]:gap-0.5 max-[900px]:rounded-xl max-[900px]:border max-[900px]:border-[#e7e9f0] max-[900px]:bg-white max-[900px]:p-2.5 max-[900px]:shadow-[0_12px_40px_rgba(26,29,50,.07)]' : 'max-[900px]:hidden'} flex`}>
                    <button className={linkClass} onClick={() => { navigate('/'); setOpen(false); }}>Home</button>
                    <button className={linkClass} onClick={() => { document.getElementById('latest-blogs')?.scrollIntoView({ behavior: 'smooth' }); setOpen(false); }}>Explore</button>
                    <button className={linkClass} onClick={() => { document.getElementById('newsletter')?.scrollIntoView({ behavior: 'smooth' }); setOpen(false); }}>Newsletter</button>
                </nav>

                <div className="flex items-center gap-3">
                    <button className="inline-flex cursor-pointer items-center gap-3 rounded-xl bg-ink py-3 pl-5 pr-[18px] text-[13px] font-bold text-white shadow-[0_8px_20px_rgba(22,24,39,.12)] transition hover:-translate-y-px hover:bg-primary max-[650px]:px-3 max-[650px]:py-2.5" onClick={() => navigate('/admin')}>
                        <span>{token ? 'Dashboard' : 'Admin Login'}</span>
                        <ArrowRight size={16} className="max-[650px]:hidden" />
                    </button>
                    <button className="hidden cursor-pointer bg-transparent max-[900px]:block" onClick={() => setOpen(!open)} aria-label="Toggle navigation">
                        {open ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
