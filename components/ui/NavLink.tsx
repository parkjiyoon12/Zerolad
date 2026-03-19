import React from 'react';
import { NavLinkProps, MobileLinkProps } from '../../types';

export const NavLink: React.FC<NavLinkProps> = ({ href, children, onClick }) => (
  <a 
    href={href} 
    onClick={onClick}
    className="relative group overflow-hidden inline-block cursor-pointer"
  >
    <span className="block group-hover:-translate-y-full transition-transform duration-300 ease-in-out">
      {children}
    </span>
    <span className="absolute top-0 left-0 block translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out text-[#2563EB]">
      {children}
    </span>
  </a>
);

export const MobileLink: React.FC<MobileLinkProps> = ({ href, children, setIsMenuOpen, onClick }) => (
  <a 
    href={href} 
    onClick={(e) => {
        setIsMenuOpen(false);
        if (onClick) onClick(e);
    }} 
    className="hover:text-[#2563EB] transition-colors cursor-pointer"
  >
    {children}
  </a>
);