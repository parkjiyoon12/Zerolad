import React, { useState } from 'react';
import { useSiteData } from './SiteContext';
import { useAuth } from './AuthContext';
import { Settings, LayoutTemplate, Image as ImageIcon, Palette, Plus, Trash2, ArrowLeft, Save, LogIn, LogOut, Upload } from 'lucide-react';
import { PortfolioItemData } from '../types';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

export const AdminDashboard: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const { data, updateTheme, updateContent, updatePortfolio, resetToDefault } = useSiteData();
  const { user, isAdmin, isAuthReady, login, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'general' | 'theme' | 'portfolio'>('general');
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  // Local state for portfolio editing to avoid constant re-renders on every keystroke
  const [localPortfolio, setLocalPortfolio] = useState<PortfolioItemData[]>(data.portfolio);

  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 max-w-md w-full text-center">
          <Settings size={48} className="mx-auto text-blue-600 mb-6" />
          <h2 className="text-2xl font-bold mb-2">관리자 로그인</h2>
          <p className="text-gray-600 mb-8">
            대시보드에 접근하려면 관리자 계정으로 로그인해야 합니다.
          </p>
          
          {user ? (
            <div className="space-y-4">
              <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">
                접근 권한이 없는 계정입니다. ({user.email})
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
              >
                <LogOut size={18} />
                다른 계정으로 로그인
              </button>
            </div>
          ) : (
            <button
              onClick={login}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              <LogIn size={18} />
              Google 계정으로 로그인
            </button>
          )}
          
          <button
            onClick={onExit}
            className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors font-medium"
          >
            <ArrowLeft size={18} />
            웹사이트로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('social_')) {
      const socialKey = name.replace('social_', '');
      updateContent({
        socialLinks: { ...data.content.socialLinks, [socialKey]: value }
      });
    } else {
      updateContent({ [name]: value });
    }
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateTheme({ [name]: value });
  };

  const handlePortfolioChange = (index: number, field: keyof PortfolioItemData, value: string) => {
    const updated = [...localPortfolio];
    updated[index] = { ...updated[index], [field]: value };
    setLocalPortfolio(updated);
  };

  const addPortfolioItem = () => {
    setLocalPortfolio([{ title: '새 포트폴리오', imageUrl: '', category: '차량랩핑' }, ...localPortfolio]);
  };

  const removePortfolioItem = (index: number) => {
    const updated = localPortfolio.filter((_, i) => i !== index);
    setLocalPortfolio(updated);
  };

  const savePortfolio = () => {
    updatePortfolio(localPortfolio);
    alert('포트폴리오가 저장되었습니다.');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingIndex(index);
      
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `portfolio/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const storageRef = ref(storage, fileName);

      // Upload file
      await uploadBytes(storageRef, file);
      
      // Get download URL
      const downloadURL = await getDownloadURL(storageRef);
      
      // Update local portfolio
      handlePortfolioChange(index, 'imageUrl', downloadURL);
      
    } catch (error: any) {
      console.error("Error uploading image: ", error);
      alert(`이미지 업로드에 실패했습니다. Firebase Storage 권한을 확인해주세요. (${error.message})`);
    } finally {
      setUploadingIndex(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans text-gray-900">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col h-auto md:h-screen sticky top-0">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Settings size={20} className="text-blue-600" />
            관리자 대시보드
          </h2>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button
            onClick={() => setActiveTab('general')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'general' ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-gray-100 text-gray-600'}`}
          >
            <LayoutTemplate size={18} />
            일반 설정
          </button>
          <button
            onClick={() => setActiveTab('theme')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'theme' ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-gray-100 text-gray-600'}`}
          >
            <Palette size={18} />
            테마 & 색상
          </button>
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'portfolio' ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-gray-100 text-gray-600'}`}
          >
            <ImageIcon size={18} />
            포트폴리오 관리
          </button>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onExit}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft size={16} />
            웹사이트로 돌아가기
          </button>
          <button
            onClick={() => {
              if(confirm('모든 설정을 초기화하시겠습니까?')) {
                resetToDefault();
                setLocalPortfolio(data.portfolio);
              }
            }}
            className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            기본값으로 초기화
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10 overflow-y-auto h-screen">
        <div className="max-w-4xl mx-auto">
          
          {activeTab === 'general' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h3 className="text-2xl font-bold mb-6">일반 설정</h3>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">메인 헤드라인</label>
                    <textarea
                      name="heroHeadline"
                      value={data.content.heroHeadline}
                      onChange={handleContentChange}
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">서브 헤드라인</label>
                    <input
                      type="text"
                      name="heroSubheadline"
                      value={data.content.heroSubheadline}
                      onChange={handleContentChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">버튼 텍스트</label>
                    <input
                      type="text"
                      name="heroCtaText"
                      value={data.content.heroCtaText}
                      onChange={handleContentChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">소개 텍스트 (About)</label>
                    <textarea
                      name="aboutText"
                      value={data.content.aboutText}
                      onChange={handleContentChange}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">소셜 미디어 링크</h3>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Instagram URL</label>
                    <input
                      type="url"
                      name="social_instagram"
                      value={data.content.socialLinks.instagram}
                      onChange={handleContentChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Facebook URL</label>
                    <input
                      type="url"
                      name="social_facebook"
                      value={data.content.socialLinks.facebook}
                      onChange={handleContentChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Naver Blog URL</label>
                    <input
                      type="url"
                      name="social_blog"
                      value={data.content.socialLinks.blog}
                      onChange={handleContentChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'theme' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-2xl font-bold mb-6">테마 & 색상</h3>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">포인트 컬러 (Primary Color)</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        name="primaryColor"
                        value={data.theme.primaryColor}
                        onChange={handleThemeChange}
                        className="w-12 h-12 p-1 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        name="primaryColor"
                        value={data.theme.primaryColor}
                        onChange={handleThemeChange}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">배경 색상 (Background)</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        name="backgroundColor"
                        value={data.theme.backgroundColor}
                        onChange={handleThemeChange}
                        className="w-12 h-12 p-1 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        name="backgroundColor"
                        value={data.theme.backgroundColor}
                        onChange={handleThemeChange}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">텍스트 색상 (Text Color)</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        name="textColor"
                        value={data.theme.textColor}
                        onChange={handleThemeChange}
                        className="w-12 h-12 p-1 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        name="textColor"
                        value={data.theme.textColor}
                        onChange={handleThemeChange}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">폰트 (Font Family)</label>
                    <select
                      name="fontFamily"
                      value={data.theme.fontFamily}
                      onChange={handleThemeChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="'Inter', 'Noto Sans KR', sans-serif">Inter / Noto Sans KR (기본)</option>
                      <option value="'Pretendard', sans-serif">Pretendard</option>
                      <option value="'Gothic A1', sans-serif">Gothic A1</option>
                      <option value="'Nanum Myeongjo', serif">Nanum Myeongjo (명조체)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'portfolio' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">포트폴리오 관리</h3>
                <div className="flex gap-3">
                  <button
                    onClick={addPortfolioItem}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Plus size={16} />
                    새 항목 추가
                  </button>
                  <button
                    onClick={savePortfolio}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    <Save size={16} />
                    변경사항 저장
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {localPortfolio.map((item, index) => (
                  <div key={index} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 items-start">
                    <div className="w-full md:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">이미지 없음</div>
                      )}
                    </div>
                    
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">제목</label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => handlePortfolioChange(index, 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">카테고리</label>
                        <select
                          value={item.category || ''}
                          onChange={(e) => handlePortfolioChange(index, 'category', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                        >
                          <option value="차량랩핑">차량랩핑</option>
                          <option value="옥외광고">옥외광고</option>
                          <option value="현수막">현수막</option>
                          <option value="인쇄물">인쇄물</option>
                          <option value="기타">기타</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-500 mb-1">이미지 업로드 및 URL</label>
                        <div className="flex gap-2">
                           <input
                             type="text"
                             value={item.imageUrl}
                             onChange={(e) => handlePortfolioChange(index, 'imageUrl', e.target.value)}
                             className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                             placeholder="https://..."
                           />
                           <label className={`flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium cursor-pointer transition-colors ${uploadingIndex === index ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>
                              {uploadingIndex === index ? (
                                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <>
                                  <Upload size={16} /> 업로드
                                </>
                              )}
                              <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={(e) => handleImageUpload(e, index)}
                                disabled={uploadingIndex === index}
                              />
                           </label>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => removePortfolioItem(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-2 md:mt-0"
                      title="삭제"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
                
                {localPortfolio.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300 text-gray-500">
                    포트폴리오 항목이 없습니다. 새 항목을 추가해주세요.
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
