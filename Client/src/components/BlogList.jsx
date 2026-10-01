import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { blogCategories } from '../assets/assets';
import { motion } from 'motion/react';
import BlogCard from './BlogCard';
import { useAppContext } from '../context/AppContext';

const BlogList = () => {
    const [menu, setMenu] = useState('All');
    const { blogs, input } = useAppContext();

    const filteredBlogs = useMemo(() => {
        const query = input.trim().toLowerCase();

        return blogs.filter((blog) => {
            const matchesCategory = menu === 'All' || blog.category === menu;
            const matchesSearch = !query ||
                blog.title.toLowerCase().includes(query) ||
                blog.category.toLowerCase().includes(query);

            return matchesCategory && matchesSearch;
        });
    }, [blogs, input, menu]);

    return (
        <section id="latest-blogs" className="mx-auto w-[min(1240px,calc(100%-48px))] scroll-mt-[90px] pb-[100px] pt-[45px] max-[650px]:w-[calc(100%-28px)]">
            <div className="mb-7 flex items-end justify-between gap-5 max-[650px]:flex-col max-[650px]:items-start">
                <div>
                    <span className="mb-2 block text-[10px] font-extrabold tracking-[.16em] text-primary">DISCOVER</span>
                    <h2 className="m-0 font-heading text-[30px] tracking-[-.035em]">Latest stories</h2>
                    <p className="mb-0 mt-[7px] text-sm text-[#838798]">Browse our newest articles and find something worth your time.</p>
                </div>
                <span className="text-xs font-semibold text-[#85899a]">{filteredBlogs.length} articles</span>
            </div>

            <div className="mb-[30px] flex flex-wrap gap-2" role="tablist" aria-label="Blog categories">
                {blogCategories.map((item) => (
                    <button
                        key={item}
                        type="button"
                        onClick={() => setMenu(item)}
                        className={`relative z-[1] cursor-pointer rounded-[10px] border bg-transparent px-[17px] py-2.5 text-[13px] font-semibold ${menu === item ? 'border-primary text-white' : 'border-transparent text-[#777b8d] hover:text-primary'}`}
                    >
                        {item}
                        {menu === item && (
                            <motion.span
                                layoutId="category-pill"
                                className="absolute inset-0 -z-[1] rounded-[10px] bg-primary"
                                transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                            />
                        )}
                    </button>
                ))}
            </div>

            {filteredBlogs.length > 0 ? (
                <div className="grid grid-cols-4 gap-5 max-[1100px]:grid-cols-3 max-[900px]:grid-cols-2 max-[650px]:grid-cols-1">
                    {filteredBlogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)}
                </div>
            ) : (
                <div className="rounded-[18px] border border-dashed border-[#dfe1e9] px-5 py-[70px] text-center">
                    <div className="mx-auto grid h-12 w-12 place-items-center rounded-[14px] bg-[#f0efff] text-primary"><Search size={20} /></div>
                    <h3 className="mb-1 mt-[15px] font-heading">No articles found</h3>
                    <p className="m-0 text-[13px] text-[#8b8f9d]">Try another search term or choose a different category.</p>
                </div>
            )}
        </section>
    );
};

export default BlogList;
