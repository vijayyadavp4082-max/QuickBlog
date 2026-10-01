import React from 'react';
import { Check, Trash2 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const CommentTableItem = ({ comment, fetchComments }) => {
    const { blog, createdAt, _id, name, content, isApproved } = comment;
    const { axios } = useAppContext();
    const date = new Date(createdAt);

    const approveComment = async () => {
        try {
            const { data } = await axios.post('/api/admin/approve-comment', { id: _id });
            if (data.success) { toast.success(data.message); await fetchComments(); }
            else toast.error(data.message);
        } catch (error) { toast.error(error.response?.data?.message || error.message || 'Failed to approve comment'); }
    };

    const deleteComment = async () => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return;
        try {
            const { data } = await axios.post('/api/admin/delete-comment', { id: _id });
            if (data.success) { toast.success(data.message); await fetchComments(); }
            else toast.error(data.message);
        } catch (error) { toast.error(error.response?.data?.message || error.message || 'Failed to delete comment'); }
    };

    return (
        <tr className="hover:bg-[#fbfbff]">
            <td className="border-b border-[#f0f1f5] px-3.5 py-[13px] align-middle text-[11px] text-[#4f5464]">
                <div className="flex min-w-[350px] gap-2.5">
                    <div className="grid h-[34px] w-[34px] flex-none place-items-center rounded-full bg-gradient-to-br from-[#5b4ce6] to-[#8e72dc] text-[11px] font-bold text-white">{name?.charAt(0)?.toUpperCase() || 'U'}</div>
                    <div><strong className="block text-[11px] text-[#333748]">{name || 'Anonymous'}</strong><p className="my-1 max-w-[460px] truncate text-[10px] text-[#737888]">{content || 'No comment'}</p><span className="text-[9px] text-[#a0a4b0]">{blog?.title || 'Unknown article'}</span></div>
                </div>
            </td>
            <td className="whitespace-nowrap border-b border-[#f0f1f5] px-3.5 py-[13px] align-middle text-[11px] text-[#969aa8]">{Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
            <td className="border-b border-[#f0f1f5] px-3.5 py-[13px] align-middle text-[11px] text-[#4f5464]"><span className={`inline-flex items-center gap-[5px] whitespace-nowrap rounded-full px-2 py-[5px] text-[9px] font-bold ${isApproved ? 'bg-[#ebf8f1] text-[#168052]' : 'bg-[#fff5df] text-[#aa6d12]'}`}><i className={`h-[5px] w-[5px] rounded-full ${isApproved ? 'bg-[#27a66b]' : 'bg-[#e5a12f]'}`}></i>{isApproved ? 'Approved' : 'Pending'}</span></td>
            <td className="border-b border-[#f0f1f5] px-3.5 py-[13px] align-middle text-[11px] text-[#4f5464]">
                <div className="flex items-center gap-1.5">
                    {!isApproved && <button className="inline-flex cursor-pointer items-center gap-[5px] rounded-[7px] border border-[#e2e3ea] bg-white px-2 py-1.5 text-[9px] font-bold text-[#20885b] hover:border-[#cfcaf4]" onClick={approveComment}><Check size={12} /> Approve</button>}
                    <button className="grid h-[29px] w-[29px] cursor-pointer place-items-center rounded-[7px] border border-[#e2e3ea] bg-white p-[7px] text-[#737888] hover:border-[#cfcaf4] hover:text-primary" onClick={deleteComment} aria-label="Delete comment"><Trash2 size={14} /></button>
                </div>
            </td>
        </tr>
    );
};

export default CommentTableItem;
