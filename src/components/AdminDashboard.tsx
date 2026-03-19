import React, { useState } from 'react';
import { useSiteData } from '../context/SiteContext';
import { Save, Plus, Trash2, Image, Type, Palette, Settings, LayoutDashboard, LogOut } from 'lucide-react';
import { PortfolioItemData } from '../types';

export const AdminDashboard: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const { siteData, updateSiteData, resetSiteData } = useSiteData();
  const [activeTab, setActiveTab] = useState<'content' | 'portfolio' | 'theme' | 'seo'>('content');
  const [formData, setFormData] = useState(siteData);

  const handleSave = () => {
    updateSiteData(formData);
    alert('변경사항이 저장되었습니다.');
  };

  const handleChange = (section: keyof typeof formData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: value
      }
    }));
  };

  const handlePortfolioChange = (index: number, field: keyof PortfolioItemData, value: string) => {
    const newPortfolio = [...formData.portfolio];
    newPortfolio[index] = { ...newPortfolio[index], [field]: value };
    setFormData(prev => ({ ...prev, portfolio: newPortfolio }));
  };

  const addPortfolioItem = () => {
    setFormData(prev => ({
      ...prev,
      portfolio: [
        { id: `p${Date.now()}`, title: '새 포트폴리오', imageUrl: 'https://picsum.photos/seed/new/800/600', category: '차량랩핑' },
        ...prev.portfolio
      ]
    }));
  };

  const removePortfolioItem = (index: number) => {
    const newPortfolio = [...formData.portfolio];
    newPortfolio.splice(index, 1);
    setFormData(prev => ({ ...prev, portfolio: newPortfolio }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <LayoutDashboard size={24} className="text-blue-600" />
            관리자 대시보드
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('content')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'content' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <Type size={20} /> 콘텐츠 관리
          </button>
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'portfolio' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <Image size={20} /> 포트폴리오 관리
          </button>
          <button
            onClick={() => setActiveTab('theme')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'theme' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <Palette size={20} /> 테마 및 디자인
          </button>
          <button
            onClick={() => setActiveTab('seo')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'seo' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <Settings size={20} /> SEO 및 설정
          </button>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onExit}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} /> 사이트로 돌아가기
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {activeTab === 'content' && '콘텐츠 관리'}
            {activeTab === 'portfolio' && '포트폴리오 관리'}
            {activeTab === 'theme' && '테마 및 디자인'}
            {activeTab === 'seo' && 'SEO 및 설정'}
          </h2>
          <div className="flex gap-3">
            <button
              onClick={() => {
                if (window.confirm('모든 설정을 초기화하시겠습니까?')) {
                  resetSiteData();
                  setFormData(siteData);
                }
              }}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              초기화
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
            >
              <Save size={18} /> 저장하기
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Content Tab */}
            {activeTab === 'content' && (
              <>
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold mb-4 border-b pb-2">메인 히어로 섹션</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">메인 로고 URL</label>
                      <input type="text" value={formData.hero.logo1Url} onChange={e => handleChange('hero', 'logo1Url', e.target.value)} className="w-full p-2 border rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">텍스트 로고 URL</label>
                      <input type="text" value={formData.hero.logo2Url} onChange={e => handleChange('hero', 'logo2Url', e.target.value)} className="w-full p-2 border rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">메인 헤드라인 (HTML 허용)</label>
                      <textarea value={formData.hero.headline} onChange={e => handleChange('hero', 'headline', e.target.value)} className="w-full p-2 border rounded-lg" rows={3} />
                    </div>
                  </div>
                </section>

                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold mb-4 border-b pb-2">소개 섹션</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">제목 (HTML 허용)</label>
                      <input type="text" value={formData.about.title} onChange={e => handleChange('about', 'title', e.target.value)} className="w-full p-2 border rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">부제목 (HTML 허용)</label>
                      <input type="text" value={formData.about.subtitle} onChange={e => handleChange('about', 'subtitle', e.target.value)} className="w-full p-2 border rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">상세 설명</label>
                      <textarea value={formData.about.description} onChange={e => handleChange('about', 'description', e.target.value)} className="w-full p-2 border rounded-lg" rows={4} />
                    </div>
                  </div>
                </section>

                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold mb-4 border-b pb-2">연락처 정보</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                      <input type="text" value={formData.contact.email} onChange={e => handleChange('contact', 'email', e.target.value)} className="w-full p-2 border rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
                      <input type="text" value={formData.contact.phone} onChange={e => handleChange('contact', 'phone', e.target.value)} className="w-full p-2 border rounded-lg" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">주소</label>
                      <input type="text" value={formData.contact.address} onChange={e => handleChange('contact', 'address', e.target.value)} className="w-full p-2 border rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">카카오톡 ID</label>
                      <input type="text" value={formData.contact.kakaoId} onChange={e => handleChange('contact', 'kakaoId', e.target.value)} className="w-full p-2 border rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">카카오톡 QR 이미지 URL</label>
                      <input type="text" value={formData.contact.kakaoQrUrl} onChange={e => handleChange('contact', 'kakaoQrUrl', e.target.value)} className="w-full p-2 border rounded-lg" />
                    </div>
                  </div>
                </section>
              </>
            )}

            {/* Portfolio Tab */}
            {activeTab === 'portfolio' && (
              <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6 border-b pb-2">
                  <h3 className="text-lg font-bold">포트폴리오 아이템</h3>
                  <button onClick={addPortfolioItem} className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
                    <Plus size={16} /> 항목 추가
                  </button>
                </div>
                <div className="space-y-4">
                  {formData.portfolio.map((item, index) => (
                    <div key={item.id || index} className="flex gap-4 p-4 border rounded-xl bg-gray-50 items-start">
                      <div className="w-32 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                          <label className="block text-xs font-medium text-gray-500 mb-1">제목</label>
                          <input type="text" value={item.title} onChange={e => handlePortfolioChange(index, 'title', e.target.value)} className="w-full p-2 text-sm border rounded-lg" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">카테고리</label>
                          <select value={item.category} onChange={e => handlePortfolioChange(index, 'category', e.target.value)} className="w-full p-2 text-sm border rounded-lg">
                            <option value="차량랩핑">차량랩핑</option>
                            <option value="옥외광고">옥외광고</option>
                            <option value="현수막">현수막</option>
                            <option value="인쇄물">인쇄물</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">이미지 URL</label>
                          <input type="text" value={item.imageUrl} onChange={e => handlePortfolioChange(index, 'imageUrl', e.target.value)} className="w-full p-2 text-sm border rounded-lg" />
                        </div>
                      </div>
                      <button onClick={() => removePortfolioItem(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-6">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Theme Tab */}
            {activeTab === 'theme' && (
              <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-4 border-b pb-2">디자인 설정</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">브랜드 주요 색상 (Primary Color)</label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="color" 
                        value={formData.theme.primaryColor} 
                        onChange={e => handleChange('theme', 'primaryColor', e.target.value)} 
                        className="w-12 h-12 p-1 border rounded cursor-pointer" 
                      />
                      <input 
                        type="text" 
                        value={formData.theme.primaryColor} 
                        onChange={e => handleChange('theme', 'primaryColor', e.target.value)} 
                        className="p-2 border rounded-lg font-mono text-sm uppercase" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">폰트 패밀리 (CSS font-family)</label>
                    <input 
                      type="text" 
                      value={formData.theme.fontFamily} 
                      onChange={e => handleChange('theme', 'fontFamily', e.target.value)} 
                      className="w-full p-2 border rounded-lg font-mono text-sm" 
                      placeholder="Inter, Noto Sans KR, sans-serif"
                    />
                    <p className="text-xs text-gray-500 mt-1">기본값: Inter, Noto Sans KR, sans-serif</p>
                  </div>
                </div>
              </section>
            )}

            {/* SEO Tab */}
            {activeTab === 'seo' && (
              <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-4 border-b pb-2">검색엔진 최적화 (SEO)</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">사이트 제목 (Title)</label>
                    <input type="text" value={formData.seo.title} onChange={e => handleChange('seo', 'title', e.target.value)} className="w-full p-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">사이트 설명 (Description)</label>
                    <textarea value={formData.seo.description} onChange={e => handleChange('seo', 'description', e.target.value)} className="w-full p-2 border rounded-lg" rows={3} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">검색 키워드 (Keywords, 쉼표로 구분)</label>
                    <input type="text" value={formData.seo.keywords} onChange={e => handleChange('seo', 'keywords', e.target.value)} className="w-full p-2 border rounded-lg" />
                  </div>
                </div>
              </section>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};
