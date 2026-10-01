import React from 'react';
import { assets, footer_data } from '../assets/assets';

const Footer = () => {
    return (
        <footer className="border-t border-[#ededf3] bg-[#fafafe]">
            <div className="mx-auto grid w-[min(1240px,calc(100%-48px))] grid-cols-[1.1fr_1fr] gap-20 pb-[45px] pt-[62px] max-[900px]:grid-cols-1 max-[650px]:w-[calc(100%-28px)] max-[650px]:gap-10">
                <div>
                    <img src={assets.logo} alt="QuickBlog" className="block w-[155px] max-w-full" />
                    <p className="mb-2.5 mt-[18px] max-w-[430px] text-[13px] leading-[1.8] text-[#7c8190]">
                        A simple place for thoughtful writing, useful ideas and stories that stay with you.
                    </p>
                    <span className="text-xs font-bold text-primary">Write something worth remembering.</span>
                </div>

                <div className="grid grid-cols-3 gap-[25px] max-[650px]:grid-cols-2">
                    {footer_data.map((section, index) => (
                        <div key={index}>
                            <h3 className="mb-[17px] mt-0 font-heading text-[13px]">{section.title}</h3>
                            {section.links.map((link, i) => (
                                <a href="#" key={i} onClick={(e) => e.preventDefault()} className="mb-[9px] block text-xs text-[#858a98] transition-colors hover:text-primary">{link}</a>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <div className="mx-auto flex w-[min(1240px,calc(100%-48px))] justify-between border-t border-[#e8e9ef] py-[17px] text-[11px] text-[#999dab] max-[650px]:w-[calc(100%-28px)] max-[650px]:flex-col max-[650px]:gap-[5px]">
                <span>© 2026 QuickBlog. All rights reserved.</span>
                <span>Built for readers &amp; writers.</span>
            </div>
        </footer>
    );
};

export default Footer;
