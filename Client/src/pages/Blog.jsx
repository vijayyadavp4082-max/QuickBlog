import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import toast from 'react-hot-toast';
import { ArrowRight, Facebook, Link2, Sparkles, Twitter } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import { useAppContext } from '../context/AppContext';

const Blog = () => {
    const { id } = useParams();
    const { axios } = useAppContext();

    const [data, setData] = useState(null);
    const [comments, setComments] = useState([]);
    const [name, setName] = useState('');
    const [content, setContent] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchBlogData = async () => {
        try {
            const response = await axios.get(`/api/blogs/${id}`);
            if (response.data.success) setData(response.data.blog);
            else toast.error(response.data.message);
        } catch (error) {
            console.error('Fetch blog error:', error);
            toast.error(error.response?.data?.message || error.message || 'Failed to load blog');
        }
    };

    const fetchComments = async () => {
        try {
            const response = await axios.post('/api/blogs/comments', { blogId: Number(id) });
            if (response.data.success) setComments(response.data.comments);
            else toast.error(response.data.message);
        } catch (error) {
            console.error('Fetch comments error:', error);
            toast.error(error.response?.data?.message || error.message || 'Failed to load comments');
        }
    };

    const addComment = async (e) => {
        e.preventDefault();
        const trimmedName = name.trim();
        const trimmedContent = content.trim();
        const blogId = Number(id);

        if (!trimmedName || !trimmedContent) {
            toast.error('Please enter your name and comment');
            return;
        }
        if (!Number.isInteger(blogId) || blogId <= 0) {
            toast.error('Invalid blog ID');
            return;
        }

        try {
            setSubmitting(true);
            const response = await axios.post('/api/blogs/add-comment', {
                blogId,
                name: trimmedName,
                content: trimmedContent
            });

            if (response.data.success) {
                toast.success(response.data.message || 'Comment submitted successfully');
                setName('');
                setContent('');
                await fetchComments();
            } else {
                toast.error(response.data.message || 'Failed to add comment');
            }
        } catch (error) {
            console.error('Add comment error:', error);
            toast.error(error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to add comment');
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        if (!id) return;
        setData(null);
        fetchBlogData();
        fetchComments();
    }, [id]);

    if (!data) return <Loader />;

    return (
        <div className="bg-white">
            <Navbar />

            <header className="mx-auto w-[min(950px,calc(100%-40px))] px-0 pb-12 pt-[75px] text-center max-[650px]:w-[calc(100%-28px)] max-[650px]:pb-[35px] max-[650px]:pt-[55px]">
                <div className="text-xs font-semibold text-[#969aaa]">Home <span className="px-[7px] text-primary">•</span> {data.category}</div>
                <p className="mb-2.5 mt-[25px] text-xs font-bold text-primary">Published {moment(data.createdAt).format('MMMM D, YYYY')}</p>
                <h1 className="m-0 mx-auto max-w-[900px] font-heading text-[clamp(40px,5.5vw,64px)] leading-[1.08] tracking-[-.055em] max-[650px]:text-[37px]">{data.title}</h1>
                <p className="mx-auto mb-6 mt-[18px] max-w-[650px] text-base leading-[1.7] text-[#7d8293] max-[650px]:text-[13px]">{data.subTitle}</p>
                <div className="inline-flex items-center gap-2.5 text-left">
                    <span className="grid h-[34px] w-[34px] place-items-center rounded-full bg-gradient-to-br from-[#5b4ce6] to-[#8e72dc] text-xs font-bold text-white">{(data.author || 'A').charAt(0).toUpperCase()}</span>
                    <div>
                        <strong className="block text-xs">{data.author || 'Admin'}</strong>
                        <span className="block text-[10px] text-[#9a9eac]">QuickBlog contributor</span>
                    </div>
                </div>
            </header>

            <main className="mx-auto w-[min(1120px,calc(100%-40px))] max-[650px]:w-[calc(100%-28px)]">
                <figure className="m-0 overflow-hidden rounded-3xl bg-[#f2f3f7] shadow-[0_25px_70px_rgba(28,29,48,.10)] max-[650px]:rounded-[15px]">
                    <img src={data.image} alt={data.title} className="block max-h-[610px] w-full object-cover" />
                </figure>

                <div className="grid grid-cols-[minmax(0,760px)_200px] justify-center gap-[65px] pb-[25px] pt-[65px] max-[900px]:grid-cols-1 max-[650px]:pt-10">
                    <article className="rich-text min-w-0 max-[650px]:text-sm" dangerouslySetInnerHTML={{ __html: data.description }} />

                    <aside className="pt-[25px] max-[900px]:hidden">
                        <div className="sticky top-[110px] rounded-[14px] border border-[#e9eaf0] bg-[#fafaff] p-[18px]">
                            <span className="block text-[9px] font-extrabold tracking-[.14em] text-[#999dad]">ARTICLE</span>
                            <strong className="mt-2 block text-sm">{data.category}</strong>
                            <p className="mb-0 mt-2 text-[10px] text-[#8b8f9e]">Published {moment(data.createdAt).fromNow()}</p>
                        </div>
                    </aside>
                </div>

                <section className="pb-2.5 pt-[75px]">
                    <div className="mb-7 flex items-end justify-between gap-5 max-[650px]:flex-col max-[650px]:items-start">
                        <div>
                            <span className="mb-2 block text-[10px] font-extrabold tracking-[.16em] text-primary">COMMUNITY</span>
                            <h2 className="m-0 font-heading text-[30px] tracking-[-.035em]">Join the conversation</h2>
                        </div>
                        <span className="text-xs font-semibold text-[#85899a]">{comments.length} comments</span>
                    </div>

                    <div className="grid gap-3">
                        {comments.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-[#dfe1e9] p-10 text-center">
                                <div className="mx-auto grid h-12 w-12 place-items-center rounded-[14px] bg-[#f0efff] text-primary"><Sparkles size={20} /></div>
                                <h3 className="mb-1 mt-3 font-heading text-base">Be the first to comment</h3>
                                <p className="m-0 text-xs text-[#8b8f9d]">Share your thoughts and start the conversation.</p>
                            </div>
                        ) : comments.map((item) => (
                            <div key={item.id || item._id} className="flex gap-[13px] rounded-[14px] border border-[#eaebf1] bg-white p-[18px]">
                                <div className="grid h-9 w-9 flex-none place-items-center rounded-full bg-gradient-to-br from-[#5b4ce6] to-[#8e72dc] text-xs font-bold text-white">
                                    {item.name?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex justify-between gap-3">
                                        <strong className="text-[13px]">{item.name}</strong>
                                        <span className="text-[10px] text-[#a1a5b2]">{moment(item.createdAt).fromNow()}</span>
                                    </div>
                                    <p className="mb-0 mt-[7px] text-[13px] leading-[1.6] text-[#707586]">{item.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={addComment} className="mt-7 max-w-[720px] rounded-[17px] border border-[#e8e9ef] bg-[#fafafe] p-[26px] max-[650px]:p-[18px]">
                        <div>
                            <h3 className="m-0 font-heading text-lg">Leave a comment</h3>
                            <p className="mb-[18px] mt-[5px] text-[11px] text-[#8b8f9d]">Your comment will be reviewed before it appears publicly.</p>
                        </div>

                        <div className="grid gap-3">
                            <input
                                type="text"
                                placeholder="Your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full rounded-[10px] border border-[#dfe1e9] bg-white px-[13px] py-3 text-ink outline-0 focus:border-[#aaa1ef] focus:shadow-[0_0_0_4px_rgba(91,76,230,.07)]"
                            />
                            <textarea
                                placeholder="Write your thoughts..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                                className="min-h-[130px] w-full resize-y rounded-[10px] border border-[#dfe1e9] bg-white px-[13px] py-3 text-ink outline-0 focus:border-[#aaa1ef] focus:shadow-[0_0_0_4px_rgba(91,76,230,.07)]"
                            />
                        </div>

                        <button type="submit" disabled={submitting} className="mt-[13px] inline-flex cursor-pointer items-center gap-2.5 rounded-[10px] bg-primary px-[17px] py-3 font-bold text-white">
                            {submitting ? 'Submitting...' : 'Post comment'}
                            <ArrowRight size={16} />
                        </button>
                    </form>
                </section>

                <section className="mx-auto my-[70px] flex max-w-[760px] items-center justify-between border-t border-[#ececf1] py-5 text-xs text-[#777c8c] max-[650px]:my-[45px]">
                    <span>Share this article</span>
                    <div className="flex gap-2">
                        <button className="grid h-[35px] w-[35px] cursor-pointer place-items-center rounded-[9px] border border-[#e4e5ec] bg-white" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank', 'noopener,noreferrer')} aria-label="Share on Facebook">
                            <Facebook size={16} />
                        </button>
                        <button className="grid h-[35px] w-[35px] cursor-pointer place-items-center rounded-[9px] border border-[#e4e5ec] bg-white" onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(data.title)}`, '_blank', 'noopener,noreferrer')} aria-label="Share on Twitter">
                            <Twitter size={16} />
                        </button>
                        <button className="grid h-[35px] w-[35px] cursor-pointer place-items-center rounded-[9px] border border-[#e4e5ec] bg-white text-primary" onClick={() => navigator.clipboard.writeText(window.location.href).then(() => toast.success('Article link copied!')).catch(() => toast.error('Unable to copy link'))} aria-label="Copy article link">
                            <Link2 size={16} />
                        </button>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Blog;
