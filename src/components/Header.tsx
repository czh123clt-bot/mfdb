import React from 'react';
import { Sparkles, Settings, Share2, HelpCircle, History, Smartphone } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenShortcutGuide: () => void;
  onOpenPwaGuide: () => void;
  onOpenHistory: () => void;
  onGoHome: () => void;
  isHome: boolean;
  doubaoConfigured: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSettings,
  onOpenShortcutGuide,
  onOpenPwaGuide,
  onOpenHistory,
  onGoHome,
  isHome,
  doubaoConfigured
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-zinc-200/80 px-5 py-3.5 pt-safe shadow-xs">
      <div className="max-w-md mx-auto flex justify-between items-center">
        {/* Brand Logo & Name */}
        <button
          onClick={onGoHome}
          className="flex items-center gap-3 text-left active:scale-95 transition-transform"
        >
          <div className="w-10 h-10 rounded-2xl bg-blue-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-zinc-900 tracking-tight">Lens AI</h1>
          </div>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Shortcut Guide Button */}
          <button
            onClick={onOpenShortcutGuide}
            className="p-2 rounded-2xl text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 active:scale-90 transition-all"
            title="iOS快捷指令保存设置"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* PWA Add to Home Screen */}
          <button
            onClick={onOpenPwaGuide}
            className="p-2 rounded-2xl text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 active:scale-90 transition-all"
            title="添加到手机主屏幕"
          >
            <Smartphone className="w-4 h-4" />
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-2xl text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 active:scale-90 transition-all"
            title="设置"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
