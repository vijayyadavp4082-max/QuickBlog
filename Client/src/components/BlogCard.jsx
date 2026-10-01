import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const BlogCard = ({ blog }) => {
    const { title, description, image, category, _id, createdAt, author } = blog;
    const navigate = useNavigate();

    const excerpt = description?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() || 'Read this article on QuickBlog.';

    return (
        <article className="group cursor-pointer overflow-hidden rounded-2xl border border-[#e8e9ef] bg-white shadow-[0_5px_20px_rgba(25,28,47,.035)] transition duration-[250ms] hover:-translate-y-1.5 hover:border-[#d8d4f7] hover:shadow-[0_20px_45px_rgba(42,38,87,.10)]" onClick={() => navigate(`/blog/${_id}`)}>
            <div className="relative aspect-[16/10] overflow-hidden bg-[#eef0f6]">
                <img src={image} alt={title} className="block h-full w-full object-cover transition-transform duration-[450ms] group-hover:scale-[1.045]" />
                <span className="absolute left-3 top-3 rounded-[7px] bg-[rgba(24,25,37,.78)] px-[9px] py-[5px] text-[10px] font-bold text-white backdrop-blur-[8px]">{category}</span>
            </div>

            <div className="p-[17px]">
                <div className="flex gap-1.5 text-[10px] uppercase tracking-[.04em] text-[#9b9eaa]">
                    <span>{moment(createdAt).format('MMM D, YYYY')}</span>
                    <span className="text-[#c9cbd3]">•</span>
                    <span>{author || 'QuickBlog'}</span>
                </div>

                <h3 className="mb-2 mt-2.5 min-h-[45px] font-heading text-base leading-[1.4] tracking-[-.02em] text-[#242637] max-[650px]:min-h-0">{title}</h3>
                <p className="m-0 min-h-[42px] text-xs leading-[1.65] text-[#85899a]">{excerpt.length > 112 ? `${excerpt.slice(0, 112)}…` : excerpt}</p>

                <div className="mt-[17px] flex items-center justify-between border-t border-[#eff0f4] pt-[13px] text-xs font-bold text-primary">
                    <span>Read article</span>
                    <ArrowUpRight size={18} />
                </div>
            </div>
        </article>
    );
};

export default BlogCard;
