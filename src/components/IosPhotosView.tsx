import React, { useState } from 'react';
import { ChevronLeft, Share, Heart, Info, Trash2, Sliders, Play, MoreHorizontal } from 'lucide-react';
import { PerformanceScheme } from '../types';

interface IosPhotosViewProps {
  originalUrl: string;
  resultUrl: string;
  onClose: () => void;
  performanceScheme: PerformanceScheme;
}

interface PhotoItem {
  id: string;
  url: string;
  title?: string;
  isCustom?: boolean;
  isVideo?: boolean;
  isQuad?: boolean;
  quadUrls?: string[];
}

export const IosPhotosView: React.FC<IosPhotosViewProps> = ({
  originalUrl,
  resultUrl,
  onClose,
  performanceScheme,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [showEdited, setShowEdited] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'library' | 'foryou' | 'search'>('library');

  // Default high-quality fallback sukiyaki images
  const defaultSukiyaki = "https://images.unsplash.com/photo-1582450871972-ab5ca641643d?auto=format&fit=crop&w=800&q=80";
  const defaultSukiyakiEdited = "https://images.unsplash.com/photo-1626200419199-391ae4be7a40?auto=format&fit=crop&w=800&q=80";

  // Use uploaded images if they exist, otherwise fallback to high quality sukiyaki placeholders
  const activeOriginalUrl = originalUrl || defaultSukiyaki;
  const activeResultUrl = resultUrl || defaultSukiyakiEdited;

  const photos: PhotoItem[] = [
    // Row 1
    {
      id: 'r1c1',
      url: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=500&q=80',
      title: '美味鸡翅'
    },
    {
      id: 'r1c2',
      url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80',
      title: '健康健身餐'
    },
    {
      id: 'r1c3',
      url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80',
      title: '可乐夏日'
    },
    // Row 2
    {
      id: 'r2c1',
      url: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=500&q=80',
      title: '养生热汤'
    },
    {
      id: 'r2c2',
      url: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&w=500&q=80',
      title: '全家便利店'
    },
    {
      id: 'r2c3',
      url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80',
      title: '披萨派对'
    },
    // Row 3
    {
      id: 'r3c1',
      url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=500&q=80',
      title: 'KFC翅桶'
    },
    {
      id: 'r3c2',
      url: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=500&q=80',
      title: '烤鸡便当'
    },
    {
      id: 'r3c3',
      url: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=500&q=80',
      title: '魔术汽水瓶',
      isVideo: true
    },
    // Row 4
    {
      id: 'r4c1',
      url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80',
      title: '月亮舞台'
    },
    {
      id: 'r4c2',
      url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=500&q=80',
      title: '跑步机心率'
    },
    {
      id: 'r4c3',
      url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=500&q=80',
      title: '冲浪女孩'
    },
    // Row 5
    {
      id: 'r5c1',
      url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=500&q=80',
      title: '沙滩柠檬茶'
    },
    {
      id: 'r5c2',
      url: '',
      title: '合集',
      isQuad: true,
      quadUrls: [
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=150&q=80',
        'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=150&q=80',
        'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=150&q=80',
        'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=150&q=80'
      ]
    },
    {
      id: 'r5c3',
      url: activeOriginalUrl,
      title: '魔术表演',
      isCustom: true
    }
  ];

  const handlePhotoClick = (photo: PhotoItem) => {
    setSelectedPhoto(photo);
    setShowEdited(false);
  };

  const handleFullscreenClick = () => {
    if (selectedPhoto?.isCustom) {
      setShowEdited(!showEdited);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#000000] flex flex-col font-sans select-none overflow-hidden text-white">
      {/* Immersive Glassmorphism Background Blobs */}
      <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none bg-[#09090B]">
        {/* Soft glowing spheres perfectly mimicking photo gallery premium background vibes */}
        <div className="absolute top-[-10%] left-[-20%] w-[90%] h-[50%] rounded-full bg-gradient-to-br from-purple-900/35 to-violet-800/10 blur-[130px]" />
        <div className="absolute top-[20%] right-[-15%] w-[80%] h-[40%] rounded-full bg-gradient-to-br from-indigo-900/30 to-purple-800/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[10%] w-[70%] h-[50%] rounded-full bg-gradient-to-br from-emerald-950/25 to-teal-900/5 blur-[120px]" />
      </div>

      {/* iOS Status Bar */}
      <div className="h-11 px-6 flex items-center justify-between text-xs font-semibold select-none bg-black/10 backdrop-blur-md z-30">
        <div>10:52</div>
        <div className="flex items-center gap-1.5">
          {/* Signal */}
          <svg className="w-4 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2 16h3v4H2zm5-4h3v8H7zm5-4h3v12h-3zm5-4h3v16h-3z" />
          </svg>
          {/* WiFi */}
          <svg className="w-4 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.649 7.649a10.5 10.5 0 0114.702 0M8.184 11.184a5.5 5.5 0 017.632 0M12 15h.01" />
          </svg>
          {/* Battery */}
          <div className="w-5.5 h-3 border border-white/60 rounded-[3px] p-[1px] flex items-center">
            <div className="h-full w-4 bg-white rounded-[1px]"></div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* VIEW 1: Grid Gallery */}
        {!selectedPhoto && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header with Perfect Glassmorphism and Violet Buttons */}
            <div className="px-5 pt-4 pb-4.5 flex items-center justify-between z-10 bg-[#09090B]/30 backdrop-blur-xl border-b border-white/5">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-white/95">图库</h1>
                <p className="text-xs text-zinc-400 mt-1 font-medium">14,311 个项目</p>
              </div>
              <div className="flex items-center gap-3">
                {/* Custom Violet/Purple Glass Circle Button */}
                <div className="w-10 h-10 rounded-full bg-[#7B2CBF]/55 hover:bg-[#7B2CBF]/70 backdrop-blur-md border border-white/10 flex items-center justify-center text-white cursor-pointer active:scale-95 transition-all shadow-md">
                  <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="4" y1="7" x2="20" y2="7" />
                    <line x1="6" y1="12" x2="18" y2="12" />
                    <line x1="9" y1="17" x2="15" y2="17" />
                  </svg>
                </div>
                {/* High Glassmorphism Select Button */}
                <button className="bg-white/12 hover:bg-white/20 text-white text-sm font-bold px-4.5 py-1.5 rounded-full border border-white/10 backdrop-blur-md active:scale-95 transition-all shadow-xs">
                  选择
                </button>
              </div>
            </div>

            {/* Photos Grid - Semi-transparent background for rich blur bleed */}
            <div className="flex-1 overflow-y-auto p-[2px] bg-transparent">
              <div className="grid grid-cols-3 gap-[3px]">
                {photos.map((photo) => {
                  if (photo.isQuad && photo.quadUrls) {
                    return (
                      <div
                        key={photo.id}
                        onClick={() => handlePhotoClick(photo)}
                        className="aspect-square bg-zinc-900/20 rounded-xs overflow-hidden p-[1px] grid grid-cols-2 gap-[1px] cursor-pointer active:opacity-80 transition-opacity"
                      >
                        {photo.quadUrls.map((u, i) => (
                          <img
                            key={i}
                            src={u}
                            alt=""
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ))}
                      </div>
                    );
                  }

                  return (
                    <div
                      key={photo.id}
                      onClick={() => handlePhotoClick(photo)}
                      className="aspect-square relative bg-zinc-900/20 rounded-xs overflow-hidden cursor-pointer active:opacity-80 transition-all"
                    >
                      <img
                        src={photo.url}
                        alt={photo.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      {photo.isVideo && (
                        <div className="absolute bottom-1.5 right-1.5 bg-black/60 p-1 rounded-full">
                          <Play className="w-3 h-3 text-white fill-current" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Photos Footer Info */}
              <div className="text-center py-16 text-zinc-500 text-xs font-medium">
                <p>已与 iCloud 同步</p>
                <p className="mt-1 text-[10px] text-zinc-600">上次更新：刚刚</p>
              </div>
            </div>

            {/* iOS 18 Bottom Capsule Floating Dock with Premium Glassmorphism */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[85%] max-w-[340px] h-14 bg-[#1C1C1E]/75 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-around px-5 shadow-2xl z-20">
              <button
                onClick={() => setActiveTab('library')}
                className={`flex flex-col items-center gap-0.5 transition-colors ${
                  activeTab === 'library' ? 'text-blue-500' : 'text-zinc-400'
                }`}
              >
                <svg className="w-5.5 h-5.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 4h16v16H4V4zm2 2v12h12V6H6zm2 2h8v8H8V8z" />
                </svg>
                <span className="text-[9px] font-bold">图库</span>
              </button>

              <button
                onClick={() => setActiveTab('foryou')}
                className={`flex flex-col items-center gap-0.5 transition-colors ${
                  activeTab === 'foryou' ? 'text-blue-500' : 'text-zinc-400'
                }`}
              >
                <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span className="text-[9px] font-bold">精选集</span>
              </button>

              {/* Clicking Search silently exits the performance mode back to homepage */}
              <button
                onClick={onClose}
                className="flex flex-col items-center gap-0.5 text-zinc-400 hover:text-blue-500 active:scale-95 transition-all"
              >
                <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-[9px] font-bold">搜索</span>
              </button>
            </div>
          </div>
        )}

        {/* VIEW 2: Fullscreen Zoom Photo */}
        {selectedPhoto && (
          <div className="flex-1 bg-[#000000] flex flex-col justify-between overflow-hidden">
            {/* Top Navigation Bar */}
            <div className="h-14 px-4 flex items-center justify-between bg-black/40 backdrop-blur-md z-10">
              <button
                onClick={() => setSelectedPhoto(null)}
                className="flex items-center text-blue-500 text-sm font-semibold active:opacity-70 transition-opacity"
              >
                <ChevronLeft className="w-6 h-6 mr-1" />
                <span>今天 10:52</span>
              </button>

              <button className="text-blue-500 p-2 active:opacity-70 transition-opacity">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* Immersive Photo Display Area (Perfect 4:3 Frame) */}
            <div
              onClick={handleFullscreenClick}
              className="flex-1 flex items-center justify-center p-3 relative cursor-pointer"
            >
              {selectedPhoto.isQuad && selectedPhoto.quadUrls ? (
                <div className="w-full max-h-[70vh] aspect-[4/3] bg-zinc-950 grid grid-cols-2 gap-1 rounded-2xl overflow-hidden shadow-2xl">
                  {selectedPhoto.quadUrls.map((u, i) => (
                    <img key={i} src={u} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ))}
                </div>
              ) : selectedPhoto.isCustom ? (
                // Custom image with completely silent, pristine magic switch transition (no badges, labels or text hints)
                <div className="relative w-full max-h-[70vh] aspect-[3/4] flex items-center justify-center">
                  <img
                    src={showEdited ? activeResultUrl : activeOriginalUrl}
                    alt="Magic Photo"
                    className="max-w-full max-h-[70vh] object-contain rounded-2xl shadow-2xl transition-all duration-300"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                // Regular photo
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.title}
                  className="max-w-full max-h-[70vh] object-contain rounded-2xl shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>

            {/* Bottom iOS Photo Controls bar */}
            <div className="h-20 bg-black/85 border-t border-zinc-900/60 flex justify-around items-center px-6 pb-2">
              <button className="text-blue-500 p-2.5 hover:bg-zinc-900/40 rounded-full active:scale-95 transition-all">
                <Share className="w-5.5 h-5.5" />
              </button>
              <button className="text-blue-500 p-2.5 hover:bg-zinc-900/40 rounded-full active:scale-95 transition-all">
                <Heart className="w-5.5 h-5.5" />
              </button>
              <button className="text-blue-500 p-2.5 hover:bg-zinc-900/40 rounded-full active:scale-95 transition-all">
                <Info className="w-5.5 h-5.5" />
              </button>
              <button className="text-blue-500 p-2.5 hover:bg-zinc-900/40 rounded-full active:scale-95 transition-all">
                <Trash2 className="w-5.5 h-5.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* iOS Home Indicator */}
      <div className="h-5 bg-black flex items-center justify-center pb-2">
        <div className="w-36 h-1 bg-white/40 rounded-full"></div>
      </div>
    </div>
  );
};
