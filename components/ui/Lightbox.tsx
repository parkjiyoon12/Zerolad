import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { LightboxProps } from '../../types';

export const Lightbox: React.FC<LightboxProps> = ({ selectedImage, items, onClose, onImageChange }) => {
  // Find index of currently selected image
  const currentIndex = selectedImage 
    ? items.findIndex(item => item.imageUrl === selectedImage.imageUrl)
    : -1;

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % items.length;
    onImageChange(items[nextIndex]);
  }, [currentIndex, items, onImageChange]);

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (currentIndex === -1) return;
    const prevIndex = (currentIndex - 1 + items.length) % items.length;
    onImageChange(items[prevIndex]);
  }, [currentIndex, items, onImageChange]);

  // Keyboard navigation
  useEffect(() => {
    if (!selectedImage) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, handleNext, handlePrev, onClose]);

  return (
    <AnimatePresence>
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-10"
          onClick={onClose}
        >
          {/* Close Button */}
          <button 
            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors p-2 z-[110]"
            onClick={onClose}
          >
            <X size={32} />
          </button>

          {/* Navigation Buttons */}
          {items.length > 1 && (
              <>
                  <button
                      className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-colors z-[110] hidden md:flex"
                      onClick={handlePrev}
                  >
                      <ChevronLeft size={32} />
                  </button>
                  
                  <button
                      className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-colors z-[110] hidden md:flex"
                      onClick={handleNext}
                  >
                      <ChevronRight size={32} />
                  </button>

                  {/* Mobile Navigation Areas (Tap edges to navigate) */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/6 h-1/2 z-[105] md:hidden" onClick={handlePrev} />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/6 h-1/2 z-[105] md:hidden" onClick={handleNext} />
              </>
          )}

          <motion.div 
            // Add a key based on URL to trigger animation when image changes
            key={selectedImage.imageUrl}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="max-w-5xl w-full max-h-[90vh] flex flex-col items-center relative"
            onClick={(e) => e.stopPropagation()} 
          >
            <img 
              src={selectedImage.imageUrl} 
              alt={selectedImage.title} 
              className="max-w-full max-h-[80vh] rounded-lg shadow-2xl mb-6 object-contain"
            />
            <div className="text-center">
                <h3 className="text-white text-2xl font-bold mb-2">{selectedImage.title}</h3>
                <p className="text-[var(--primary-color)] font-bold">{selectedImage.category}</p>
                {selectedImage.desc && <p className="text-gray-400 mt-2 text-sm max-w-lg mx-auto">{selectedImage.desc}</p>}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};