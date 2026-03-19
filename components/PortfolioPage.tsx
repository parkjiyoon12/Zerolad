import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ZoomIn } from 'lucide-react';
import { PortfolioItemData, PortfolioPageProps } from '../types';
import { Lightbox } from './ui/Lightbox';

export const PortfolioPage: React.FC<PortfolioPageProps> = ({ items, onBack }) => {
  const [filter, setFilter] = useState('All');
  const [selectedImage, setSelectedImage] = useState<PortfolioItemData | null>(null);

  // Extract unique categories from items
  const categories = ['All', ...Array.from(new Set(items.map(item => item.category || 'Other')))];

  const filteredItems = filter === 'All' 
    ? items 
    : items.filter(item => item.category === filter);

  return (
    <div className="min-h-screen bg-white text-black font-sans relative z-50">
      
      {/* Fixed Header for Portfolio Page */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-md z-40 border-b border-gray-100 px-6 md:px-10 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors group"
          >
            <ArrowLeft className="text-black group-hover:text-[#2563EB] transition-colors" />
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
                  ? 'bg-black text-white border-black' 
                  : 'bg-white text-gray-500 border-gray-200 hover:border-black hover:text-black'
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
                <div className="aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden relative mb-4 border border-gray-100">
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
                    <span className="text-[#2563EB] text-xs font-bold uppercase tracking-wider mb-1 block">
                        {item.category}
                    </span>
                    <h3 className="text-lg font-bold group-hover:underline decoration-[#2563EB] underline-offset-4 decoration-2">
                        {item.title}
                    </h3>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredItems.length === 0 && (
          <div className="py-20 text-center text-gray-400">
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