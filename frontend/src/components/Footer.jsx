import { Link as RouterLink } from 'react-router-dom';
import { Globe, Mail, Link as LinkIcon } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full border-t border-[var(--border)] bg-[var(--surface)] mt-auto pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-[var(--muted)]">
        {/* Brand & Info */}
        <div className="md:col-span-2 space-y-6">
          <RouterLink to="/" className="inline-block text-2xl font-black tracking-tight text-[var(--ink)]">
            BLOG-MAFIA
          </RouterLink>
          <p className="text-base max-w-sm leading-relaxed">
            The definitive platform for modern creators, thinkers, and writers to build their digital presence, share their voice, and grow an audience without distractions.
          </p>
          <div className="flex items-center gap-4 text-[var(--ink)]">
            <a href="https://github.com/Abhilash-18-tech" target="_blank" rel="noreferrer" title="Github" className="p-2 border border-[var(--border)] rounded-full hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all transform hover:-translate-y-1 flex items-center justify-center">
              <span className="font-bold text-sm leading-none px-1">GH</span>
            </a>
            <a href="https://www.linkedin.com/in/abhilash-jamalla/" target="_blank" rel="noreferrer" title="LinkedIn" className="p-2 border border-[var(--border)] rounded-full hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all transform hover:-translate-y-1 flex items-center justify-center">
              <span className="font-bold text-sm leading-none px-1">IN</span>
            </a>
            <a href="https://abhii.tech" target="_blank" rel="noreferrer" title="Portfolio" className="p-2 border border-[var(--border)] rounded-full hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all transform hover:-translate-y-1 flex items-center justify-center">
              <Globe size={20} />
            </a>
            <a href="mailto:abhilashyadav118@gmail.com" title="Email" className="p-2 border border-[var(--border)] rounded-full hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all transform hover:-translate-y-1 flex items-center justify-center">
              <Mail size={20} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-6">
          <h3 className="font-bold text-[var(--ink)] uppercase tracking-wider text-sm">Company</h3>
          <ul className="space-y-4">
            <li><RouterLink to="/about" className="hover:text-[var(--accent)] transition-colors">About Us</RouterLink></li>
            <li><RouterLink to="/" className="hover:text-[var(--accent)] transition-colors">Careers</RouterLink></li>
            <li><RouterLink to="/" className="hover:text-[var(--accent)] transition-colors">Categories</RouterLink></li>
            <li><RouterLink to="/contact" className="hover:text-[var(--accent)] transition-colors">Contact</RouterLink></li>
          </ul>
        </div>

        {/* Legal & Resources */}
        <div className="space-y-6">
          <h3 className="font-bold text-[var(--ink)] uppercase tracking-wider text-sm">Resources</h3>
          <ul className="space-y-4">
            <li><RouterLink to="/" className="hover:text-[var(--accent)] transition-colors">Privacy Policy</RouterLink></li>
            <li><RouterLink to="/" className="hover:text-[var(--accent)] transition-colors">Terms of Service</RouterLink></li>
            <li><RouterLink to="/" className="hover:text-[var(--accent)] transition-colors">Help Center</RouterLink></li>
            <li><RouterLink to="/" className="hover:text-[var(--accent)] transition-colors">API Documentation</RouterLink></li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal */}
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[var(--muted)]">
        <p>© 2026 Blog Mafia. All rights reserved.</p>
        <p>Built with ❤️ for writers.</p>
      </div>
    </footer>
  );
};

export default Footer;
