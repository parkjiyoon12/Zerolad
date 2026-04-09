import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Truck, Printer, Send, ArrowUpRight, Phone, Mail, MapPin, X, Settings, Instagram } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import { ServiceCard } from './components/ui/ServiceCard';
import { PortfolioRow } from './components/ui/PortfolioRow';
import { PortfolioPage } from './components/PortfolioPage';
import { Lightbox } from './components/ui/Lightbox';
import { PortfolioItemData } from './types';
import { useSiteData } from './components/SiteContext';

const AboutFeatureItem = ({ number, title, desc }: { number: string, title: string, desc: string }) => (
  <motion.div 
    whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
    className="p-10 border border-transparent hover:border-gray-200 transition-all group"
  >
    <span className="block text-xs font-black text-gray-300 mb-6 group-hover:text-[var(--primary-color)] transition-colors">{number}.</span>
    <h4 className="text-xl font-bold mb-4">{title}</h4>
    <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
  </motion.div>
);

export const MainSite: React.FC = () => {
  const { data } = useSiteData();
  const navigate = useNavigate();
  
  const [currentView, setCurrentView] = useState<'home' | 'portfolio'>('home');
  const [lightboxSelectedImage, setLightboxSelectedImage] = useState<PortfolioItemData | null>(null);
  const [lightboxItems, setLightboxItems] = useState<PortfolioItemData[]>([]);
  const [isQrOpen, setIsQrOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  const fIn = { 
    initial: { opacity: 0, y: 20 }, 
    whileInView: { opacity: 1, y: 0 }, 
    viewport: { once: true }, 
    transition: { duration: 0.6 } 
  };

  const marqueeItems = [
    "차량랩핑", 
    "현수막", 
    "실사출력", 
    "옥외광고", 
    "인쇄물", 
    "디자인 솔루션"
  ];

  // Filter portfolio items by category
  const vehicleItems = data.portfolio.filter(item => item.category === '차량랩핑');
  const signageItems = data.portfolio.filter(item => item.category === '옥외광고');
  const bannerItems = data.portfolio.filter(item => item.category === '현수막');
  const printItems = data.portfolio.filter(item => item.category === '인쇄물');

  const handlePortfolioRowClick = (item: PortfolioItemData, categoryItems: PortfolioItemData[]) => {
    setLightboxItems(categoryItems);
    setLightboxSelectedImage(item);
  };

  if (currentView === 'portfolio') {
    return <PortfolioPage items={data.portfolio} onBack={() => setCurrentView('home')} />;
  }

  return (
    <div className="bg-[var(--bg-color)] text-[var(--text-color)] font-sans selection:bg-[var(--primary-color)] selection:text-white relative">
      <Navigation />

      {/* Admin Button */}
      <button 
        onClick={() => navigate('/admin')}
        className="fixed bottom-6 right-6 z-50 bg-black text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition-colors flex items-center justify-center"
        title="관리자 대시보드"
      >
        <Settings size={24} />
      </button>

      {/* Hero Section */}
      <section className="relative px-6 md:px-10 py-32 border-b border-gray-100 overflow-hidden min-h-[50vh] flex flex-col justify-center items-center text-center">
        <div className="max-w-4xl mx-auto w-full flex flex-col items-center relative z-10">
            <div className="flex items-center justify-center gap-4 mb-10">
              <motion.img 
                src="https://i.imgur.com/s39s4ud.png" 
                alt="Z Symbol" 
                className="h-20 md:h-24 w-auto object-contain"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
              <motion.img 
                src="https://i.imgur.com/cQfmPTO.png" 
                alt="ZEROL Text" 
                className="h-12 md:h-16 w-auto object-contain"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            </div>

            <motion.h1 
              {...fIn} 
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl md:text-6xl font-medium leading-tight tracking-tight mb-6 text-[var(--text-color)] whitespace-pre-line"
            >
              {data.content.heroHeadline.split(/\\n|\n/).map((line, i, arr) => (
                <React.Fragment key={i}>
                  {line}
                  {i !== arr.length - 1 && <br />}
                </React.Fragment>
              ))}
            </motion.h1>
            
            <motion.p
              {...fIn}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl text-gray-600 mb-12 max-w-2xl"
            >
              {data.content.heroSubheadline}
            </motion.p>

            <motion.div 
              {...fIn}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <button 
                className="bg-black text-white text-lg px-10 py-4 rounded-full font-bold hover:bg-zinc-800 transition-colors shadow-lg"
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              >
                제롤 알아보기
              </button>
              <button 
                onClick={() => setCurrentView('portfolio')}
                className="group bg-white text-black border border-gray-200 text-lg px-10 py-4 rounded-full font-bold hover:bg-gray-50 hover:border-black transition-all shadow-sm flex items-center gap-2"
              >
                {data.content.heroCtaText} <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={20} />
              </button>
            </motion.div>
        </div>
      </section>

      {/* Marquee Section */}
      <div className="bg-[var(--primary-color)] text-white py-4 overflow-hidden whitespace-nowrap border-y border-[var(--primary-color)]">
        <motion.div 
          animate={{ x: [0, -2000] }}
          transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
          className="flex gap-10 text-lg font-bold uppercase tracking-widest items-center"
        >
          {[...Array(8)].map((_, i) => (
            <React.Fragment key={i}>
              {marqueeItems.map((item, idx) => (
                <React.Fragment key={`${i}-${idx}`}>
                  <span>{item}</span>
                  <span className="w-2 h-2 bg-white rounded-full flex-shrink-0"></span>
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
        </motion.div>
      </div>

      {/* Services Section */}
      <section id="services" className="bg-black text-white py-24 px-6 md:px-10 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 flex items-center gap-3">
            <div className="w-3 h-3" style={{ backgroundColor: data.theme.primaryColor }}></div>
            <span className="text-lg uppercase tracking-widest font-bold text-gray-400">서비스 분야</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 border-t border-white/10">
            <ServiceCard 
              title="차량 랩핑" 
              desc="버스, 탑차 등 다양한 차량을 움직이는 광고판으로 변신시킵니다. 숙련된 기술로 정밀히 마감합니다." 
              icon={<Truck size={40}/>} 
              idx={1} 
            />
            <ServiceCard 
              title="현수막 당일출고" 
              desc="제주도 내 긴급 물량 완벽 대응. 오전 주문 시 당일 출력 및 방문수령, 퀵 발송이 가능합니다." 
              icon={<Zap size={40}/>} 
              idx={2} 
            />
            <ServiceCard 
              title="실사출력 & 시공" 
              desc="옥외광고, 간판, 시트 커팅 등 고해상도 장비로 선명하고 깨끗한 품질을 보장합니다."
              icon={<Printer size={40}/>} 
              idx={3} 
            />
            <ServiceCard 
              title="인쇄물" 
              desc={<>브랜드의 아이덴티티를 담은 로고, 명함, 소개서, 리플렛 디자인을 제안합니다.</>}
              icon={<Send size={40}/>} 
              idx={4} 
            />
          </div>
        </div>
      </section>

      {/* Works Section */}
      <section id="works" className="py-24 bg-gray-50 overflow-hidden scroll-mt-24">
        <div className="px-6 md:px-10 mb-10">
          <div className="max-w-7xl mx-auto flex justify-between items-end">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3" style={{ backgroundColor: data.theme.primaryColor }}></div>
                <span className="text-lg uppercase tracking-widest font-bold text-gray-500">작업사례</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">제롤광고산업이 만든 결과물.</h2>
            </div>
            <button 
              onClick={() => setCurrentView('portfolio')}
              className="hidden md:flex items-center gap-2 text-sm font-bold border-b border-black pb-1 hover:text-[var(--primary-color)] hover:border-[var(--primary-color)] transition"
            >
              View All Projects <ArrowUpRight size={16}/>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {vehicleItems.length > 0 && <PortfolioRow category="차량랩핑" items={vehicleItems} onImageClick={(item) => handlePortfolioRowClick(item, vehicleItems)} />}
          {signageItems.length > 0 && <PortfolioRow category="옥외광고" items={signageItems} onImageClick={(item) => handlePortfolioRowClick(item, signageItems)} />}
          {bannerItems.length > 0 && <PortfolioRow category="현수막" items={bannerItems} onImageClick={(item) => handlePortfolioRowClick(item, bannerItems)} />}
          {printItems.length > 0 && <PortfolioRow category="인쇄물" items={printItems} onImageClick={(item) => handlePortfolioRowClick(item, printItems)} />}
        </div>
        
         <div className="px-6 md:hidden mt-8">
            <button 
              onClick={() => setCurrentView('portfolio')}
              className="w-full py-4 border border-black rounded-full font-bold flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-colors"
            >
              View All Projects <ArrowUpRight size={16}/>
            </button>
         </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-6 md:px-10 bg-[#f9f9f9] border-t border-gray-100 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-12 gap-10 mb-24">
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.8 }} 
              className="md:col-span-4"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3" style={{ backgroundColor: data.theme.primaryColor }}></div>
                <span className="text-lg uppercase tracking-[0.3em] font-bold text-gray-500">제롤 알아보기</span>
              </div>
              <h2 className="text-4xl font-bold leading-tight tracking-tighter">
                제주의 비즈니스를 <br />가장 선명하게.
              </h2>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.8, delay: 0.2 }} 
              className="md:col-span-8"
            >
              <p className="text-2xl md:text-3xl text-gray-800 font-medium leading-snug mb-8">
                "우리는 단순히 잉크를 찍어내는 것이 아닙니다. <br />
                <span style={{ color: data.theme.primaryColor }}>비즈니스의 성공을 찍어냅니다.</span>"
              </p>
              <p className="text-gray-500 text-lg leading-relaxed max-w-2xl mb-10 whitespace-pre-line">
                {data.content.aboutText}
              </p>
              <button 
                onClick={() => window.location.href = 'mailto:zerolco@daum.net'}
                className="border border-gray-300 px-8 py-3 rounded-full text-sm font-bold hover:bg-black hover:text-white transition"
              >
                Read More
              </button>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-1 border-t border-gray-200 pt-16">
            <AboutFeatureItem number="01" title="전문 장비" desc="고화질 솔벤 출력기 보유로 선명한 발색과 내구성을 보장합니다." />
            <AboutFeatureItem number="02" title="원스톱 서비스" desc="디자인부터 제작, 현장 시공까지 한 번에 해결하는 효율적인 프로세스." />
            <AboutFeatureItem number="03" title="무료 방문 상담" desc="제주 전 지역 어디든 직접 찾아가 정확한 견적과 최적의 솔루션을 제공합니다." />
          </div>
        </div>
      </section>

      {/* Footer / Contact Section */}
      <footer id="contact" className="bg-black text-white pt-24 pb-10 px-6 md:px-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 md:gap-24 mb-32">
            <div className="flex flex-col justify-center">
                <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                    견적문의 및 상담
                </h2>
                <p className="text-gray-400 text-lg mb-12 leading-relaxed">
                    제롤광고산업은 고객에게 맞춘 최적의 디자인 솔루션을 제공합니다.<br/>
                    가벼운 문의라도 언제든 환영합니다.
                </p>
                
                <div className="space-y-8">
                    <div className="flex items-start gap-5 group cursor-pointer" onClick={() => window.location.href = 'mailto:zerolco@daum.net'}>
                        <div className="w-12 h-12 rounded-full border border-zinc-800 bg-zinc-900 flex items-center justify-center text-[var(--primary-color)] group-hover:border-[var(--primary-color)] transition-colors">
                            <Mail size={24} />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm mb-1 font-medium">Email</p>
                            <p className="text-xl font-bold group-hover:text-[var(--primary-color)] transition-colors">zerolco@daum.net</p>
                        </div>
                    </div>
                    
                    <div className="flex items-start gap-5 group cursor-pointer" onClick={() => setIsQrOpen(true)}>
                        <div className="w-12 h-12 rounded-full border border-zinc-800 bg-zinc-900 flex items-center justify-center text-[var(--primary-color)] group-hover:border-[var(--primary-color)] transition-colors">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 3C6.48 3 2 6.48 2 10.76C2 13.52 3.87 15.93 6.76 17.23C6.56 17.97 5.37 20.29 5.3 20.48C5.24 20.66 5.47 20.74 5.61 20.66C6.74 19.86 9.4 18.05 10.15 17.53C10.77 17.62 11.4 17.66 12 17.66C17.52 17.66 22 14.18 22 9.9C22 5.62 17.52 3 12 3Z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm mb-1 font-medium">Kakaotalk</p>
                            <p className="text-xl font-bold group-hover:text-[var(--primary-color)] transition-colors">Ad_Design</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-5 group">
                        <div className="w-12 h-12 rounded-full border border-zinc-800 bg-zinc-900 flex items-center justify-center text-[var(--primary-color)] group-hover:border-[var(--primary-color)] transition-colors">
                            <Phone size={24} />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm mb-1 font-medium">Phone</p>
                            <a href="tel:010-8143-0654" className="block text-xl font-bold hover:text-[var(--primary-color)] transition-colors mb-1">010-8143-0654</a>
                            <a href="tel:064-753-0654" className="block text-xl font-bold hover:text-[var(--primary-color)] transition-colors">064-753-0654</a>
                        </div>
                    </div>

                    <div className="flex items-start gap-5 group cursor-pointer" onClick={() => window.open('https://map.naver.com/?query=제주 제주시 도남로7길 47-1', '_blank')}>
                        <div className="w-12 h-12 rounded-full border border-zinc-800 bg-zinc-900 flex items-center justify-center text-[var(--primary-color)] group-hover:border-[var(--primary-color)] transition-colors">
                            <MapPin size={24} />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm mb-1 font-medium">Office</p>
                            <p className="text-lg font-bold group-hover:text-[var(--primary-color)] transition-colors leading-snug">제주 제주시 도남로7길 47-1, 1층</p>
                        </div>
                    </div>

                    {data.content.socialLinks?.instagram && (
                      <div className="flex items-start gap-5 group cursor-pointer" onClick={() => window.open(data.content.socialLinks.instagram, '_blank')}>
                          <div className="w-12 h-12 rounded-full border border-zinc-800 bg-zinc-900 flex items-center justify-center text-[var(--primary-color)] group-hover:border-[var(--primary-color)] transition-colors">
                              <Instagram size={24} />
                          </div>
                          <div>
                              <p className="text-gray-500 text-sm mb-1 font-medium">Instagram</p>
                              <p className="text-lg font-bold group-hover:text-[var(--primary-color)] transition-colors leading-snug">
                                {data.content.socialLinks.instagram.replace('https://www.instagram.com/', '@').replace('https://instagram.com/', '@').replace(/\/$/, '')}
                              </p>
                          </div>
                      </div>
                    )}
                </div>
            </div>

            <form 
              action="https://formspree.io/f/mjgonpkr" 
              method="POST"
              className="bg-[#111111] p-8 md:p-10 rounded-3xl border border-white/5 shadow-2xl"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-500 text-sm mb-2 font-medium ml-1" htmlFor="name">이름</label>
                  <input 
                    id="name"
                    name="name"
                    type="text" 
                    placeholder="홍길동" 
                    required
                    className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-[var(--primary-color)] transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-gray-500 text-sm mb-2 font-medium ml-1" htmlFor="phone">연락처</label>
                  <input 
                    id="phone"
                    name="phone"
                    type="text" 
                    placeholder="010-0000-0000" 
                    required
                    className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-[var(--primary-color)] transition-colors" 
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-500 text-sm mb-2 font-medium ml-1" htmlFor="email">이메일</label>
                <input 
                  id="email"
                  name="email"
                  type="email" 
                  placeholder="example@email.com" 
                  required
                  className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-[var(--primary-color)] transition-colors" 
                />
              </div>
              <div className="mb-8">
                <label className="block text-gray-500 text-sm mb-2 font-medium ml-1" htmlFor="message">문의 내용</label>
                <textarea 
                  id="message"
                  name="message"
                  rows={4} 
                  placeholder="내용을 입력해주세요" 
                  required
                  className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-[var(--primary-color)] transition-colors resize-none"
                ></textarea>
              </div>
              <button type="submit" className="w-full text-white font-bold py-4 rounded-xl transition-colors shadow-lg" style={{ backgroundColor: data.theme.primaryColor, boxShadow: `0 10px 15px -3px ${data.theme.primaryColor}33` }}>
                문의 보내기
              </button>
            </form>
          </div>
          
          <div className="border-t border-white/10 pt-16">
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
                <span className="text-4xl md:text-[10rem] font-black leading-none tracking-tighter text-white/10 select-none">ZEROL</span>
                <span className="text-xs text-gray-600 uppercase tracking-widest text-right">®2026 ZEROL Advertising Industry.<br/>All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>

      <Lightbox 
        selectedImage={lightboxSelectedImage}
        items={lightboxItems}
        onClose={() => setLightboxSelectedImage(null)}
        onImageChange={setLightboxSelectedImage}
      />

      <AnimatePresence>
        {isQrOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsQrOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-8 rounded-3xl max-w-sm w-full relative flex flex-col items-center shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                  onClick={() => setIsQrOpen(false)}
                  className="absolute top-5 right-5 text-gray-400 hover:text-black transition-colors bg-gray-100 p-2 rounded-full"
              >
                  <X size={20} />
              </button>

              <div className="w-16 h-16 bg-[#FAE100] rounded-full flex items-center justify-center text-[#3C1E1E] mb-6">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 3C6.48 3 2 6.48 2 10.76C2 13.52 3.87 15.93 6.76 17.23C6.56 17.97 5.37 20.29 5.3 20.48C5.24 20.66 5.47 20.74 5.61 20.66C6.74 19.86 9.4 18.05 10.15 17.53C10.77 17.62 11.4 17.66 12 17.66C17.52 17.66 22 14.18 22 9.9C22 5.62 17.52 3 12 3Z" />
                  </svg>
              </div>

              <h3 className="text-2xl font-bold mb-2 text-center text-black">KakaoTalk</h3>
              <p className="text-gray-500 text-sm mb-8 text-center leading-relaxed">
                  카메라로 QR코드를 스캔하거나<br/>ID를 검색하여 친구추가 해주세요.
              </p>

              <div className="w-64 h-64 bg-gray-50 rounded-2xl border border-gray-100 p-2 mb-6">
                   <img src="https://i.imgur.com/7QiVVog.png" alt="KakaoTalk QR Code" className="w-full h-full object-contain rounded-xl" />
              </div>

              <div className="bg-gray-100 px-6 py-3 rounded-full flex items-center gap-2">
                  <span className="text-gray-500 text-sm font-medium">ID</span>
                  <span className="text-lg font-bold text-[#3C1E1E]">Ad_Design</span>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
