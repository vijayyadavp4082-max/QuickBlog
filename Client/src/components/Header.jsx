import React, { useRef } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Header = () => {
    const { setInput, input } = useAppContext();
    const inputRef = useRef(null);

    const onSubmitHandler = (e) => {
        e.preventDefault();
        setInput(inputRef.current.value.trim());
        document.getElementById('latest-blogs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const onClear = () => {
        setInput('');
        if (inputRef.current) inputRef.current.value = '';
    };

    return (
        <section className="relative flex min-h-[600px] items-center overflow-hidden">
            <div className="pointer-events-none absolute -left-60 -top-60 h-[560px] w-[560px] rounded-full blur-[5px] [background:radial-gradient(circle,rgba(91,76,230,.14),transparent_68%)]"></div>
            <div className="pointer-events-none absolute -bottom-[220px] -right-[220px] h-[520px] w-[520px] rounded-full blur-[5px] [background:radial-gradient(circle,rgba(235,182,228,.17),transparent_68%)]"></div>

            <div className="relative z-[2] m-auto w-[min(960px,calc(100%-40px))] px-0 pb-20 pt-[100px] text-center max-[650px]:pb-14 max-[650px]:pt-[75px]">
                <div className="inline-flex items-center gap-[9px] rounded-full border border-[#e2defb] bg-[#faf9ff] px-[13px] py-2 text-xs font-bold tracking-[.03em] text-primary">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_0_4px_rgba(91,76,230,.1)]"></span>
                    <span>Ideas worth sharing</span>
                    <Sparkles size={13} />
                </div>

                <h1 className="mx-auto mb-5 mt-6 max-w-[900px] font-heading text-[clamp(42px,6vw,74px)] font-extrabold leading-[1.05] tracking-[-.055em] text-[#191b2a] max-[650px]:text-[40px]">
                    Stories, ideas &amp; <span className="bg-gradient-to-br from-[#5b4ce6] from-5% via-[#7e5ad7] via-60% to-[#b96db0] to-100% bg-clip-text text-transparent">perspectives</span><br />
                    for curious minds.
                </h1>

                <p className="mx-auto max-w-[650px] text-base leading-[1.8] text-[#767b8d] max-[650px]:text-[13px]">
                    Discover thoughtful articles, practical insights and fresh ideas from the QuickBlog community.
                    Read something useful, then share something of your own.
                </p>

                <form onSubmit={onSubmitHandler} className="mx-auto mt-[34px] flex min-h-[62px] w-[min(620px,100%)] items-center rounded-[15px] border border-[#dedfea] bg-white p-1.5 shadow-[0_18px_50px_rgba(38,39,62,.09)] max-[650px]:min-h-[54px]">
                    <div className="flex w-11 justify-center text-[#999daf]" aria-hidden="true"><Search size={22} /></div>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search by title or category..."
                        defaultValue={input}
                        aria-label="Search blogs"
                        className="min-w-0 flex-1 border-0 bg-transparent text-ink outline-0 placeholder:text-[#a5a9b7]"
                    />
                    <button type="submit" className="min-h-12 cursor-pointer rounded-[11px] bg-primary px-[25px] font-bold text-white transition hover:-translate-y-px hover:bg-primary-dark max-[650px]:min-h-[42px] max-[650px]:px-[15px]">Search</button>
                </form>

                {input && (
                    <button onClick={onClear} className="mt-3 cursor-pointer rounded-lg border border-[#dddfea] bg-white px-[11px] py-1.5 text-xs text-[#777c8d]">
                        Clear search
                    </button>
                )}

                <div className="mt-[38px] flex justify-center gap-7 text-xs text-[#a0a4b2] max-[650px]:gap-[15px]">
                    <span><b className="mr-[5px] text-primary">01</b> Read</span>
                    <span><b className="mr-[5px] text-primary">02</b> Learn</span>
                    <span><b className="mr-[5px] text-primary">03</b> Share</span>
                </div>
            </div>
        </section>
    );
};

export default Header;
