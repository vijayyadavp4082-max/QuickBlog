import React from 'react';

const Loader = () => (
    <div className="grid min-h-screen place-content-center justify-items-center gap-3 bg-[#fafafe]">
        <div className="flex items-center gap-[5px]">
            <span className="h-[7px] w-[7px] animate-loader-bounce rounded-full bg-primary"></span>
            <span className="h-[7px] w-[7px] animate-loader-bounce rounded-full bg-primary [animation-delay:.12s]"></span>
            <span className="h-[7px] w-[7px] animate-loader-bounce rounded-full bg-primary [animation-delay:.24s]"></span>
        </div>
        <p className="m-0 text-[10px] uppercase tracking-[.08em] text-[#969aa8]">Loading QuickBlog</p>
    </div>
);

export default Loader;
