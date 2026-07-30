import React, { useState, useEffect } from 'react';
import { Sparkles, Wand2, Zap, CheckCircle2 } from 'lucide-react';

interface GeneratingModalProps {
  isOpen: boolean;
  prompt: string;
}

export const GeneratingModal: React.FC<GeneratingModalProps> = ({ isOpen, prompt }) => {
  const [elapsed, setElapsed] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setElapsed(0);
      setStepIndex(0);
      return;
    }

    const timer = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1;
        if (next >= 1 && stepIndex === 0) setStepIndex(1);
        if (next >= 3 && stepIndex === 1) setStepIndex(2);
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, stepIndex]);

  if (!isOpen) return null;

  const steps = [
    { title: '正在预处理图像', desc: '快速进行高精尺寸压缩与色彩校准' },
    { title: '呼叫豆包生图大模型', desc: '火山引擎深度学习引擎理解修改需求' },
    { title: '渲染极清原图细节', desc: '按原始画幅尺寸无缝缝合完美画面' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-zinc-100 flex flex-col items-center text-center relative overflow-hidden">
        {/* Top glowing ambient effect */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl" />

        {/* Animated Icon */}
        <div className="relative mb-4 mt-2">
          <div className="w-16 h-16 rounded-2xl bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 animate-pulse">
            <Wand2 className="w-8 h-8 animate-bounce" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center text-xs shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-zinc-900" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-extrabold text-zinc-900 mb-1 flex items-center gap-1.5">
          <span>豆包 AI 魔法修图处理中</span>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-mono font-bold">
            {elapsed}s
          </span>
        </h3>
        <p className="text-xs text-zinc-500 font-medium line-clamp-1 mb-5 px-2 bg-zinc-50 py-1.5 rounded-xl border border-zinc-200/60 w-full">
          指令：“{prompt}”
        </p>

        {/* Progress steps */}
        <div className="w-full space-y-3 mb-4 text-left">
          {steps.map((step, idx) => {
            const isDone = idx < stepIndex;
            const isCurrent = idx === stepIndex;

            return (
              <div
                key={idx}
                className={`p-3 rounded-2xl border transition-all flex items-start gap-3 ${
                  isCurrent
                    ? 'bg-blue-50/80 border-blue-200 shadow-xs'
                    : isDone
                    ? 'bg-emerald-50/50 border-emerald-100 opacity-80'
                    : 'bg-zinc-50/50 border-zinc-100 opacity-40'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : isCurrent ? (
                    <div className="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-zinc-300" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-xs font-bold ${isCurrent ? 'text-blue-950' : isDone ? 'text-emerald-950' : 'text-zinc-500'}`}>
                    {step.title}
                  </div>
                  <div className="text-[10px] text-zinc-400 font-medium truncate mt-0.5">
                    {step.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Speed notice */}
        <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-medium">
          <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>已启用火山引擎 Ark 极速加速网络</span>
        </div>
      </div>
    </div>
  );
};
