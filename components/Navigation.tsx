import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone } from 'lucide-react';
import { NavLink, MobileLink } from './ui/NavLink';

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="sticky top-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100 px-6 md:px-10">
      <div className="flex justify-between items-center py-6 w-full max-w-7xl mx-auto">
        <div className="z-50 select-none cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img src="https://i.imgur.com/FwzmpAp.png" alt="ZEROL" className="h-8 md:h-10 w-auto" />
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex gap-10 text-sm font-medium text-gray-600">
          <NavLink href="#services" onClick={(e) => handleScroll(e, 'services')}>서비스 분야</NavLink>
          <NavLink href="#works" onClick={(e) => handleScroll(e, 'works')}>작업사례</NavLink>
          <NavLink href="#about" onClick={(e) => handleScroll(e, 'about')}>제롤 알아보기</NavLink>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-3 text-lg font-bold text-[var(--primary-color)]">
            <Phone size={18} />
            <a href="tel:010-8143-0654" className="hover:opacity-80 transition-opacity">010-8143-0654</a>
            <span className="text-gray-300 text-sm">|</span>
            <a href="tel:064-753-0654" className="hover:opacity-80 transition-opacity">064-753-0654</a>
          </div>
          <a 
            href="#contact" 
            onClick={(e) => handleScroll(e, 'contact')}
            className="hidden md:block border border-black px-6 py-2 rounded-full text-sm font-medium hover:bg-black hover:text-white transition duration-300"
          >
            견적문의 및 상담
          </a>
          {/* Mobile Menu Button */}
          <button className="md:hidden z-50 p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Fullscreen Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "tween", duration: 0.4 }}
              className="fixed inset-0 bg-white z-40 flex flex-col justify-center items-center gap-8 text-2xl font-bold md:hidden"
            >
              <MobileLink href="#services" setIsMenuOpen={setIsMenuOpen} onClick={(e) => handleScroll(e, 'services')}>서비스 분야</MobileLink>
              <MobileLink href="#works" setIsMenuOpen={setIsMenuOpen} onClick={(e) => handleScroll(e, 'works')}>작업사례</MobileLink>
              <MobileLink href="#about" setIsMenuOpen={setIsMenuOpen} onClick={(e) => handleScroll(e, 'about')}>제롤 알아보기</MobileLink>
              <a href="tel:010-8143-0654" className="text-[var(--primary-color)] mt-4 text-xl">010-8143-0654</a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navigation;