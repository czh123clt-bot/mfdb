import React, { useState, useEffect } from 'react';
import { Share2, Download, Zap, RefreshCw, CheckCircle2, Copy, Sparkles, SlidersHorizontal, ArrowLeft, ExternalLink, ShieldCheck } from 'lucide-react';
import { HistoryItem } from '../types';

interface ResultViewProps {
  originalUrl: string;
  resultUrl: string;
  width: number;
  height: number;
  prompt: string;
  modelUsed: string;
  isSimulated?: boolean;
  notice?: string;
  onReEdit: () => void;
  onNewPhoto: () => void;
  onOpenShortcutGuide: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  originalUrl,
  resultUrl,
  width,
  height,
  prompt,
  modelUsed,
  isSimulated,
  notice,
  onReEdit,
  onNewPhoto,
  onOpenShortcutGuide,
}) => {
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Aspect ratio label formatter
  const getRatioText = (w: number, h: number) => {
    if (!w || !h) return '高清画幅';
    const ratio = w / h;
    if (Math.abs(ratio - 1) < 0.05) return '正方形画幅';
    if (Math.abs(ratio - 4/3) < 0.06) return '4:3 横屏';
    if (Math.abs(ratio - 3/4) < 0.06) return '3:4 竖屏';
    if (Math.abs(ratio - 16/9) < 0.06) return '16:9 宽屏';
    if (Math.abs(ratio - 9/16) < 0.06) return '9:16 手机全屏';
    return `画幅尺寸 (${w}×${h})`;
  };

  // Helper to get exported image directly
  const getImageBlobWithExactAspect = (imageUrl: string, targetW: number, targetH: number): Promise<Blob> => {
    return fetch(imageUrl).then((r) => r.blob());
  };

  // Automatically invoke iOS shortcut when resultUrl is ready
  useEffect(() => {
    if (resultUrl) {
      const autoSave = async () => {
        try {
          const blob = await getImageBlobWithExactAspect(resultUrl, width, height);
          
          if (navigator.clipboard && window.ClipboardItem) {
            try {
              await navigator.clipboard.write([
                new ClipboardItem({ [blob.type]: blob })
              ]);
              setSaveStatus('✨ 修图完成！已自动复制高清照片并调起《保存相册》快捷指令');
            } catch (clipErr) {
              console.warn('Clipboard auto write notice:', clipErr);
              setSaveStatus('✨ 修图完成！正在调起《保存相册》快捷指令...');
            }
          } else {
            setSaveStatus('✨ 修图完成！正在调起《保存相册》快捷指令...');
          }

          const shortcutUrl = 'shortcuts://run-shortcut?name=' + encodeURIComponent('保存相册');
          setTimeout(() => {
            window.location.href = shortcutUrl;
          }, 400);

          setTimeout(() => setSaveStatus(null), 6000);
        } catch (err) {
          console.error('Auto shortcut trigger failed:', err);
        }
      };

      autoSave();
    }
  }, [resultUrl, width, height]);

  // Convert Base64 or Data URL to File object for Web Share API
  const urlToFile = async (imageUrl: string, filename: string): Promise<File> => {
    const blob = await getImageBlobWithExactAspect(imageUrl, width, height);
    return new File([blob], filename, { type: blob.type || 'image/png' });
  };

  // Option 1: Trigger iOS Web Share API (native iOS Share Sheet with "Save Image")
  const handleNativeShare = async () => {
    try {
      const file = await urlToFile(resultUrl, `doubao_edit_${Date.now()}.png`);
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: '豆包AI修图作品',
          text: '使用豆包AI生图生成的照片',
        });
        setSaveStatus('已唤起 iOS 原生分享菜单！直接选择“保存图像”即可');
        setTimeout(() => setSaveStatus(null), 4000);
      } else {
        handleCopyToClipboard();
      }
    } catch (err) {
      console.log('Share dismissed or not supported', err);
      handleDownload();
    }
  };

  // Option 2: Copy image to Clipboard & Invoke iOS Shortcuts deep link
  const handleTriggerShortcut = async () => {
    try {
      const blob = await getImageBlobWithExactAspect(resultUrl, width, height);
      
      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ [blob.type]: blob })
        ]);
        setSaveStatus('照片已成功复制到剪贴板！正在调用 iOS 快捷指令...');
      } else {
        setSaveStatus('正在唤起 iOS 快捷指令...');
      }

      const shortcutUrl = 'shortcuts://run-shortcut?name=' + encodeURIComponent('保存相册');
      
      setTimeout(() => {
        window.location.href = shortcutUrl;
      }, 600);

      setTimeout(() => setSaveStatus(null), 5000);
    } catch (err) {
      console.error('Shortcut trigger error', err);
      handleDownload();
    }
  };

  // Option 3: Copy image to clipboard for manual shortcut paste
  const handleCopyToClipboard = async () => {
    try {
      const blob = await getImageBlobWithExactAspect(resultUrl, width, height);
      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ [blob.type]: blob })
        ]);
        setSaveStatus('已将高清照片复制到剪贴板！');
        setTimeout(() => setSaveStatus(null), 3000);
      }
    } catch (e) {
      handleDownload();
    }
  };

  // Option 4: Direct browser file download
  const handleDownload = async () => {
    try {
      const blob = await getImageBlobWithExactAspect(resultUrl, width, height);
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `doubao_photo_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
      setSaveStatus('已触发高分辨率 PNG 图片下载！');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      const link = document.createElement('a');
      link.href = resultUrl;
      link.download = `doubao_photo_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between max-w-md mx-auto w-full p-5 overflow-y-auto">
      {/* Notice Banner if preview mode */}
      {notice && (
        <div className="mb-3 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5 font-medium shadow-xs">
          <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">{notice}</div>
        </div>
      )}

      {/* Header Info */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-extrabold text-zinc-900">修图完成</span>
          <span className="text-[10px] bg-blue-50 border border-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full font-mono font-bold">
            {width} × {height} ({getRatioText(width, height)})
          </span>
        </div>
      </div>

      {/* Main Image Viewport */}
      <div className="relative rounded-2xl overflow-hidden border border-zinc-200/80 bg-zinc-900 shadow-xl my-2 flex items-center justify-center p-1">
        <img
          src={resultUrl}
          alt="Result"
          className="w-full h-auto max-h-[55vh] object-contain rounded-xl block transition-all"
        />

        {/* Badge Overlay */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md border border-zinc-200/80 px-3 py-1 rounded-xl text-[10px] text-zinc-900 font-bold flex items-center gap-1.5 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>AI 修图效果</span>
        </div>
      </div>

      {/* Prompt Summary */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-3.5 my-2 text-xs shadow-xs">
        <div className="text-zinc-400 text-[10px] mb-1 font-bold">修改指令（Prompt）：</div>
        <div className="text-zinc-800 font-medium leading-relaxed bg-zinc-50 p-2.5 rounded-xl border border-zinc-200/60">
          "{prompt}"
        </div>
      </div>

      {/* Status Alert Toast */}
      {saveStatus && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs text-center font-bold animate-in fade-in">
          {saveStatus}
        </div>
      )}

      {/* Save Options (Required 3 Options for iOS Shortcuts & Album Saving) */}
      <div className="space-y-2.5 my-3">
        <div className="text-xs font-bold text-zinc-700 px-1">保存至相册方式：</div>

        {/* Option A: iOS Shortcut Trigger */}
        <button
          onClick={handleTriggerShortcut}
          className="w-full p-4 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-between active:scale-[0.98] transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div className="text-left">
              <div className="text-xs font-extrabold">调用 iOS 快捷指令保存相册</div>
              <div className="text-[10px] text-blue-100 font-normal">复制照片并自动唤起《保存相册》快捷指令</div>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-white/80" />
        </button>

        {/* Option B: Native Web Share Sheet */}
        <button
          onClick={handleNativeShare}
          className="w-full p-3.5 rounded-2xl bg-white hover:bg-zinc-50 border border-zinc-200/80 text-zinc-900 font-bold text-xs flex items-center justify-between shadow-xs active:scale-[0.98] transition-all"
        >
          <div className="flex items-center gap-2.5">
            <Share2 className="w-4 h-4 text-purple-600" />
            <span>iOS 系统原生分享（弹窗直接点保存图像）</span>
          </div>
          <span className="text-[10px] text-zinc-400 font-medium">推荐</span>
        </button>

        {/* Option C: Direct Download / Copy */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleDownload}
            className="p-3 rounded-2xl bg-white hover:bg-zinc-50 border border-zinc-200/80 text-zinc-800 text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>下载高清图片</span>
          </button>

          <button
            onClick={handleCopyToClipboard}
            className="p-3 rounded-2xl bg-white hover:bg-zinc-50 border border-zinc-200/80 text-zinc-800 text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all"
          >
            <Copy className="w-3.5 h-3.5 text-pink-600" />
            <span>复制图片到剪贴板</span>
          </button>
        </div>
      </div>

      {/* Bottom Secondary Action Controls */}
      <div className="flex items-center gap-2 border-t border-zinc-200/80 pt-3">
        <button
          onClick={onReEdit}
          className="flex-1 py-3 rounded-2xl bg-white hover:bg-zinc-50 border border-zinc-200/80 text-zinc-800 text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>重新修改此图</span>
        </button>

        <button
          onClick={onNewPhoto}
          className="flex-1 py-3 rounded-2xl bg-zinc-900 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>选择新照片</span>
        </button>
      </div>
    </div>
  );
};
