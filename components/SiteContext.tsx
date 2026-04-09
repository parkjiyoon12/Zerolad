import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';
import { PortfolioItemData } from '../types';

export interface SiteTheme {
  primaryColor: string;
  fontFamily: string;
  backgroundColor: string;
  textColor: string;
}

export interface SiteContent {
  heroHeadline: string;
  heroSubheadline: string;
  heroCtaText: string;
  aboutText: string;
  socialLinks: {
    instagram: string;
    facebook: string;
    blog: string;
  };
}

export interface SiteData {
  theme: SiteTheme;
  content: SiteContent;
  portfolio: PortfolioItemData[];
}

const defaultData: SiteData = {
  theme: {
    primaryColor: '#2563EB',
    fontFamily: 'Inter, sans-serif',
    backgroundColor: '#ffffff',
    textColor: '#000000',
  },
  content: {
    heroHeadline: '비즈니스의 첫인상,\n제롤광고산업이 디자인합니다.',
    heroSubheadline: '당신의 비즈니스를 돋보이게 하는 최고의 디자인 파트너',
    heroCtaText: '작업사례',
    aboutText: '제롤은 고객의 비즈니스 성공을 위해 최선을 다합니다.',
    socialLinks: {
      instagram: 'https://instagram.com',
      facebook: 'https://facebook.com',
      blog: 'https://blog.naver.com',
    }
  },
  portfolio: [
    { title: "제주시내버스 외부광고", imageUrl: "https://i.imgur.com/Jh7hZFG.png", category: "차량랩핑" },
    { title: "탑차 전체 시공", imageUrl: "https://i.imgur.com/BlB4aZc.png", category: "차량랩핑" },
    { title: "스타렉스 시공", imageUrl: "https://i.imgur.com/mMsepaQ.png", category: "차량랩핑" },
    { title: "레이 차량 시공", imageUrl: "https://i.imgur.com/mbPOfYY.png", category: "차량랩핑" },
    { title: "태권도장 채널 간판", imageUrl: "https://i.imgur.com/wEXCpuo.png", category: "옥외광고" },
    { title: "음식점 채널 간판", imageUrl: "https://i.imgur.com/8lBpgsg.jpeg", category: "옥외광고" },
    { title: "매장 전면 간판", imageUrl: "https://i.imgur.com/DNcAH5V.jpeg", category: "옥외광고" },
    { title: "이벤트 현수막", imageUrl: "https://i.imgur.com/FQweCQb.png", category: "현수막" },
    { title: "행사 배너", imageUrl: "https://i.imgur.com/HQofGYO.png", category: "현수막" },
    { title: "홍보용 자이언트 배너", imageUrl: "https://i.imgur.com/dJh99DJ.png", category: "현수막" },
    { title: "CELC 영어학원 전단지", imageUrl: "https://i.imgur.com/ibixnCT.png", category: "인쇄물" },
    { title: "프리미엄 명함", imageUrl: "https://i.imgur.com/Fx5oD4S.png", category: "인쇄물" },
    { title: "데스크 캘린더", imageUrl: "https://i.imgur.com/ZHsQdaL.png", category: "인쇄물" },
    { title: "포트폴리오 브로셔", imageUrl: "https://i.imgur.com/xtDs44D.png", category: "인쇄물" }
  ]
};

interface SiteContextType {
  data: SiteData;
  isLoading: boolean;
  updateTheme: (theme: Partial<SiteTheme>) => Promise<void>;
  updateContent: (content: Partial<SiteContent>) => Promise<void>;
  updatePortfolio: (items: PortfolioItemData[]) => Promise<void>;
  resetToDefault: () => Promise<void>;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<SiteData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthReady } = useAuth();

  useEffect(() => {
    if (!isAuthReady) return;

    const configRef = doc(db, 'site', 'config');
    
    const unsubscribe = onSnapshot(configRef, (docSnap) => {
      if (docSnap.exists()) {
        setData(docSnap.data() as SiteData);
      } else {
        setData(defaultData);
      }
      setIsLoading(false);
    }, (error) => {
      console.error("Firestore Error: ", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [isAuthReady]);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.style.setProperty('--primary-color', data.theme.primaryColor);
    document.documentElement.style.setProperty('--font-family', data.theme.fontFamily);
    document.documentElement.style.setProperty('--bg-color', data.theme.backgroundColor);
    document.documentElement.style.setProperty('--text-color', data.theme.textColor);
    
    // Apply font family to body
    document.body.style.fontFamily = data.theme.fontFamily;
    document.body.style.backgroundColor = data.theme.backgroundColor;
    document.body.style.color = data.theme.textColor;
  }, [data.theme]);

  const saveToFirestore = async (newData: SiteData) => {
    try {
      await setDoc(doc(db, 'site', 'config'), newData);
    } catch (error) {
      console.error("Error saving to Firestore:", error);
      throw error;
    }
  };

  const updateTheme = async (themeUpdate: Partial<SiteTheme>) => {
    const newData = { ...data, theme: { ...data.theme, ...themeUpdate } };
    setData(newData); // Optimistic update
    await saveToFirestore(newData);
  };

  const updateContent = async (contentUpdate: Partial<SiteContent>) => {
    const newData = { ...data, content: { ...data.content, ...contentUpdate } };
    setData(newData); // Optimistic update
    await saveToFirestore(newData);
  };

  const updatePortfolio = async (items: PortfolioItemData[]) => {
    const newData = { ...data, portfolio: items };
    setData(newData); // Optimistic update
    await saveToFirestore(newData);
  };

  const resetToDefault = async () => {
    setData(defaultData); // Optimistic update
    await saveToFirestore(defaultData);
  };

  return (
    <SiteContext.Provider value={{ data, isLoading, updateTheme, updateContent, updatePortfolio, resetToDefault }}>
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
