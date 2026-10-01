import React, { useState } from 'react';
import { ArrowUpRight, Menu } from 'lucide-react';
import { assets } from '../../assets/assets';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';
import { useAppContext } from '../../context/AppContext';

const Layout = () => {
    const { navigate, axios, setToken } = useAppContext();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const logout = () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setToken(null);
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-[#f6f7fb]">
            <header className="sticky top-0 z-60 flex h-[76px] items-center justify-between border-b border-[#e7e9f0] bg-white/95 px-[30px] max-[650px]:h-[68px] max-[650px]:px-3.5">
                <div className="flex items-center gap-4">
                    <button className="hidden cursor-pointer rounded-lg bg-[#f4f4fa] p-2 max-[900px]:block" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
                        <Menu size={20} />
                    </button>
                    <button className="flex cursor-pointer items-center gap-2.5 bg-transparent p-0" onClick={() => navigate('/')}>
                        <img src={assets.logo} alt="QuickBlog" className="block w-[137px] max-w-full max-[650px]:w-[120px]" />
                        <span className="border-l border-[#dddfe7] pl-2.5 text-[10px] font-extrabold tracking-[.12em] text-[#8b8f9d] max-[650px]:hidden">Studio</span>
                    </button>
                </div>

                <div className="flex items-center gap-4 max-[650px]:gap-1.5">
                    <button className="inline-flex cursor-pointer items-center gap-1 bg-transparent px-3 py-[9px] text-xs font-semibold text-[#6f7484] max-[650px]:hidden" onClick={() => navigate('/')}>
                        View site <ArrowUpRight size={16} className="text-primary" />
                    </button>
                    <div className="flex items-center gap-[9px] border-l border-[#e7e9f0] pl-3.5 max-[650px]:border-l-0 max-[650px]:pl-0">
                        <div className="grid h-[35px] w-[35px] place-items-center rounded-full bg-gradient-to-br from-[#5b4ce6] to-[#8c72dd] text-xs font-extrabold text-white max-[650px]:h-8 max-[650px]:w-8">A</div>
                        <div className="max-[650px]:hidden">
                            <strong className="block text-[11px]">Administrator</strong>
                            <span className="mt-0.5 block text-[9px] text-[#9a9eab]">Content manager</span>
                        </div>
                    </div>
                    <button className="cursor-pointer rounded-[9px] border border-[#e2e3ea] bg-white px-[13px] py-[9px] text-[11px] font-bold text-[#777c8c] hover:border-[#f0cdd2] hover:bg-[#fff8f8] hover:text-[#d34f5f] max-[650px]:px-2.5 max-[650px]:py-2" onClick={logout}>Logout</button>
                </div>
            </header>

            <div className="flex min-h-[calc(100vh-76px)]">
                <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <main className="min-w-0 flex-1">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
