import React, { createContext, useContext, useState, useEffect } from 'react';
import { PortfolioItemData } from '../types';

export interface ServiceData {
  id: string;
  title: string;
  desc: string;
  iconName: string;
}

export interface AboutFeatureData {
  id: string;
  number: string;
  title: string;
  desc: string;
}

export interface SiteData {
  theme: {
    primaryColor: string;
    fontFamily: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
  hero: {
    logo1Url: string;
    logo2Url: string;
    headline: string;
  };
  services: ServiceData[];
  portfolio: (PortfolioItemData & { id: string })[];
  about: {
    title: string;
    subtitle: string;
    description: string;
    features: AboutFeatureData[];
  };
  contact: {
    email: string;
    phone: string;
    address: string;
    kakaoId: string;
    kakaoQrUrl: string;
  };
}

const defaultSiteData: SiteData = {
  theme: {
    primaryColor: '#2563EB',
    fontFamily: 'Inter, Noto Sans KR, sans-serif',
  },
  seo: {
    title: 'ZEROL - Ideas Born, Produced Alive.',
    description: 'A modern, creative website for Zerol Advertising Agency showcasing services, portfolio works, and company information.',
    keywords: '광고, 제롤, 인쇄, 현수막, 차량랩핑',
  },
  hero: {
    logo1Url: 'https://i.imgur.com/s39s4ud.png',
    logo2Url: 'https://i.imgur.com/cQfmPTO.png',
    headline: '비즈니스의 첫인상,<br />제롤이 디자인합니다.',
  },
  services: [
    { id: '1', title: '차량 랩핑', desc: '버스, 탑차 등 다양한 차량을 움직이는 광고판으로 변신시킵니다. 숙련된 기술로 정밀히 마감합니다.', iconName: 'Truck' },
    { id: '2', title: '현수막 당일출고', desc: '제주도 내 긴급 물량 완벽 대응. 오전 주문 시 당일 출력 및 방문수령, 퀵 발송이 가능합니다.', iconName: 'Zap' },
    { id: '3', title: '실사출력 & 시공', desc: '옥외광고, 간판, 시트 커팅 등 고해상도 장비로 선명하고 깨끗한 품질을 보장합니다.', iconName: 'Printer' },
    { id: '4', title: '인쇄물', desc: '브랜드의 아이덴티티를 담은 로고, 명함, 소개서, 리플렛 디자인을 제안합니다.', iconName: 'Send' },
  ],
  portfolio: [
    { id: 'p1', title: "제주시내버스 외부광고", imageUrl: "https://i.imgur.com/Jh7hZFG.png", category: "차량랩핑" },
    { id: 'p2', title: "탑차 전체 시공", imageUrl: "https://i.imgur.com/BlB4aZc.png", category: "차량랩핑" },
    { id: 'p3', title: "스타렉스 시공", imageUrl: "https://i.imgur.com/mMsepaQ.png", category: "차량랩핑" },
    { id: 'p4', title: "레이 차량 시공", imageUrl: "https://i.imgur.com/mbPOfYY.png", category: "차량랩핑" },
    { id: 'p5', title: "태권도장 채널 간판", imageUrl: "https://i.imgur.com/wEXCpuo.png", category: "옥외광고" },
    { id: 'p6', title: "음식점 채널 간판", imageUrl: "https://i.imgur.com/8lBpgsg.jpeg", category: "옥외광고" },
    { id: 'p7', title: "매장 전면 간판", imageUrl: "https://i.imgur.com/DNcAH5V.jpeg", category: "옥외광고" },
    { id: 'p8', title: "이벤트 현수막", imageUrl: "https://i.imgur.com/FQweCQb.png", category: "현수막" },
    { id: 'p9', title: "행사 배너", imageUrl: "https://i.imgur.com/HQofGYO.png", category: "현수막" },
    { id: 'p10', title: "홍보용 자이언트 배너", imageUrl: "https://i.imgur.com/dJh99DJ.png", category: "현수막" },
    { id: 'p11', title: "CELC 영어학원 전단지", imageUrl: "https://i.imgur.com/ibixnCT.png", category: "인쇄물" },
    { id: 'p12', title: "프리미엄 명함", imageUrl: "https://i.imgur.com/Fx5oD4S.png", category: "인쇄물" },
    { id: 'p13', title: "데스크 캘린더", imageUrl: "https://i.imgur.com/ZHsQdaL.png", category: "인쇄물" },
    { id: 'p14', title: "포트폴리오 브로셔", imageUrl: "https://i.imgur.com/xtDs44D.png", category: "인쇄물" }
  ],
  about: {
    title: '제주의 비즈니스를 <br />가장 선명하게.',
    subtitle: '"우리는 단순히 잉크를 찍어내는 것이 아닙니다. <br /><span class=\\"text-primary\\">비즈니스의 성공을 찍어냅니다.</span>"',
    description: '제롤광고산업은 제주 No.1 인쇄/광고 파트너로서 고화질 솔벤 출력 장비와 시공 전문가가 함께합니다. 작은 명함 한 장부터 대형 옥외광고까지, 고객의 상상을 현실로 구현하는 완벽한 기술력을 약속합니다.',
    features: [
      { id: '1', number: '01', title: '전문 장비', desc: '고화질 솔벤 출력기 보유로 선명한 발색과 내구성을 보장합니다.' },
      { id: '2', number: '02', title: '원스톱 서비스', desc: '디자인부터 제작, 현장 시공까지 한 번에 해결하는 효율적인 프로세스.' },
      { id: '3', number: '03', title: '무료 방문 상담', desc: '제주 전 지역 어디든 직접 찾아가 정확한 견적과 최적의 솔루션을 제공합니다.' },
    ]
  },
  contact: {
    email: 'zerolco@daum.net',
    phone: '010-8143-0654',
    address: '제주 제주시 도남로7길 47-1, 1층',
    kakaoId: 'Ad_Design',
    kakaoQrUrl: 'https://i.imgur.com/7QiVVog.png'
  }
};

interface SiteContextType {
  siteData: SiteData;
  updateSiteData: (newData: Partial<SiteData>) => void;
  resetSiteData: () => void;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [siteData, setSiteData] = useState<SiteData>(() => {
    const saved = localStorage.getItem('zerol_site_data');
    if (saved) {
      try {
        return { ...defaultSiteData, ...JSON.parse(saved) };
      } catch (e) {
        return defaultSiteData;
      }
    }
    return defaultSiteData;
  });

  useEffect(() => {
    localStorage.setItem('zerol_site_data', JSON.stringify(siteData));
    
    // Apply theme
    document.documentElement.style.setProperty('--color-primary', siteData.theme.primaryColor);
    document.body.style.fontFamily = siteData.theme.fontFamily;
    
    // Apply SEO
    document.title = siteData.seo.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', siteData.seo.description);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = siteData.seo.description;
      document.head.appendChild(meta);
    }
  }, [siteData]);

  const updateSiteData = (newData: Partial<SiteData>) => {
    setSiteData(prev => ({ ...prev, ...newData }));
  };

  const resetSiteData = () => {
    setSiteData(defaultSiteData);
  };

  return (
    <SiteContext.Provider value={{ siteData, updateSiteData, resetSiteData }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSiteData = () => {
  const context = useContext(SiteContext);
  if (context === undefined) {
    throw new Error('useSiteData must be used within a SiteProvider');
  }
  return context;
};
