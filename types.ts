import { ReactNode, MouseEvent } from 'react';

export interface NavLinkProps {
  href: string;
  children: ReactNode;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

export interface MobileLinkProps extends NavLinkProps {
  setIsMenuOpen: (isOpen: boolean) => void;
}

export interface ServiceCardProps {
  title: string;
  desc: ReactNode;
  icon: ReactNode;
  idx: number;
}

export interface PortfolioItemProps {
  category: string;
  title: string;
  color: string;
  imageUrl?: string;
}

export interface FeatureItemProps {
  text: string;
}

export interface PortfolioItemData {
  title: string;
  imageUrl: string;
  desc?: string;
  category?: string; // Added category for filtering
}

export interface PortfolioPageProps {
  items: PortfolioItemData[];
  onBack: () => void;
}

export interface LightboxProps {
  selectedImage: PortfolioItemData | null;
  items: PortfolioItemData[];
  onClose: () => void;
  onImageChange: (newItem: PortfolioItemData) => void;
}

export interface PortfolioRowProps {
  category: string;
  items: PortfolioItemData[];
  onImageClick?: (item: PortfolioItemData) => void; // Added for homepage click interaction
}