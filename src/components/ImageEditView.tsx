import React, { useState } from 'react';
import { Sparkles, Wand2, ArrowLeft, Type, Eraser, HelpCircle, X, Check } from 'lucide-react';
import { EditMode, ImageDimensions } from '../types';

interface ImageEditViewProps {
  imageSrc: string;
  dimensions: ImageDimensions;
  onCancel: () => void;
  onSubmit: (prompt: string, mode: EditMode) => void;
  isGenerating: boolean;
}

export const ImageEditView: React.FC<ImageEditViewProps> = ({
  imageSrc,
  dimensions,
  onCancel,
  onSubmit,
  isGenerating,
}) => {
  const [selectedMode, setSelectedMode] = useState<EditMode>('remove');
  
  // Clean object input: defaults to "黑色杯子和吸管"
  const [targetItem, setTargetItem] = useState<string>('黑色杯子和吸管');
  const [showModal, setShowModal] = useState<boolean>(true);

  // Auto-generate the precise template prompt requested by the user
  const getConstructedPrompt = (input: string, mode: EditMode) => {
    const cleanInput = input.trim() || '黑色杯子和吸管';
    if (mode === 'remove') {
      return `仅移除画面的${cleanInput}，按原图纹理、光影和透视自然补全被遮挡区域。不要裁剪画面，不要放大，不要拉伸，不要改变边缘内容，不要改变其他物体位置，保持原始构图和比例完全一致。`;
    } else {
      return `将画面中指定的文字完美替换为："${cleanInput}"。请保持原有字体风格、字号、颜色和透视对齐，周围其余画面和背景百分之百保持不变。`;
    }
  };

  const removePresets = [
    '黑色杯子和吸管',
    '桌面上的麦芽口腔药盒',
    '右侧背景多余的纸箱与杂物',
    '画面中不需要的无关路人或遮挡物',
  ];

  const textPresets = [
    'CHAGEE QINGHAI • 青花瓷杯',
    '生日快乐！',
    '2026',
    '豆包魔法店',
  ];

  const activePresets = selectedMode === 'text' ? textPresets : removePresets;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalPrompt = getConstructedPrompt(targetItem, selectedMode);
    onSubmit(finalPrompt, selectedMode);
    setShowModal(false);
  };

  return (
    <div className="flex-1 flex flex-col justify-between max-w-md mx-auto w-full p-4 overflow-y-auto relative">
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={onCancel}
          className="text-xs text-zinc-600 font-bold bg-white border border-zinc-200/80 px-3.5 py-2 rounded-2xl flex items-center gap-1.5 shadow-xs active:scale-95 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>重新选图</span>
        </button>

        <button
          onClick={() => setShowModal(true)}
          className="text-xs text-blue-600 font-bold bg-blue-50 border border-blue-100 px-3 py-2 rounded-2xl flex items-center gap-1 active:scale-95 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>打开修改弹窗</span>
        </button>
      </div>

      {/* Image Preview Container (iOS-Style Frame) */}
      <div className="relative flex flex-col items-center bg-zinc-50 border border-zinc-150 rounded-[2rem] p-3.5 my-2 shadow-xs">
        {/* Instruction Info Banner */}
        <div className="w-full flex items-center gap-2 text-[11px] text-zinc-500 font-bold bg-white border border-zinc-100 rounded-2xl px-3 py-2 mb-3 shadow-3xs">
          <HelpCircle className="w-4 h-4 text-blue-500 shrink-0" />
          <span>免涂抹技术：仅需在弹窗中指定要修改的内容</span>
        </div>

        {/* Responsive Canvas Preview */}
        <div 
          style={{ aspectRatio: dimensions.aspectRatio || 3 / 4 }}
          className="relative overflow-hidden rounded-2xl bg-zinc-100 border border-zinc-200/60 shadow-inner flex items-center justify-center w-full max-h-[320px]"
        >
          <img
            src={imageSrc}
            alt="Original editing preview"
            className="w-full h-full object-contain select-none pointer-events-none"
            referrerPolicy="no-referrer"
          />
          {/* Subtle Corner Accents to simulate premium camera framing */}
          <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-white/60 rounded-tl-sm pointer-events-none" />
          <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-white/60 rounded-tr-sm pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-white/60 rounded-bl-sm pointer-events-none" />
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-white/60 rounded-br-sm pointer-events-none" />
        </div>
      </div>

      {/* Main Screen Editing Interface */}
      <div className="bg-white border border-zinc-200/80 rounded-[2rem] p-4 shadow-sm space-y-4">
        {/* Mode Selector */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              setSelectedMode('remove');
              setTargetItem('黑色杯子和吸管');
            }}
            className={`p-3 rounded-2xl border-2 text-left flex items-center gap-2.5 transition-all ${
              selectedMode === 'remove'
                ? 'bg-blue-50/70 border-blue-500 text-blue-900 shadow-xs font-bold'
                : 'bg-white border-zinc-200/80 text-zinc-500 hover:border-zinc-300'
            }`}
          >
            <Eraser className={`w-4.5 h-4.5 ${selectedMode === 'remove' ? 'text-blue-600' : 'text-zinc-400'}`} />
            <div>
              <div className="text-xs font-extrabold">消除/消失物品</div>
              <div className="text-[10px] text-zinc-400 mt-0.5">智能融合背景杂物</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedMode('text');
              setTargetItem('CHAGEE QINGHAI • 青花瓷杯');
            }}
            className={`p-3 rounded-2xl border-2 text-left flex items-center gap-2.5 transition-all ${
              selectedMode === 'text'
                ? 'bg-pink-50/70 border-pink-500 text-pink-900 shadow-xs font-bold'
                : 'bg-white border-zinc-200/80 text-zinc-500 hover:border-zinc-300'
            }`}
          >
            <Type className={`w-4.5 h-4.5 ${selectedMode === 'text' ? 'text-pink-600' : 'text-zinc-400'}`} />
            <div>
              <div className="text-xs font-extrabold">修改 / 替换文字</div>
              <div className="text-[10px] text-zinc-400 mt-0.5">无损更替图片文案</div>
            </div>
          </button>
        </div>

        {/* Input area */}
        <div className="space-y-1.5">
          <label className="text-xs font-extrabold text-zinc-800 flex items-center justify-between">
            <span>输入您想{selectedMode === 'remove' ? '消除' : '替换'}的特定物品或人物：</span>
            <span className="text-[10px] text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full font-bold">免除繁杂提示词</span>
          </label>
          <input
            type="text"
            value={targetItem}
            onChange={(e) => setTargetItem(e.target.value)}
            placeholder={selectedMode === 'remove' ? '例如：黑色杯子和吸管、路人、右下角键盘' : '例如：要把原文字修改为的新文字'}
            className="w-full bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl px-4 py-3 text-xs text-zinc-900 font-bold outline-none shadow-3xs"
          />
        </div>

        {/* Live Template Preview */}
        <div className="bg-zinc-50 border border-zinc-150 rounded-2xl p-3 text-[10.5px] leading-relaxed text-zinc-500 space-y-1">
          <div className="font-extrabold text-zinc-700 flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span>智能生成的完整提示词（已自动应用无损防拉伸模版）：</span>
          </div>
          <p className="bg-white border border-zinc-100 rounded-xl p-2 font-mono font-bold text-zinc-600">
            "{getConstructedPrompt(targetItem, selectedMode)}"
          </p>
        </div>

        {/* Generate Button */}
        <button
          onClick={() => handleSubmit()}
          disabled={isGenerating}
          className="w-full py-4 px-4 rounded-2xl font-extrabold text-white text-xs bg-blue-500 hover:bg-blue-600 shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98] transition-all"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>豆包 AI 正在定位并智能补全重绘...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-4.5 h-4.5" />
              <span>调用豆包生图大模型智能重绘</span>
            </>
          )}
        </button>
      </div>

      {/* iOS-Style High-Fidelity Interactive Modal Overlay */}
      {showModal && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-end justify-center p-4 transition-all duration-300">
          <div className="w-full bg-white rounded-[2.5rem] border border-zinc-100 shadow-2xl p-6 space-y-5 animate-in slide-in-from-bottom-8 duration-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-zinc-900">魔法智能消除 / 文字替换</h3>
                  <p className="text-[10px] text-zinc-400">仅需指定目标，其余边缘、光影与背景 100% 保持无损</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/40 flex items-center justify-center text-zinc-400 hover:text-zinc-600 active:scale-95 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mode Select Tabs */}
            <div className="grid grid-cols-2 gap-2 bg-zinc-50 p-1 rounded-2xl border border-zinc-100">
              <button
                type="button"
                onClick={() => {
                  setSelectedMode('remove');
                  setTargetItem('黑色杯子和吸管');
                }}
                className={`py-2 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  selectedMode === 'remove'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-700'
                }`}
              >
                <Eraser className="w-3.5 h-3.5" />
                <span>智能消除物品</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedMode('text');
                  setTargetItem('CHAGEE QINGHAI • 青花瓷杯');
                }}
                className={`py-2 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  selectedMode === 'text'
                    ? 'bg-white text-pink-600 shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-700'
                }`}
              >
                <Type className="w-3.5 h-3.5" />
                <span>智能替换文字</span>
              </button>
            </div>

            {/* Target input area */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-zinc-700 block">
                您想从画面中{selectedMode === 'remove' ? '移除 / 消除' : '替换'}的物品或人物名字：
              </label>
              <div className="relative">
                <input
                  type="text"
                  autoFocus
                  value={targetItem}
                  onChange={(e) => setTargetItem(e.target.value)}
                  placeholder={selectedMode === 'remove' ? '例如：黑色杯子和吸管、路人、背景电线' : '例如：要把文字修改为的内容'}
                  className="w-full bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl pl-4 pr-10 py-3.5 text-xs text-zinc-900 font-black outline-none transition-all shadow-inner"
                />
                {targetItem && (
                  <button
                    type="button"
                    onClick={() => setTargetItem('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Quick Presets Select */}
            <div>
              <span className="text-[10px] font-extrabold text-zinc-400 block mb-1.5 tracking-wider uppercase">推荐极速点击：</span>
              <div className="flex flex-wrap gap-1.5 max-h-[85px] overflow-y-auto">
                {activePresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setTargetItem(preset)}
                    className="text-[10.5px] px-2.5 py-1.5 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/60 text-zinc-700 font-bold active:scale-95 transition-all shadow-3xs"
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Template preview inside Popup Modal */}
            <div className="bg-zinc-50 border border-zinc-150 rounded-2xl p-3 text-[10px] leading-relaxed text-zinc-400 space-y-1">
              <div className="font-extrabold text-zinc-600">📝 已自动生成的精准智能提示词：</div>
              <p className="bg-white border border-zinc-100 rounded-xl p-2 font-mono font-bold text-zinc-500 leading-normal">
                "{getConstructedPrompt(targetItem, selectedMode)}"
              </p>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-1 gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleSubmit()}
                className="w-full py-4 px-4 rounded-2xl font-extrabold text-white text-xs bg-blue-500 hover:bg-blue-600 shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
              >
                <Wand2 className="w-4 h-4" />
                <span>立即开始 魔法无损重绘</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
