import React from 'react';
import { motion } from 'framer-motion';
import { PortfolioItemProps } from '../../types';

export const PortfolioItem: React.FC<PortfolioItemProps> = ({ category, title, color, imageUrl }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="group cursor-pointer"
  >
    <div className={`aspect-[4/3] ${color} mb-6 rounded-lg overflow-hidden relative`}>
        {/* Render Image if provided, else placeholder */}
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400/50 font-bold text-2xl group-hover:scale-105 transition-transform duration-500">
              Image Area
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
    </div>
    <p className="text-2xl font-bold text-[var(--primary-color)] uppercase tracking-widest mb-2">{category}</p>
    <h3 className="text-xl font-bold group-hover:underline decoration-2 decoration-[var(--primary-color)] underline-offset-4">{title}</h3>
  </motion.div>
);