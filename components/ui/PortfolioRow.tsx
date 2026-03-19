import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { PortfolioItemData, PortfolioRowProps } from '../../types';

export const PortfolioRow: React.FC<PortfolioRowProps> = ({ category, items, onImageClick }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  
  // Duplicate items to create an infinite scrolling effect (buffer)
  // We use 3 sets to ensure smooth looping
  const displayItems = [...items, ...items, ...items];

  // Auto-scroll logic
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !isAutoScrolling) return;

    let animationFrameId: number;
    // Speed of auto-scroll
    const speed = 1.2; 

    const animate = () => {
      if (container) {
        container.scrollLeft += speed;

        // Infinite Loop Logic:
        // If we've scrolled past the first set of items (approx 1/3 of scrollWidth),
        // reset to 0 to create seamless loop.
        if (container.scrollLeft >= container.scrollWidth / 3) {
          container.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [items.length, isAutoScrolling]);

  // Manual scroll by button
  const scroll = (direction: 'left' | 'right') => {
    // Stop auto-scrolling when user interacts manually to prevent conflict
    setIsAutoScrolling(false);
    
    if (scrollContainerRef.current) {
      const scrollAmount = 450; 
      const container = scrollContainerRef.current;
      
      // Calculate target
      const targetScroll = direction === 'left' 
        ? container.scrollLeft - scrollAmount 
        : container.scrollLeft + scrollAmount;
      
      container.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="py-6 border-b border-gray-100 last:border-none">
      {/* Header aligned with max-w-7xl */}
      <div className="px-6 md:px-10 mb-8 flex items-end justify-between max-w-7xl mx-auto">
        <h3 className="text-lg md:text-xl font-bold flex items-center gap-2 tracking-tight">
            <span className="w-2 h-2 md:w-2.5 md:h-2.5 bg-[#2563EB] rounded-full"></span>
            {category}
        </h3>
        
        {/* Navigation Buttons */}
        <div className="flex gap-2">
            <button 
                onClick={() => scroll('left')}
                className="p-3 rounded-full border border-gray-200 hover:bg-black hover:text-white hover:border-black transition-colors flex items-center justify-center bg-white"
                aria-label="Scroll left"
            >
                <ArrowLeft size={20} />
            </button>
            <button 
                onClick={() => scroll('right')}
                className="p-3 rounded-full border border-gray-200 hover:bg-black hover:text-white hover:border-black transition-colors flex items-center justify-center bg-white"
                aria-label="Scroll right"
            >
                <ArrowRight size={20} />
            </button>
        </div>
      </div>
      
      {/* Scrollable Container confined to max-w-7xl */}
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-6 px-6 md:px-10 pb-8 [&::-webkit-scrollbar]:hidden max-w-7xl mx-auto"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {displayItems.map((item, idx) => (
          <motion.div 
            // Using a combination of title and index to ensure unique keys for duplicates
            key={`${item.title}-${idx}`} 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            onClick={() => onImageClick && onImageClick(item)} // Handle click
            className="w-[85vw] md:w-[24rem] flex-shrink-0 group cursor-pointer"
          >
            <div className="aspect-[16/10] bg-gray-100 mb-5 rounded-2xl overflow-hidden relative shadow-sm border border-gray-100">
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
               <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                  <div className="bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                     {/* Using a simple magnifying glass icon or similar indicator */}
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                  </div>
               </div>
            </div>
            <h4 className="text-xl font-bold group-hover:text-[#2563EB] transition-colors px-1 leading-tight">{item.title}</h4>
            {item.desc && <p className="text-gray-500 text-sm mt-2 px-1">{item.desc}</p>}
          </motion.div>
        ))}
        {/* Spacer */}
        <div className="w-1 md:w-4 flex-shrink-0" />
      </div>
    </div>
  );
};