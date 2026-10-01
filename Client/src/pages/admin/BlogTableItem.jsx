import React from 'react';
import { X } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const BlogTableItem = ({ blog, fetchBlogs, index }) => {
    const { axios } = useAppContext();
    const date = new Date(blog.createdAt);

    const deleteBlog = async () => {
        if (!window.confirm('Are you sure you want to delete this blog?')) return;
        try {
            const { data } = await axios.post('/api/blogs/delete', { id: blog._id });
            if (data.success) {
                toast.success(data.message);
                await fetchBlogs();
            } else toast.error(data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Failed to delete blog');
        }
    };

    const togglePublish = async () => {
        try {
            const { data } = await axios.post('/api/blogs/toggle-publish', { id: blog._id });
            if (data.success) {
                toast.success(data.message);
                await fetchBlogs();
            } else toast.error(data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Failed to update blog');
        }
    };

    return (
        <tr className="hover:bg-[#fbfbff]">
            <td className="w-12 border-b border-[#f0f1f5] px-3.5 py-[13px] align-middle text-[10px] font-bold text-[#aaaebb]">{String(index).padStart(2, '0')}</td>
            <td className="border-b border-[#f0f1f5] px-3.5 py-[13px] align-middle text-[11px] text-[#4f5464]">
                <div className="flex min-w-[220px] items-center gap-2.5">
                    {blog.image ? <img src={blog.image} alt="" className="h-9 w-12 flex-none rounded-[7px] bg-[#efeff6] object-cover" /> : <div className="grid h-9 w-12 flex-none place-items-center rounded-[7px] bg-[#efeff6] font-extrabold text-primary">Q</div>}
                    <div><strong className="block max-w-[230px] truncate text-[11px] text-[#333748]">{blog.title}</strong><span className="mt-0.5 block text-[9px] text-[#a0a4b0]">{blog.category || 'Article'}</span></div>
                </div>
            </td>
            <td className="whitespace-nowrap border-b border-[#f0f1f5] px-3.5 py-[13px] align-middle text-[11px] text-[#969aa8]">{Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
            <td className="border-b border-[#f0f1f5] px-3.5 py-[13px] align-middle text-[11px] text-[#4f5464]"><span className={`inline-flex items-center gap-[5px] whitespace-nowrap rounded-full px-2 py-[5px] text-[9px] font-bold ${blog.isPublished ? 'bg-[#ebf8f1] text-[#168052]' : 'bg-[#fff5df] text-[#aa6d12]'}`}><i className={`h-[5px] w-[5px] rounded-full ${blog.isPublished ? 'bg-[#27a66b]' : 'bg-[#e5a12f]'}`}></i>{blog.isPublished ? 'Published' : 'Draft'}</span></td>
            <td className="border-b border-[#f0f1f5] px-3.5 py-[13px] align-middle text-[11px] text-[#4f5464]">
                <div className="flex items-center gap-1.5">
                    <button className="cursor-pointer rounded-[7px] border border-[#e2e3ea] bg-white px-2 py-1.5 text-[9px] font-bold text-[#737888] hover:border-[#cfcaf4] hover:text-primary" onClick={togglePublish}>{blog.isPublished ? 'Unpublish' : 'Publish'}</button>
                    <button className="grid h-[29px] w-[29px] cursor-pointer place-items-center rounded-[7px] border border-[#e2e3ea] bg-white p-[7px] text-[#737888] hover:border-[#cfcaf4] hover:text-primary" onClick={deleteBlog} aria-label="Delete blog"><X size={14} /></button>
                </div>
            </td>
        </tr>
    );
};

export default BlogTableItem;
