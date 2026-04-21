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
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-16 pb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
           <div>
              <span className="text-[var(--primary-color)] font-bold text-sm tracking-widest mb-3 block">작업 사례</span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">제롤광고산업이 만든 결과물</h2>
           </div>
           <div className="flex gap-4">
             <button 
               onClick={onBack} 
               className="border border-gray-300 text-gray-600 px-6 py-3 rounded-lg text-sm font-bold hover:bg-gray-50 flex items-center gap-2 transition"
             >
                <ArrowLeft size={16} /> 돌아가기
             </button>
             <button 
               onClick={() => { onBack(); setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 300); }}
               className="border border-[var(--primary-color)] text-[var(--primary-color)] px-6 py-3 rounded-lg text-sm font-bold hover:bg-[var(--primary-color)] hover:text-white transition flex items-center gap-2"
             >
                전체 문의 <ArrowLeft className="rotate-[135deg]" size={16} />
             </button>
           </div>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex gap-6 border-y border-gray-200 py-4 mb-10 overflow-x-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`text-sm md:text-base font-bold whitespace-nowrap transition-colors relative pb-1 ${
                filter === cat 
                  ? 'text-[var(--primary-color)]' 
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              {cat === 'All' ? '전체' : cat}
              {filter === cat && (
                <motion.div 
                  layoutId="activePortfolioTab" 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary-color)]" 
                />
              )}
            </button>
          ))}
        </div>

        {/* Gallery Grid (Standard Image Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredItems.map((item, idx) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                key={`${item.title}-${idx}`}
                className="relative group cursor-pointer overflow-hidden rounded-lg shadow-sm bg-gray-100 aspect-[16/10]"
                onClick={() => setSelectedImage(item)}
              >
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                
                {/* Text Overlay */}
                <div className="absolute bottom-0 left-0 p-5 md:p-6 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 pointer-events-none">
                    <span className="text-[var(--primary-color)] font-bold text-[11px] md:text-xs tracking-wider mb-1 block">
                        {item.category}
                    </span>
                    <h3 className="text-white font-bold text-base md:text-lg leading-tight">
                        {item.title}
                    </h3>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

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