import React from 'react';
import { motion } from 'framer-motion';
import { PenTool, Globe, Sparkles, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="bg-[#0b0c10] text-gray-100 min-h-screen font-sans selection:bg-white/30 overflow-x-hidden relative pt-20">
      {/* Background orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-white/5 blur-[100px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.1, 1], y: [0, 50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-white/5 blur-[100px]" 
        />
      </div>

      <div className="max-w-4xl mx-auto px-6 py-24 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white mb-6 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
            <span className="font-bold text-3xl tracking-tight text-black">
               B
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
            About Blog Mafia
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            The definitive platform for modern creators, thinkers, and writers to build their digital presence.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed space-y-8"
        >
          <p className="text-2xl font-light text-white border-l-4 border-white/20 pl-6 my-10">
            "We believe that great ideas deserve a great canvas. We built Blog Mafia to strip away the complex layers of publishing, so you can focus entirely on what matters most: your words."
          </p>

          <p>
            Founded by a collective of passionate developers and writers, <strong>Blog Mafia</strong> was born out of frustration with existing platforms. They were either too bloated with features no one needed, or too simple to build a real audience. 
          </p>

          <p>
            We created a middle ground: an elegant, lightning-fast ecosystem that respects the craft of writing. With our minimalist but powerful rich-text editor, deep analytics, and global reach, every post is staged to perform at its best.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-16">
            {[
              { icon: PenTool, title: 'Writers First', text: 'An interface designed strictly around the craft. No distractions.' },
              { icon: Sparkles, title: 'Intelligent Tools', text: 'Smart summaries, auto-tagging, and contextual discovery.' },
              { icon: Users, title: 'Incredible Community', text: 'Connect with readers who actually care about your niche.' },
              { icon: Globe, title: 'Speed matters', text: 'We pre-render and edge-cache so your content loads instantly.' }
            ].map((item, i) => (
              <div key={i} className="bg-[#111218] p-6 rounded-2xl border border-white/5 hover:bg-[#1a1b23] transition-colors">
                <item.icon className="text-white mb-4" size={28} />
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-base">{item.text}</p>
              </div>
            ))}
          </div>

          <p>
            Whether you are documenting your journey, teaching a highly technical concept, or building a brand, Blog Mafia equips you with the professional tools you need to stand out in the modern web.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 pt-10 border-t border-white/10 text-center flex flex-col items-center"
        >
          <h2 className="text-3xl font-bold text-white mb-6">Ready to share your voice?</h2>
          <Link 
            to="/register"
            className="px-8 py-4 rounded-full font-bold text-lg bg-white text-black hover:bg-gray-200 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            Join Blog Mafia
          </Link>
        </motion.div>

      </div>
    </div>
  );
};

export default About;