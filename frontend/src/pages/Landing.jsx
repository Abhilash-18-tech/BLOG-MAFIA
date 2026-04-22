import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import Typewriter from 'typewriter-effect';
import Lottie from 'lottie-react';
import { PenTool, Globe, Sparkles, BarChart2, ArrowRight, Clock, Users, ArrowUpRight, TrendingUp } from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const Landing = () => {
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 1000], [0, -100]);
  const yParallaxSlow = useTransform(scrollY, [0, 1000], [0, 100]);

  const LottieComponent = Lottie.default || Lottie;
  const TypewriterComponent = Typewriter.default || Typewriter;

  const [lottieData, setLottieData] = useState(null);

  useEffect(() => {
    // Fallback animation data (simple dots) if URL fails, but try a public free asset first
    fetch('https://assets3.lottiefiles.com/packages/lf20_w51pcehl.json')
      .then(res => res.json())
      .then(data => setLottieData(data))
      .catch(() => console.error('Lottie load failed'));
  }, []);

  return (
    <div className="bg-[#0b0c10] text-gray-100 min-h-screen font-sans selection:bg-purple-500/30 overflow-x-hidden relative">
      
      {/* Dynamic Animated Gradient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-white/5 blur-[100px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] -right-[10%] w-[40vw] h-[40vw] rounded-full bg-white/5 blur-[100px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.1, 1], y: [0, 50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-white/5 blur-[100px]" 
        />
      </div>

      {/* Floating Header */}
      <header className="fixed top-0 w-full z-50 bg-[#0b0c10]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center font-bold text-black shadow-lg shadow-white/10">
               B
             </div>
             <span className="font-bold text-xl tracking-tight text-white">
               BLOG-MAFIA
             </span>
          </div>
          <Link
            to="/login"
            className="px-5 py-2 rounded-full font-medium text-sm transition-all bg-white/10 hover:bg-white/20 text-white border border-white/5"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* 1. Hero Section */}
      <section className="relative z-10 pt-40 pb-32 px-6 min-h-screen flex flex-col items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm font-medium mb-8 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
            <Sparkles size={16} className="text-gray-400" />
            <span>The future of publishing is here</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight leading-tight mb-6">
            Share your voice <br className="hidden md:block"/>
            <span className="text-white">
              with the world
            </span>
          </h1>

          <div className="text-xl md:text-2xl text-gray-400 mb-10 h-16">
            <span className="font-light">Design, write, and </span>
            <span className="font-semibold text-gray-200">
              <TypewriterComponent
                options={{
                  strings: ['publish easily.', 'grow your audience.', 'analyze your stats.', 'monetize seamlessly.'],
                  autoStart: true,
                  loop: true,
                  delay: 70,
                  deleteSpeed: 50,
                  cursor: '_'
                }}
              />
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="group px-8 py-4 rounded-full font-bold text-lg bg-white text-black hover:bg-gray-200 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all active:scale-95 flex items-center gap-2"
            >
              Create Your Blog
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
          </div>
        </motion.div>

        {lottieData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="absolute right-[5%] bottom-[10%] w-64 opacity-50 blur-[2px] hidden lg:block pointer-events-none"
          >
            <LottieComponent animationData={lottieData} loop={true} />
          </motion.div>
        )}
      </section>

      {/* 2. Blog Preview Mock UI (Parallax) */}
      <section className="relative z-10 py-20 px-6 overflow-hidden">
        <motion.div 
          style={{ y: yParallaxSlow }}
          className="max-w-5xl mx-auto rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-2xl p-6 md:p-10 relative"
        >
          {/* Mock Window Controls */}
          <div className="flex gap-2 mb-8">
            <div className="w-3 h-3 rounded-full bg-white/20"></div>
            <div className="w-3 h-3 rounded-full bg-white/20"></div>
            <div className="w-3 h-3 rounded-full bg-white/20"></div>
          </div>
          
          <div className="space-y-6">
             <div className="w-3/4 h-12 bg-white/10 rounded-lg animate-pulse" />
             <div className="w-1/4 h-4 bg-white/5 rounded-full animate-pulse" />
             <div className="pt-6 space-y-3">
               <div className="w-full h-4 bg-white/5 rounded-full animate-pulse" />
               <div className="w-full h-4 bg-white/5 rounded-full animate-pulse" />
               <div className="w-5/6 h-4 bg-white/5 rounded-full animate-pulse" />
             </div>
          </div>

          <motion.div 
            style={{ y: yParallax }}
            className="absolute -right-8 -bottom-12 w-64 bg-[#1a1b23] rounded-2xl p-6 border border-white/10 shadow-2xl hidden md:block"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-gray-200">Visitors</span>
              <BarChart2 size={16} className="text-gray-400" />
            </div>
            <p className="text-3xl font-bold text-white">12,405</p>
            <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">+24% this week <ArrowUpRight size={12} /></p>
          </motion.div>
        </motion.div>
      </section>

      {/* 3. Features Section */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center mb-20"
          >
             <h2 className="text-4xl md:text-5xl font-bold mb-4">Powerful Features</h2>
             <p className="text-gray-400 max-w-2xl mx-auto text-lg">Designed for content creators who demand both beauty and performance.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: PenTool, title: 'Flawless Editor', desc: 'A rich text editor that gets out of your way and lets you focus strictly on your writing.' },
              { icon: Sparkles, title: 'AI-Powered', desc: 'Auto-generate tags, summaries, and discover related content effortlessly.' },
              { icon: Globe, title: 'Global Reach', desc: 'Instant delivery network ensures your content loads blazing fast worldwide.' },
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                whileHover={{ y: -5 }}
                className="bg-[#111218] border border-white/5 p-8 rounded-3xl hover:bg-[#1a1b23] hover:border-white/10 transition-all group"
              >
                <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:bg-white/10 transition-transform`}>
                  <feature.icon size={24} className="text-gray-200" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Stats Section */}
      <section className="relative z-10 py-24 border-y border-white/5 bg-black/20 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { icon: Users, stat: '500K+', label: 'Active Writers' },
            { icon: Clock, stat: '2.5M', label: 'Posts Published' },
            { icon: TrendingUp, stat: '99.9%', label: 'Uptime SLA' },
            { icon: Globe, stat: '120+', label: 'Countries' },
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center"
            >
              <item.icon className="text-gray-400 mb-4" size={32} />
              <div className="text-4xl font-extrabold text-white mb-2">{item.stat}</div>
              <div className="text-gray-500 font-medium">{item.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. Final CTA */}
      <section className="relative z-10 py-40 px-6 flex flex-col items-center justify-center text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative max-w-4xl mx-auto w-full p-12 md:p-20 rounded-[3rem] overflow-hidden group"
        >
          <div className="absolute inset-0 bg-[#111218] border border-white/10 group-hover:bg-[#1a1b23] transition-all duration-700"></div>
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-extrabold mb-6 text-white">
              Ready to start?
            </h2>
            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-xl mx-auto">
              Join the ecosystem of the world's most creative minds. Your audience is waiting.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-10 py-5 rounded-full font-bold text-lg bg-white text-black hover:bg-gray-200 hover:scale-105 transition-all active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              Get Started for Free
              <ArrowRight size={20} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* 6. Footer */}
      <footer className="relative z-10 border-t border-white/5 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded bg-gradient-to-br from-orange-500 to-purple-600 font-bold text-white shadow-sm">B</div>
            <span className="font-bold text-lg text-white">Blogverse</span>
          </div>
          <div className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Blogverse Inc. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm text-gray-400">
            <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
            <Link to="/register" className="hover:text-white transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;