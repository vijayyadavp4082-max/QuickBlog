import React, { useEffect, useMemo, useState } from 'react';
import { FileText, MessageSquare, PenLine, RefreshCw, ArrowRight, Sparkles, Ellipsis } from 'lucide-react';
import BlogTableItem from './BlogTableItem';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const { axios, navigate } = useAppContext();
    const [dashboardData, setDashboardData] = useState({ blogs: 0, comments: 0, drafts: 0, recentBlogs: [] });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchDashboardData = async (manual = false) => {
        try {
            manual ? setRefreshing(true) : setLoading(true);
            const { data } = await axios.get('/api/admin/dashboard');
            if (data.success) {
                setDashboardData({
                    blogs: data.dashboardData?.blogs ?? 0,
                    comments: data.dashboardData?.comments ?? 0,
                    drafts: data.dashboardData?.drafts ?? 0,
                    recentBlogs: data.dashboardData?.recentBlogs ?? []
                });
            } else toast.error(data.message || 'Unable to load dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Unable to load dashboard');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => { fetchDashboardData(); }, []);

    const published = Math.max(dashboardData.blogs - dashboardData.drafts, 0);
    const publishRate = dashboardData.blogs ? Math.round((published / dashboardData.blogs) * 100) : 0;

    const stats = useMemo(() => [
        { label: 'Total articles', value: dashboardData.blogs, note: 'Across your publication', icon: FileText, tone: 'violet' },
        { label: 'Reader comments', value: dashboardData.comments, note: 'Community activity', icon: MessageSquare, tone: 'blue' },
        { label: 'Drafts', value: dashboardData.drafts, note: 'Waiting to be published', icon: PenLine, tone: 'amber' }
    ], [dashboardData]);

    const toneIcon = { violet: 'bg-[#f2f1ff] text-primary', blue: 'bg-[#eef5ff] text-[#3974e8]', amber: 'bg-[#fff6e7] text-[#c9821a]' };

    if (loading) {
        return (
            <div className="mx-auto min-h-[calc(100vh-76px)] max-w-[1500px] px-[38px] pb-[50px] pt-[34px] max-[1100px]:px-[25px] max-[650px]:min-h-[calc(100vh-68px)] max-[650px]:px-3.5 max-[650px]:pb-[35px] max-[650px]:pt-6">
                <div className="h-7 w-[250px] animate-soft-pulse rounded-[7px] bg-[#e7e8ee]"></div>
                <div className="mb-[25px] mt-2.5 h-3 w-[340px] animate-soft-pulse rounded-[5px] bg-[#e7e8ee]"></div>
                <div className="mb-5 grid grid-cols-3 gap-[17px] max-[900px]:grid-cols-2 max-[650px]:grid-cols-1">{[1,2,3].map((i) => <div className="h-[165px] animate-soft-pulse rounded-[15px] bg-[#e7e8ee]" key={i}></div>)}</div>
                <div className="grid grid-cols-[minmax(0,1.75fr)_minmax(280px,.85fr)] gap-5 max-[900px]:grid-cols-1"><div className="min-h-[450px] animate-soft-pulse rounded-[15px] bg-[#e7e8ee]"></div><div className="min-h-[390px] animate-soft-pulse rounded-[15px] bg-[#e7e8ee]"></div></div>
            </div>
        );
    }

    return (
        <div className="mx-auto min-h-[calc(100vh-76px)] max-w-[1500px] px-[38px] pb-[50px] pt-[34px] max-[1100px]:px-[25px] max-[650px]:min-h-[calc(100vh-68px)] max-[650px]:px-3.5 max-[650px]:pb-[35px] max-[650px]:pt-6">
            <div className="mb-7 flex items-center justify-between gap-5 max-[650px]:flex-col max-[650px]:items-start">
                <div>
                    <div className="flex items-center gap-[7px] text-[9px] font-extrabold tracking-[.15em] text-primary"><span className="h-[5px] w-[5px] rounded-full bg-primary"></span> ADMIN OVERVIEW</div>
                    <h1 className="mb-1.5 mt-2 font-heading text-[29px] tracking-[-.04em] max-[650px]:text-[25px]">Good to see you, Admin.</h1>
                    <p className="m-0 text-xs text-[#858a9a]">Here is a quick look at your QuickBlog workspace.</p>
                </div>
                <button className="inline-flex cursor-pointer items-center gap-[9px] rounded-[9px] border border-[#dedfe7] bg-white px-[15px] py-[11px] text-[11px] font-bold text-[#6e7383] hover:border-[#c9c4f5] hover:text-primary" onClick={() => fetchDashboardData(true)} disabled={refreshing}>
                    <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
                    {refreshing ? 'Refreshing' : 'Refresh'}
                </button>
            </div>

            <div className="mb-5 grid grid-cols-3 gap-[17px] max-[900px]:grid-cols-2 max-[650px]:grid-cols-1">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div className="relative min-h-[165px] overflow-hidden rounded-[15px] border border-[#e8e9ef] bg-white p-[19px] shadow-[0_4px_18px_rgba(28,31,50,.035)] after:absolute after:-bottom-[55px] after:-right-[50px] after:h-[100px] after:w-[100px] after:rounded-full after:bg-[rgba(91,76,230,.05)] after:content-[''] max-[900px]:last:col-span-full max-[650px]:last:col-auto" key={stat.label}>
                            <div className="flex items-center justify-between">
                                <div className={`grid h-[38px] w-[38px] place-items-center rounded-[10px] ${toneIcon[stat.tone]}`}><Icon size={19} /></div>
                                <Ellipsis size={16} className="text-[#b4b7c2]" />
                            </div>
                            <div className="mt-[18px] font-heading text-[31px] font-extrabold tracking-[-.05em]">{stat.value}</div>
                            <div className="text-xs font-bold text-[#4e5363]">{stat.label}</div>
                            <p className="mb-0 mt-[3px] text-[10px] text-[#999dab]">{stat.note}</p>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-[minmax(0,1.75fr)_minmax(280px,.85fr)] gap-5 max-[900px]:grid-cols-1">
                <section className="rounded-[15px] border border-[#e8e9ef] bg-white shadow-[0_4px_18px_rgba(28,31,50,.035)]">
                    <div className="flex min-h-[78px] items-center justify-between border-b border-[#eff0f4] px-5 py-[17px]">
                        <div>
                            <span className="mb-2 block text-[10px] font-extrabold tracking-[.16em] text-primary">CONTENT</span>
                            <h2 className="m-0 font-heading text-base tracking-[-.025em]">Recent articles</h2>
                        </div>
                        <button className="inline-flex cursor-pointer items-center gap-1 bg-transparent text-[11px] font-bold text-primary" onClick={() => navigate('/admin/list-blog')}>View all <ArrowRight size={14} /></button>
                    </div>

                    {dashboardData.recentBlogs.length ? (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[670px] border-collapse">
                                <thead>
                                    <tr><th className="border-b border-[#eff0f4] bg-[#fbfbfd] px-3.5 py-3 text-left text-[9px] uppercase tracking-[.09em] text-[#a1a5b1]">#</th><th className="border-b border-[#eff0f4] bg-[#fbfbfd] px-3.5 py-3 text-left text-[9px] uppercase tracking-[.09em] text-[#a1a5b1]">Article</th><th className="border-b border-[#eff0f4] bg-[#fbfbfd] px-3.5 py-3 text-left text-[9px] uppercase tracking-[.09em] text-[#a1a5b1]">Date</th><th className="border-b border-[#eff0f4] bg-[#fbfbfd] px-3.5 py-3 text-left text-[9px] uppercase tracking-[.09em] text-[#a1a5b1]">Status</th><th className="border-b border-[#eff0f4] bg-[#fbfbfd] px-3.5 py-3 text-left text-[9px] uppercase tracking-[.09em] text-[#a1a5b1]">Action</th></tr>
                                </thead>
                                <tbody>
                                    {dashboardData.recentBlogs.map((blog, index) => (
                                        <BlogTableItem key={blog._id || blog.id || index} blog={blog} fetchBlogs={fetchDashboardData} index={index + 1} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="px-5 py-[65px] text-center"><div className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-[#f1efff] text-primary"><Sparkles size={20} /></div><h3 className="mb-1 mt-3 font-heading text-sm">No articles yet</h3><p className="m-0 text-[11px] text-[#9296a4]">Create your first article to start building your publication.</p><button className="mt-[13px] inline-flex cursor-pointer items-center gap-1 rounded-lg bg-primary px-3 py-[9px] text-[10px] font-bold text-white" onClick={() => navigate('/admin/add-blog')}>Create article <ArrowRight size={12} /></button></div>
                    )}
                </section>

                <section className="rounded-[15px] border border-[#e8e9ef] bg-white shadow-[0_4px_18px_rgba(28,31,50,.035)]">
                    <div className="flex min-h-[78px] items-center justify-between border-b border-[#eff0f4] px-5 py-[17px]">
                        <div><span className="mb-2 block text-[10px] font-extrabold tracking-[.16em] text-primary">HEALTH</span><h2 className="m-0 font-heading text-base tracking-[-.025em]">Publication status</h2></div>
                    </div>

                    <div className="mx-auto mb-[25px] mt-[30px] grid h-[154px] w-[154px] place-items-center rounded-full [background:conic-gradient(var(--color-primary)_var(--progress),#ececf3_var(--progress))]" style={{ '--progress': `${publishRate * 3.6}deg` }}>
                        <div className="grid h-[118px] w-[118px] place-content-center rounded-full bg-white text-center"><strong className="font-heading text-[27px] tracking-[-.05em]">{publishRate}%</strong><span className="text-[9px] uppercase tracking-[.1em] text-[#999dab]">published</span></div>
                    </div>

                    <div className="px-5">
                        <div className="grid grid-cols-[10px_1fr_auto] items-center gap-2 border-b border-[#f0f1f4] py-2.5 text-[11px] text-[#727788]"><span className="h-[7px] w-[7px] rounded-full bg-primary"></span><span>Published</span><strong className="text-[#303444]">{published}</strong></div>
                        <div className="grid grid-cols-[10px_1fr_auto] items-center gap-2 border-b border-[#f0f1f4] py-2.5 text-[11px] text-[#727788]"><span className="h-[7px] w-[7px] rounded-full bg-[#e4a23c]"></span><span>Drafts</span><strong className="text-[#303444]">{dashboardData.drafts}</strong></div>
                        <div className="grid grid-cols-[10px_1fr_auto] items-center gap-2 py-2.5 text-[11px] text-[#727788]"><span className="h-[7px] w-[7px] rounded-full bg-[#4f89e8]"></span><span>Comments</span><strong className="text-[#303444]">{dashboardData.comments}</strong></div>
                    </div>

                    <div className="m-[18px] flex gap-[9px] rounded-[10px] bg-[#f8f7ff] p-3">
                        <span className="text-primary"><Sparkles size={14} /></span>
                        <p className="m-0 text-[9px] leading-[1.5] text-[#858a9a]">Keep your drafts moving. A consistent publishing rhythm makes the dashboard easier to manage.</p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Dashboard;
