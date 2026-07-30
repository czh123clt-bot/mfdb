import React, { useState } from 'react';
import { X, Share2, Zap, CheckCircle2, Copy, ExternalLink, Smartphone } from 'lucide-react';

interface ShortcutGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutGuideModal: React.FC<ShortcutGuideModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shortcutInstructions = `【iPhone 快捷指令配置步骤】
1. 打开 iOS 自带的《快捷指令》App
2. 点击右上角“+”新建快捷指令，命名为：“保存相册”
3. 添加动作：选择“保存到相册”或“保存到照片”
4. 开启“在分享表单中显示”和“接收剪贴板内容”
5. 保存后即可在本网站点击【调用 iOS 快捷指令保存相册】实现一键无缝存图！`;

  const handleCopyInstructions = () => {
    navigator.clipboard.writeText(shortcutInstructions);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenShortcutsApp = () => {
    window.location.href = 'shortcuts://';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-white border border-zinc-200/80 rounded-[2.5rem] p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 border-b border-zinc-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-zinc-900 tracking-tight">iOS 快捷指令保存教程</h3>
              <p className="text-[11px] text-zinc-400">设置《保存相册》快捷指令实现一键存相册</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl text-zinc-400 hover:text-zinc-900 bg-zinc-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Steps */}
        <div className="space-y-3 my-4 text-xs">
          <div className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-3.5 flex items-start gap-3 shadow-xs">
            <div className="w-6 h-6 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center flex-shrink-0 text-xs">
              1
            </div>
            <div>
              <div className="font-extrabold text-zinc-900 mb-0.5">打开 iPhone 《快捷指令》App</div>
              <div className="text-zinc-500 text-[11px] leading-relaxed">
                在 iPhone 桌面找到系统自带的【快捷指令】应用，点击右上角的【+】按钮新建。
              </div>
            </div>
          </div>

          <div className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-3.5 flex items-start gap-3 shadow-xs">
            <div className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center flex-shrink-0 text-xs">
              2
            </div>
            <div>
              <div className="font-extrabold text-zinc-900 mb-0.5">添加“保存到相册”动作</div>
              <div className="text-zinc-500 text-[11px] leading-relaxed">
                搜索并添加动作【保存到照片相册】，将输入设为【剪贴板】或【快捷指令输入】。
              </div>
            </div>
          </div>

          <div className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-3.5 flex items-start gap-3 shadow-xs">
            <div className="w-6 h-6 rounded-full bg-pink-600 text-white font-bold flex items-center justify-center flex-shrink-0 text-xs">
              3
            </div>
            <div>
              <div className="font-extrabold text-zinc-900 mb-0.5">重命名快捷指令为 “保存相册”</div>
              <div className="text-zinc-500 text-[11px] leading-relaxed">
                将该快捷指令名称精确设置为 <code className="bg-zinc-200/80 px-1.5 py-0.5 rounded text-blue-700 font-bold">保存相册</code>。以后在本网页生图后点击即可一键保存！
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-2 border-t border-zinc-100">
          <button
            onClick={handleOpenShortcutsApp}
            className="w-full py-3.5 px-4 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md shadow-blue-500/20"
          >
            <ExternalLink className="w-4 h-4" />
            <span>打开 iPhone 《快捷指令》App 设置</span>
          </button>

          <button
            onClick={handleCopyInstructions}
            className="w-full py-3 px-4 rounded-2xl bg-zinc-100 hover:bg-zinc-200/80 border border-zinc-200/80 text-zinc-800 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-blue-600" />}
            <span>{copied ? '教程复制成功！' : '复制步骤文字'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
