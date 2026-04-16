import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden mb-12 rounded-none md:rounded-b-[2rem]">
      {/* Background Image */}
      <img
        src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop"
        alt="Minimalist desk"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-3xl"
        >
          <span className="uppercase tracking-widest text-xs font-semibold text-white/80 mb-4 block">
            Welcome to the Community
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight font-brand">
            Minimal, Clean & Professional <br /> Blogging Experience
          </h1>
          <p className="text-lg md:text-xl text-white/90 font-light">
            Discover curated stories, write your own thoughts, and connect with creative minds.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
