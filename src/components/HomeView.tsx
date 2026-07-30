import React, { useRef } from 'react';
import { Image as ImageIcon, Camera, Share2, Smartphone, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { HistoryItem } from '../types';

interface HomeViewProps {
  onSelectImage: (file: File, source: 'album' | 'camera') => void;
  onOpenShortcutGuide: () => void;
  onOpenPwaGuide: () => void;
  history: HistoryItem[];
  onSelectHistory: (item: HistoryItem) => void;
  onEnterPerformanceMode: () => void;
  scenario: 'scheme1' | 'scheme2' | 'scheme3';
  onSelectScenario: (scenario: 'scheme1' | 'scheme2' | 'scheme3') => void;
  hasCustomImage: boolean;
  slots: {
    scheme1: { original: string; result: string };
    scheme2: { original: string; result: string };
    scheme3: { original: string; result: string };
  };
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectImage,
  onOpenShortcutGuide,
  onOpenPwaGuide,
  history,
  onSelectHistory,
  onEnterPerformanceMode,
  scenario,
  onSelectScenario,
  hasCustomImage,
  slots,
}) => {
  const albumInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, source: 'album' | 'camera') => {
    const file = e.target.files?.[0];
    if (file) {
      onSelectImage(file, source);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between px-5 py-6 max-w-md mx-auto w-full overflow-y-auto">
      {/* Main Action Buttons */}
      <div className="my-auto space-y-3.5">
        {/* Hidden File Inputs */}
        <input
          type="file"
          accept="image/*"
          ref={albumInputRef}
          onChange={(e) => handleFileChange(e, 'album')}
          className="hidden"
        />
        <input
          type="file"
          accept="image/*"
          capture="environment"
          ref={cameraInputRef}
          onChange={(e) => handleFileChange(e, 'camera')}
          className="hidden"
        />

        {/* Button 1: Upload from Album (Clean Light Card) - Aspect ratio constrained to 3:4 */}
        <button
          onClick={() => albumInputRef.current?.click()}
          className="w-full relative group overflow-hidden rounded-[2.25rem] bg-white border border-zinc-200/80 p-5 shadow-sm hover:border-zinc-300 active:scale-[0.98] transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <ImageIcon className="w-7 h-7" />
              </div>
              <div className="text-left">
                <div className="font-bold text-base text-zinc-900 flex items-center gap-1.5">
                  <span>从 iPhone 相册选择图片</span>
                  <span className="text-[9px] bg-blue-50 text-blue-600 font-extrabold px-1.5 py-0.5 rounded-full">3:4</span>
                </div>
                <div className="text-xs text-zinc-400 mt-0.5">
                  自动锁定 3:4 比例，消除路人或修改文字
                </div>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-zinc-400 group-hover:translate-x-1 group-hover:text-zinc-900 transition-all" />
          </div>
        </button>

        {/* Button 2: Camera Capture (Contrast Dark Card) - Aspect ratio constrained to 3:4 */}
        <button
          onClick={() => cameraInputRef.current?.click()}
          className="w-full relative group overflow-hidden rounded-[2.25rem] bg-zinc-900 p-5 shadow-md active:scale-[0.98] transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-zinc-800 border border-zinc-700 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                <Camera className="w-7 h-7" />
              </div>
              <div className="text-left">
                <div className="font-bold text-base text-white flex items-center gap-1.5">
                  <span>打开相机拍照修图</span>
                  <span className="text-[9px] bg-zinc-800 border border-zinc-700 text-zinc-300 font-extrabold px-1.5 py-0.5 rounded-full">3:4</span>
                </div>
                <div className="text-xs text-zinc-400 mt-0.5">
                  自动捕捉 3:4 照片，拍完直接触控涂抹
                </div>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-zinc-400 group-hover:translate-x-1 group-hover:text-white transition-all" />
          </div>
        </button>

        {/* Clean, Textless Scenario Thumbnail Grid */}
        <div className="w-full bg-white border border-zinc-200/80 rounded-[2.25rem] p-4 shadow-sm">
          <div className="grid grid-cols-3 gap-3">
            {(['scheme1', 'scheme2', 'scheme3'] as const).map((scheme, idx) => {
              const isActive = scenario === scheme;
              const originalImg = slots[scheme]?.original;
              return (
                <button
                  key={scheme}
                  onClick={() => onSelectScenario(scheme)}
                  className={`aspect-[3/4] rounded-2xl border-2 overflow-hidden relative transition-all duration-300 active:scale-95 shadow-xs group ${
                    isActive
                      ? 'border-blue-500 ring-4 ring-blue-500/15 scale-[1.02]'
                      : 'border-zinc-200/80 hover:border-zinc-300'
                  }`}
                >
                  {originalImg ? (
                    <img
                      src={originalImg}
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-100 flex items-center justify-center text-zinc-400 text-xs font-bold">
                      <span>空白</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Button 3: Magic Performance Mode (iOS Photo Gallery Simulator) */}
        <button
          onClick={onEnterPerformanceMode}
          className="w-full relative group overflow-hidden rounded-[2.25rem] bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-5 shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all border border-indigo-500"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <div className="font-bold text-base text-white flex items-center gap-1.5">
                  <span>进入魔术表演模式</span>
                  <span className="text-[9px] bg-white/20 text-white font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider">iOS 18</span>
                </div>
                <div className="text-xs text-white/85 mt-0.5">
                  完美模拟系统相册，一击无缝切换前/后重绘效果
                </div>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-white/80 group-hover:translate-x-1 group-hover:text-white transition-all" />
          </div>
        </button>
      </div>

      {/* Shortcuts & App Features Notice */}
      <div className="space-y-2.5">
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-900">iOS 快捷指令相册保存</div>
              <div className="text-[10px] text-zinc-400">修图完成后可直接连通快捷指令存入相册</div>
            </div>
          </div>
          <button
            onClick={onOpenShortcutGuide}
            className="text-xs font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-xl transition-colors"
          >
            设置指南
          </button>
        </div>

        {/* PWA Native App Add Tip */}
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-900">添加到手机主屏幕</div>
              <div className="text-[10px] text-zinc-400">全屏无边框，全功能和原生 App 一样</div>
            </div>
          </div>
          <button
            onClick={onOpenPwaGuide}
            className="text-xs font-bold text-purple-600 hover:bg-purple-50 px-3 py-1.5 rounded-xl transition-colors"
          >
            添加技巧
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 text-center border-t border-zinc-200/60">
        <p className="text-[10px] text-zinc-400 flex items-center justify-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-blue-500" />
          <span>输出尺寸与原图保持 3:4 画幅 · 接入豆包生图大模型</span>
        </p>
      </div>
    </div>
  );
};
