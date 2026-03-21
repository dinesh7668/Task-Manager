import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineCheckCircle } from 'react-icons/hi';

/**
 * LoginPage - User login with crimson dark aesthetic
 */
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const bgRef = useRef(null);

  // Animated background particles
  useEffect(() => {
    const container = bgRef.current;
    if (!container) return;
    const particles = [];
    for (let i = 0; i < 15; i++) {
      const p = document.createElement('div');
      const size = Math.random() * 3 + 1;
      p.style.cssText = `
        position:absolute; border-radius:50%; pointer-events:none;
        width:${size}px; height:${size}px;
        left:${Math.random()*100}%; bottom:-10px;
        background:rgba(220,38,38,${Math.random()*0.4+0.1});
        box-shadow:0 0 ${size*4}px rgba(220,38,38,${Math.random()*0.3});
        animation:floatParticle ${Math.random()*15+10}s ${Math.random()*10}s linear infinite;
      `;
      container.appendChild(p);
      particles.push(p);
    }
    return () => particles.forEach(p => { if (container.contains(p)) container.removeChild(p); });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);
    if (result.success) {
      toast.success('Welcome back!');
      navigate('/');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: '#080808' }}>
      {/* Animated Background */}
      <div ref={bgRef} className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Main crimson glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(220,38,38,0.12) 0%, rgba(220,38,38,0.03) 50%, transparent 70%)', animation: 'pulseGlow 8s ease-in-out infinite' }} />
        {/* Bottom-right glow */}
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(239,68,68,0.08) 0%, transparent 60%)', animation: 'floatGlow 10s ease-in-out infinite' }} />
        {/* Grid */}
        <div className="absolute inset-0"
          style={{ backgroundImage: 'linear-gradient(rgba(220,38,38,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(220,38,38,0.03) 1px,transparent 1px)', backgroundSize: '60px 60px', maskImage: 'radial-gradient(ellipse 50% 50% at 50% 50%,black 20%,transparent 80%)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center">
              <HiOutlineCheckCircle className="text-white text-2xl" />
            </div>
          </div>
          <h1 className="text-3xl font-bold gradient-text">TaskFlow</h1>
          <p className="text-neutral-500 mt-2 text-sm">Sign in to manage your tasks</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8 shadow-2xl" style={{ background: 'rgba(17,17,17,0.9)', border: '1px solid rgba(239,68,68,0.1)', backdropFilter: 'blur(20px)' }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1.5">Email</label>
              <div className="relative">
                <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-neutral-100 placeholder-neutral-600
                    focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500/50 transition-all"
                  style={{ background: 'rgba(30,30,30,0.8)', border: '1px solid rgba(255,255,255,0.08)' }}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1.5">Password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-neutral-100 placeholder-neutral-600
                    focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500/50 transition-all"
                  style={{ background: 'rgba(30,30,30,0.8)', border: '1px solid rgba(255,255,255,0.08)' }}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white gradient-primary
                hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Signing in...
                </span>
              ) : 'Sign In →'}
            </button>
          </form>

          <p className="text-center text-sm text-neutral-500 mt-6">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
