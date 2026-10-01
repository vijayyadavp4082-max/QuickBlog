import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, ImagePlus, Sparkles } from 'lucide-react';
import { blogCategories } from '../../assets/assets';
import Quill from 'quill';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { parse } from 'marked';

const AddBlog = () => {
    const { axios, navigate } = useAppContext();
    const [isAdding, setIsAdding] = useState(false);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState('');
    const [title, setTitle] = useState('');
    const [subTitle, setSubTitle] = useState('');
    const [category, setCategory] = useState('Startup');
    const [isPublished, setIsPublished] = useState(false);
    const [loading, setLoading] = useState(false);
    const editorRef = useRef(null);
    const quillRef = useRef(null);

    useEffect(() => {
        if (!quillRef.current && editorRef.current) {
            quillRef.current = new Quill(editorRef.current, { theme: 'snow', placeholder: 'Start writing your article...' });
        }
    }, []);

    useEffect(() => {
        if (!image) {
            setPreview('');
            return;
        }
        const url = URL.createObjectURL(image);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [image]);

    const generateContent = async () => {
        if (!title.trim()) return toast.error('Please enter a blog title first');
        try {
            setLoading(true);
            const { data } = await axios.post('/api/blogs/generate', { prompt: title.trim() });
            if (data.success && quillRef.current) {
                quillRef.current.root.innerHTML = parse(data.content);
                toast.success('Draft generated');
            } else toast.error(data.message || 'Could not generate content');
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Gemini generation failed');
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) return toast.error('Please choose an image file');
        if (file.size > 5 * 1024 * 1024) return toast.error('Image should be smaller than 5 MB');
        setImage(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!image) return toast.error('Please upload a thumbnail');
        if (!quillRef.current?.root.innerHTML || quillRef.current.root.innerHTML === '<p><br></p>') return toast.error('Please write the blog content');

        try {
            setIsAdding(true);
            const blog = {
                title: title.trim(),
                subTitle: subTitle.trim(),
                description: quillRef.current.root.innerHTML,
                category,
                isPublished
            };
            const formData = new FormData();
            formData.append('blog', JSON.stringify(blog));
            formData.append('image', image);

            const { data } = await axios.post('/api/blogs/add', formData);
            if (data.success) {
                toast.success(data.message || 'Blog added successfully');
                setImage(null);
                setTitle('');
                setSubTitle('');
                setCategory('Startup');
                setIsPublished(false);
                if (quillRef.current) quillRef.current.root.innerHTML = '';
            } else toast.error(data.message || 'Failed to add blog');
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Failed to add blog');
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div className="mx-auto min-h-[calc(100vh-76px)] max-w-[1500px] px-[38px] pb-[50px] pt-[34px] max-[1100px]:px-[25px] max-[650px]:min-h-[calc(100vh-68px)] max-[650px]:px-3.5 max-[650px]:pb-[35px] max-[650px]:pt-6">
            <div className="mb-7 flex items-end justify-between gap-5 max-[650px]:flex-col max-[650px]:items-start">
                <div><div className="flex items-center gap-[7px] text-[9px] font-extrabold tracking-[.15em] text-primary"><span className="h-[5px] w-[5px] rounded-full bg-primary"></span> NEW CONTENT</div><h1 className="mb-1.5 mt-2 font-heading text-[29px] tracking-[-.04em] max-[650px]:text-[25px]">Create an article</h1><p className="m-0 text-xs text-[#858a9a]">Write something useful, select a category and publish when it is ready.</p></div>
                <button className="inline-flex cursor-pointer items-center gap-[9px] rounded-[9px] border border-[#dedfe7] bg-white px-[15px] py-[11px] text-[11px] font-bold text-[#6e7383] hover:border-[#c9c4f5] hover:text-primary" type="button" onClick={() => navigate('/admin/list-blog')}>Back to articles <ArrowRight size={16} /></button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-[minmax(0,1fr)_285px] items-start gap-[18px] max-[1100px]:grid-cols-[minmax(0,1fr)_250px] max-[900px]:grid-cols-1">
                <div className="rounded-[15px] border border-[#e8e9ef] bg-white shadow-[0_4px_18px_rgba(28,31,50,.035)] p-6 max-[650px]:p-4">
                    <label className="mb-[7px] block text-[11px] font-bold text-[#5e6373]">Title</label>
                    <input className="mb-[19px] w-full rounded-[9px] border border-[#dfe1e9] bg-white p-3.5 font-heading text-[17px] font-bold text-[#2b2f3f] outline-0 focus:border-[#b4acef] focus:shadow-[0_0_0_4px_rgba(91,76,230,.06)]" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Give your article a clear title" required />

                    <label className="mb-[7px] block text-[11px] font-bold text-[#5e6373]">Subtitle</label>
                    <input className="mb-[19px] w-full rounded-[9px] border border-[#dfe1e9] bg-white px-[13px] py-3 text-xs text-[#2b2f3f] outline-0 focus:border-[#b4acef] focus:shadow-[0_0_0_4px_rgba(91,76,230,.06)]" value={subTitle} onChange={(e) => setSubTitle(e.target.value)} placeholder="A short line that sets the context" required />

                    <div className="flex items-center justify-between">
                        <label className="mb-[7px] block text-[11px] font-bold text-[#5e6373]">Article content</label>
                        <button type="button" className="mb-[7px] inline-flex cursor-pointer items-center gap-1 rounded-[7px] bg-[#efedff] px-2.5 py-[7px] text-[10px] font-bold text-primary" onClick={generateContent} disabled={loading}>{loading ? 'Generating…' : <><Sparkles size={12} /> Generate with AI</>}</button>
                    </div>

                    <div className="relative overflow-hidden rounded-[10px] border border-[#dfe1e9]">
                        {loading && <div className="absolute inset-x-0 bottom-0 top-[45px] z-[5] grid place-items-center content-center gap-2 bg-white/85 text-[11px] text-[#5f6373] backdrop-blur-[4px]"><span className="h-[22px] w-[22px] animate-spin rounded-full border-2 border-[#ddd9fb] border-t-primary"></span> Creating a draft…</div>}
                        <div ref={editorRef} className="min-h-[380px]" />
                    </div>

                    <div className="mt-[22px] flex items-center justify-between gap-[15px] border-t border-[#eff0f4] pt-[19px] max-[650px]:flex-col max-[650px]:items-stretch">
                        <label className="group flex cursor-pointer items-center gap-[9px]">
                            <input className="peer hidden" type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
                            <span className="h-5 w-9 rounded-full bg-[#dfe1e8] p-0.5 transition-colors peer-checked:bg-primary peer-checked:[&>span]:translate-x-4"><span className="block h-4 w-4 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,.15)] transition-transform"></span></span>
                            <span><strong className="block text-[10px] text-[#555a6a]">Publish immediately</strong><small className="mt-0.5 block text-[8px] text-[#9a9eab]">Make this article visible on the public site.</small></span>
                        </label>

                        <button className="inline-flex cursor-pointer items-center gap-[9px] whitespace-nowrap rounded-[9px] bg-primary px-[15px] py-[11px] text-[11px] font-bold text-white shadow-[0_8px_18px_rgba(91,76,230,.18)] hover:bg-primary-dark max-[650px]:justify-center" type="submit" disabled={isAdding}>{isAdding ? 'Publishing…' : isPublished ? 'Publish article' : 'Save draft'} <ArrowRight size={16} /></button>
                    </div>
                </div>

                <aside className="grid gap-[15px] max-[900px]:grid-cols-2 max-[650px]:grid-cols-1">
                    <div className="rounded-[15px] border border-[#e8e9ef] bg-white shadow-[0_4px_18px_rgba(28,31,50,.035)] p-[17px]">
                        <div className="mb-3.5 flex items-center gap-[9px]"><span className="font-heading text-[10px] font-extrabold text-primary">01</span><div><h3 className="m-0 text-xs">Thumbnail</h3><p className="mb-0 mt-0.5 text-[9px] text-[#a0a4b0]">Recommended 16:9</p></div></div>
                        <label className="relative flex min-h-[165px] cursor-pointer flex-col items-center justify-center gap-[7px] overflow-hidden rounded-[11px] border border-dashed border-[#cbcdd8] bg-[#fafafd] p-[15px] text-center hover:border-[#aaa2ef] hover:bg-[#f9f8ff]" htmlFor="image">
                            {preview ? <img src={preview} alt="Preview" className="absolute inset-0 block h-full w-full object-cover" /> : <><ImagePlus size={40} className="text-[#a0a4b0]" /><strong className="text-[10px] text-[#555a6a]">Upload cover image</strong><span className="text-[8px] text-[#a0a4b0]">PNG, JPG or WEBP · max 5 MB</span></>}
                            {preview && <span className="absolute bottom-[9px] rounded-[7px] bg-[rgba(20,21,31,.75)] px-[9px] py-1.5 text-[9px] text-white">Change image</span>}
                            <input onChange={handleImageChange} type="file" id="image" accept="image/*" hidden />
                        </label>
                    </div>

                    <div className="rounded-[15px] border border-[#e8e9ef] bg-white shadow-[0_4px_18px_rgba(28,31,50,.035)] p-[17px]">
                        <div className="mb-3.5 flex items-center gap-[9px]"><span className="font-heading text-[10px] font-extrabold text-primary">02</span><div><h3 className="m-0 text-xs">Category</h3><p className="mb-0 mt-0.5 text-[9px] text-[#a0a4b0]">Help readers find it</p></div></div>
                        <div className="grid grid-cols-2 gap-1.5">
                            {blogCategories.filter((item) => item !== 'All').map((item) => <button type="button" key={item} onClick={() => setCategory(item)} className={`cursor-pointer rounded-lg border px-[7px] py-[9px] text-[10px] ${category === item ? 'border-[#cbc5f5] bg-[#f2f0ff] text-primary' : 'border-[#e2e3e9] bg-white text-[#7d8291]'}`}>{item}</button>)}
                        </div>
                    </div>

                    <div className="flex gap-[9px] rounded-[11px] bg-[#f1efff] p-3.5 max-[900px]:col-span-full max-[650px]:col-auto"><span className="text-primary"><Sparkles size={14} /></span><div><strong className="block text-[10px] text-[#4e5364]">Publishing checklist</strong><p className="mb-0 mt-1 text-[9px] leading-[1.55] text-[#878b9b]">Use a specific title, readable paragraphs and a strong cover image before publishing.</p></div></div>
                </aside>
            </form>
        </div>
    );
};

export default AddBlog;
