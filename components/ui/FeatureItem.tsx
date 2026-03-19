import React from 'react';
import { CheckCircle } from 'lucide-react';
import { FeatureItemProps } from '../../types';

export const FeatureItem: React.FC<FeatureItemProps> = ({ text }) => (
  <div className="flex items-center gap-3">
    <CheckCircle size={20} className="text-[var(--primary-color)] flex-shrink-0" />
    <span className="font-medium text-gray-700">{text}</span>
  </div>
);