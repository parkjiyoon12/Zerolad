import React from 'react';
import { motion } from 'framer-motion';
import { ServiceCardProps } from '../../types';

export const ServiceCard: React.FC<ServiceCardProps> = ({ title, desc, icon, idx }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: idx * 0.1, duration: 0.5 }}
    viewport={{ once: true }}
    whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
    className="p-8 md:p-10 border-b border-r border-white/10 flex flex-col gap-6 transition-colors group cursor-pointer"
  >
    <div className="text-[#2563EB] group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <div className="space-y-4">
      <h3 className="text-2xl font-bold tracking-tight">{title}</h3>
      <p className="text-gray-400 leading-relaxed text-sm">{desc}</p>
    </div>
  </motion.div>
);