import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Search, SearchX } from 'lucide-react';
import BlogTableItem from './BlogTableItem';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const ListBlog = () => {
    const [blogs, setBlogs] = useState([]);
    const [query, setQuery] = useState('');
    const [filter, setFilter] = useState('All');
    const [loading, setLoading] = useState(true);
    const { axios, navigate } = useAppContext();

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/admin/blogs');
            if (data.success) setBlogs(data.blogs || []);
            else toast.error(data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Failed to load blogs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBlogs(); }, []);

    const filteredBlogs = useMemo(() => blogs.filter((blog) => {
        const matchesFilter = filter === 'All' || (filter === 'Published' ? blog.isPublished : !blog.isPublished);
        const q = query.toLowerCase().trim();
        const matchesQuery = !q || blog.title?.toLowerCase().includes(q) || blog.category?.toLowerCase().includes(q);
        return matchesFilter && matchesQuery;
    }), [blogs, filter, query]);

    return (
        <div className="mx-auto min-h-[calc(100vh-76px)] max-w-[1500px] px-[38px] pb-[50px] pt-[34px] max-[1100px]:px-[25px] max-[650px]:min-h-[calc(100vh-68px)] max-[650px]:px-3.5 max-[650px]:pb-[35px] max-[650px]:pt-6">
            <div className="mb-7 flex items-end justify-between gap-5 max-[650px]:flex-col max-[650px]:items-start">
                <div><div className="flex items-center gap-[7px] text-[9px] font-extrabold tracking-[.15em] text-primary"><span className="h-[5px] w-[5px] rounded-full bg-primary"></span> CONTENT LIBRARY</div><h1 className="mb-1.5 mt-2 font-heading text-[29px] tracking-[-.04em] max-[650px]:text-[25px]">All articles</h1><p className="m-0 text-xs text-[#858a9a]">Manage every article published or saved in your workspace.</p></div>
                <button className="inline-flex cursor-pointer items-center gap-[9px] rounded-[9px] bg-primary px-[15px] py-[11px] text-[11px] font-bold text-white shadow-[0_8px_18px_rgba(91,76,230,.18)] hover:bg-primary-dark" onClick={() => navigate('/admin/add-blog')}><Plus size={14} /> New article</button>
            </div>

            <div className="mb-[15px] flex items-center justify-between gap-3.5 max-[650px]:flex-col max-[650px]:items-stretch">
                <div className="flex h-[38px] w-[min(320px,100%)] items-center gap-2 rounded-[9px] border border-[#dedfe7] bg-white px-[11px] max-[650px]:w-full"><Search size={16} className="text-[#9da1ae]" /><input className="min-w-0 flex-1 border-0 bg-transparent text-[11px] text-ink outline-0" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search articles..." /></div>
                <div className="flex gap-[5px] rounded-[9px] border border-[#e1e2e9] bg-white p-[3px] max-[650px]:self-start">
                    {['All', 'Published', 'Draft'].map((item) => <button key={item} onClick={() => setFilter(item)} className={`cursor-pointer rounded-[7px] px-[11px] py-[7px] text-[10px] font-bold ${filter === item ? 'bg-[#efedff] text-primary' : 'bg-transparent text-[#838797]'}`}>{item}</button>)}
                </div>
            </div>

            <div className="rounded-[15px] border border-[#e8e9ef] bg-white shadow-[0_4px_18px_rgba(28,31,50,.035)] overflow-hidden">
                {loading ? <div className="p-[70px] text-center text-xs text-[#8f93a1]">Loading your articles…</div> : filteredBlogs.length ? (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px] border-collapse">
                            <thead><tr><th className="border-b border-[#eff0f4] bg-[#fbfbfd] px-3.5 py-3 text-left text-[9px] uppercase tracking-[.09em] text-[#a1a5b1]">#</th><th className="border-b border-[#eff0f4] bg-[#fbfbfd] px-3.5 py-3 text-left text-[9px] uppercase tracking-[.09em] text-[#a1a5b1]">Article</th><th className="border-b border-[#eff0f4] bg-[#fbfbfd] px-3.5 py-3 text-left text-[9px] uppercase tracking-[.09em] text-[#a1a5b1]">Date</th><th className="border-b border-[#eff0f4] bg-[#fbfbfd] px-3.5 py-3 text-left text-[9px] uppercase tracking-[.09em] text-[#a1a5b1]">Status</th><th className="border-b border-[#eff0f4] bg-[#fbfbfd] px-3.5 py-3 text-left text-[9px] uppercase tracking-[.09em] text-[#a1a5b1]">Actions</th></tr></thead>
                            <tbody>{filteredBlogs.map((blog, index) => <BlogTableItem key={blog._id} blog={blog} fetchBlogs={fetchBlogs} index={index + 1} />)}</tbody>
                        </table>
                    </div>
                ) : (
                    <div className="px-5 py-[65px] text-center"><div className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-[#f1efff] text-primary"><SearchX size={20} /></div><h3 className="mb-1 mt-3 font-heading text-sm">No matching articles</h3><p className="m-0 text-[11px] text-[#9296a4]">Try changing your search or filter.</p></div>
                )}
            </div>
        </div>
    );
};

export default ListBlog;
