import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ZoomIn } from 'lucide-react';
import { PortfolioItemData, PortfolioPageProps } from '../types';
import { Lightbox } from './ui/Lightbox';
import { useSiteData } from './SiteContext';

export const PortfolioPage: React.FC<PortfolioPageProps> = ({ items, onBack }) => {
  const { data } = useSiteData();
  const [filter, setFilter] = useState('All');
  const [selectedImage, setSelectedImage] = useState<PortfolioItemData | null>(null);

  // Extract unique categories from items
  const categories = ['All', ...Array.from(new Set(items.map(item => item.category || 'Other')))];

  const filteredItems = filter === 'All' 
    ? items 
    : items.filter(item => item.category === filter);

  return (
    <div className="min-h-screen relative z-50 bg-[var(--bg-color)] text-[var(--text-color)]">
      
      {/* Fixed Header for Portfolio Page */}
      <div className="sticky top-0 z-40 border-b border-[var(--text-color)]/10 px-6 md:px-10 py-6 flex items-center justify-between bg-[var(--bg-color)]/90 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 rounded-full hover:bg-[var(--text-color)]/10 transition-colors group"
          >
            <ArrowLeft className="transition-colors text-[var(--text-color)]" />
          </button>
          <h2 className="text-xl font-bold tracking-tight">All Projects</h2>
        </div>
        <img src="https://i.imgur.com/s39s4ud.png" alt="Logo" className="h-8 w-auto opacity-50" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12">
        
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 border ${
                filter === cat 
                  ? 'bg-[var(--primary-color)] text-white border-[var(--primary-color)]' 
                  : 'bg-transparent text-[var(--text-color)]/70 border-[var(--text-color)]/20 hover:border-[var(--text-color)] hover:text-[var(--text-color)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredItems.map((item, idx) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={`${item.title}-${idx}`}
                className="group cursor-pointer"
                onClick={() => setSelectedImage(item)}
              >
                <div className="aspect-[4/3] bg-[var(--text-color)]/5 rounded-2xl overflow-hidden relative mb-4 border border-[var(--text-color)]/5">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                        <ZoomIn size={24} />
                    </div>
                  </div>
                </div>
                
                <div className="px-1">
                    <span className="text-xs font-bold uppercase tracking-wider mb-1 block text-[var(--primary-color)]">
                        {item.category}
                    </span>
                    <h3 className="text-lg font-bold group-hover:underline underline-offset-4 decoration-2 decoration-[var(--primary-color)]">
                        {item.title}
                    </h3>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredItems.length === 0 && (
          <div className="py-20 text-center text-[var(--text-color)]/50">
            해당 카테고리에 등록된 프로젝트가 없습니다.
          </div>
        )}
      </div>

      {/* Shared Lightbox Component */}
      <Lightbox 
        selectedImage={selectedImage}
        items={filteredItems}
        onClose={() => setSelectedImage(null)}
        onImageChange={setSelectedImage}
      />
    </div>
  );
};