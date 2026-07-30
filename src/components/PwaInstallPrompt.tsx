import React from 'react';
import { X, Share, PlusSquare, Smartphone, Sparkles, CheckCircle2 } from 'lucide-react';

interface PwaInstallPromptProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PwaInstallPrompt: React.FC<PwaInstallPromptProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-white border border-zinc-200/80 rounded-[2.5rem] p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 border-b border-zinc-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-zinc-900 tracking-tight">添加到 iPhone 主屏幕</h3>
              <p className="text-[11px] text-zinc-400">体验全屏无边框 iOS 原生应用效果</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl text-zinc-400 hover:text-zinc-900 bg-zinc-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Simple Steps */}
        <div className="space-y-3 my-4 text-xs">
          <div className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-3.5 flex items-start gap-3 shadow-xs">
            <div className="w-7 h-7 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 font-bold flex items-center justify-center flex-shrink-0">
              <Share className="w-4 h-4" />
            </div>
            <div>
              <div className="font-extrabold text-zinc-900 mb-0.5">1. 点击 Safari 底部【分享】按钮</div>
              <div className="text-zinc-500 text-[11px] leading-relaxed">
                在 iPhone Safari 浏览器下方工具栏中，找到中间带向上箭头的【分享】图标。
              </div>
            </div>
          </div>

          <div className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-3.5 flex items-start gap-3 shadow-xs">
            <div className="w-7 h-7 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 font-bold flex items-center justify-center flex-shrink-0">
              <PlusSquare className="w-4 h-4" />
            </div>
            <div>
              <div className="font-extrabold text-zinc-900 mb-0.5">2. 向上滑动找到【添加到主屏幕】</div>
              <div className="text-zinc-500 text-[11px] leading-relaxed">
                在弹出的系统分享菜单中向上滑动，点击【添加到主屏幕】选项。
              </div>
            </div>
          </div>

          <div className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-3.5 flex items-start gap-3 shadow-xs">
            <div className="w-7 h-7 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 font-bold flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="font-extrabold text-zinc-900 mb-0.5">3. 点击右上角【添加】完成安装</div>
              <div className="text-zinc-500 text-[11px] leading-relaxed">
                返回桌面即可看到“Lens AI”应用图标，点开即可拥有原生 App 一样的全屏沉浸感！
              </div>
            </div>
          </div>
        </div>

        {/* Dismiss Button */}
        <div className="pt-2 border-t border-zinc-100">
          <button
            onClick={onClose}
            className="w-full py-3.5 px-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white font-extrabold text-xs active:scale-95 transition-all shadow-xs"
          >
            知道了，去添加主屏幕
          </button>
        </div>
      </div>
    </div>
  );
};
