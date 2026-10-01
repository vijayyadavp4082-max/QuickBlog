import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const Login = () => {
    const { axios, setToken } = useAppContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim() || !password) {
            toast.error('Please enter your email and password');
            return;
        }

        try {
            setLoading(true);
            const { data } = await axios.post('/api/admin/login', {
                email: email.trim(),
                password
            });

            if (data.success) {
                setToken(data.token);
                localStorage.setItem('token', data.token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
                toast.success('Welcome back');
            } else {
                toast.error(data.message || 'Invalid credentials');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative grid min-h-screen place-items-center overflow-hidden bg-[#f6f7fb] p-[30px] max-[650px]:p-4">
            <div className="absolute -left-[180px] -top-[250px] h-[450px] w-[450px] rounded-full bg-[rgba(91,76,230,.12)] blur-[2px]"></div>
            <div className="absolute -bottom-[230px] -right-40 h-[420px] w-[420px] rounded-full bg-[rgba(177,108,192,.10)] blur-[2px]"></div>

            <div className="relative z-[1] w-[min(430px,100%)] rounded-[20px] border border-[#e4e5ec] bg-white/95 p-[35px] shadow-[0_24px_70px_rgba(26,29,50,.12)] max-[650px]:px-5 max-[650px]:py-[25px]">
                <div className="flex items-center justify-between border-b border-[#eff0f4] pb-[23px]">
                    <img src={assets.logo} alt="QuickBlog" className="block w-[145px] max-w-full" />
                    <span className="text-[9px] font-extrabold tracking-[.15em] text-[#999dab]">STUDIO</span>
                </div>

                <div className="pb-5 pt-7">
                    <span className="mb-2 block text-[10px] font-extrabold tracking-[.16em] text-primary">PRIVATE WORKSPACE</span>
                    <h1 className="mb-2 mt-[7px] font-heading text-[30px] tracking-[-.04em]">Welcome back.</h1>
                    <p className="m-0 text-xs leading-[1.7] text-[#858a99]">Sign in to manage your articles, comments and publication.</p>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-[17px]">
                    <label className="text-[10px] font-bold text-[#5b6070]">
                        Email address
                        <input
                            type="email"
                            placeholder="admin@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            required
                            className="mt-[7px] w-full rounded-[9px] border border-[#dfe1e8] bg-white p-3 text-xs text-[#272b3a] outline-0 focus:border-[#afa7ef] focus:shadow-[0_0_0_4px_rgba(91,76,230,.06)]"
                        />
                    </label>

                    <label className="text-[10px] font-bold text-[#5b6070]">
                        Password
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                            required
                            className="mt-[7px] w-full rounded-[9px] border border-[#dfe1e8] bg-white p-3 text-xs text-[#272b3a] outline-0 focus:border-[#afa7ef] focus:shadow-[0_0_0_4px_rgba(91,76,230,.06)]"
                        />
                    </label>

                    <button type="submit" disabled={loading} className="flex cursor-pointer items-center justify-center gap-2.5 rounded-[9px] bg-primary p-3 text-xs font-bold text-white">
                        {loading ? 'Signing in...' : 'Sign in'}
                        {!loading && <ArrowRight size={17} />}
                    </button>
                </form>

                <p className="mb-0 mt-[22px] text-center text-[9px] text-[#a1a4b0]">QuickBlog content management workspace</p>
            </div>
        </div>
    );
};

export default Login;
