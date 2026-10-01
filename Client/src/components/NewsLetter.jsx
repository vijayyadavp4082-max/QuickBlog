import React, { useState } from 'react';
import toast from 'react-hot-toast';

const NewsLetter = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const value = email.trim();

        if (!value) {
            toast.error('Please enter your email');
            return;
        }

        toast.success('You are on the list. Thanks for subscribing!');
        setEmail('');
    };

    return (
        <section id="newsletter" className="mx-auto w-[min(1240px,calc(100%-48px))] scroll-mt-[90px] pb-[100px] pt-[15px] max-[650px]:w-[calc(100%-28px)]">
            <div className="relative grid grid-cols-2 items-center gap-10 overflow-hidden rounded-3xl p-[60px] text-white [background:linear-gradient(120deg,#171928,#25243b_70%,#41366e)] after:absolute after:-right-[120px] after:-top-[140px] after:h-[340px] after:w-[340px] after:rounded-full after:bg-[rgba(122,104,255,.22)] after:blur-[3px] after:content-[''] max-[900px]:grid-cols-1 max-[900px]:p-[45px] max-[650px]:px-[22px] max-[650px]:py-8">
                <div className="relative z-[1]">
                    <span className="mb-2 block text-[10px] font-extrabold tracking-[.16em] text-[#c7c1ff]">STAY IN THE LOOP</span>
                    <h2 className="mb-3.5 mt-2.5 font-heading text-[34px] leading-[1.1] tracking-[-.04em] max-[650px]:text-[28px]">Fresh stories.<br />Straight to your inbox.</h2>
                    <p className="m-0 max-w-[470px] text-sm leading-[1.7] text-[#b7b8c7]">One useful email when there is something genuinely worth reading. No noise.</p>
                </div>

                <form onSubmit={handleSubmit} className="relative z-[2] flex rounded-[13px] border border-white/[.12] bg-white/[.09] p-1.5 max-[650px]:flex-col max-[650px]:gap-1.5 max-[650px]:border-0 max-[650px]:bg-transparent">
                    <input
                        type="email"
                        placeholder="Your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        aria-label="Email address"
                        required
                        className="min-w-0 flex-1 border-0 bg-transparent px-[15px] text-white outline-0 placeholder:text-[#9d9eaf] max-[650px]:min-h-[46px] max-[650px]:rounded-[9px] max-[650px]:bg-white/10"
                    />
                    <button type="submit" className="cursor-pointer rounded-[9px] bg-primary px-[21px] py-[13px] font-bold text-white max-[650px]:min-h-[46px]">Subscribe</button>
                </form>
            </div>
        </section>
    );
};

export default NewsLetter;
