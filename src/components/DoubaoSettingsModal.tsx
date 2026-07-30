import React, { useState } from 'react';
import { X, Key, Server, CheckCircle2, AlertCircle, Sparkles, RefreshCw } from 'lucide-react';
import { DoubaoConfig } from '../types';

interface DoubaoSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: DoubaoConfig;
  onSaveConfig: (newConfig: DoubaoConfig) => void;
  serverConfigured: boolean;
}

export const DoubaoSettingsModal: React.FC<DoubaoSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  serverConfigured,
}) => {
  const [useCustomKey, setUseCustomKey] = useState<boolean>(config.useCustomKey);
  const [apiKey, setApiKey] = useState<string>(config.apiKey);
  const [endpointId, setEndpointId] = useState<string>(config.endpointId || 'doubao-seedream-5-0-260128');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig({
      apiKey: apiKey.trim(),
      endpointId: endpointId.trim(),
      useCustomKey,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-white border border-zinc-200/80 rounded-[2.5rem] p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 border-b border-zinc-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-blue-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-zinc-900 tracking-tight">豆包生图模型 API 设置</h3>
              <p className="text-[11px] text-zinc-400">火山引擎 (Volcengine) ARK 生图密钥配置</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl text-zinc-400 hover:text-zinc-900 bg-zinc-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Server status indicator */}
        <div className={`p-3.5 rounded-2xl border mb-4 text-xs flex items-center justify-between font-medium ${
          serverConfigured
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
            : 'bg-amber-50 border-amber-200 text-amber-900'
        }`}>
          <div className="flex items-center gap-2.5">
            {serverConfigured ? <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />}
            <div>
              <div className="font-bold">{serverConfigured ? '服务端已注入豆包 API 密钥' : '当前使用本地 / 演示模式'}</div>
              <div className="text-[10px] opacity-80 mt-0.5">
                {serverConfigured ? '可以直接使用在线火山引擎豆包大模型接口' : '也可在下方填入您自己的豆包 ARK_API_KEY 接入'}
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Toggle Custom Key */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/80">
            <div>
              <div className="text-xs font-bold text-zinc-900">自定义前端 API Key</div>
              <div className="text-[10px] text-zinc-400">优先使用您在手机端输入的豆包密钥</div>
            </div>
            <input
              type="checkbox"
              checked={useCustomKey}
              onChange={(e) => setUseCustomKey(e.target.checked)}
              className="w-4 h-4 rounded bg-white border-zinc-300 text-blue-600 focus:ring-blue-500"
            />
          </div>

          {useCustomKey && (
            <div className="space-y-3 p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/80 animate-in fade-in">
              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-blue-600" />
                  <span>Doubao ARK API Key：</span>
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="例如：6f8x-xxxx-xxxx-xxxx"
                  className="w-full bg-white border border-zinc-200 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-zinc-900 placeholder-zinc-400 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1 flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-purple-600" />
                  <span>Model Endpoint ID（接入点 ID）：</span>
                </label>
                <input
                  type="text"
                  value={endpointId}
                  onChange={(e) => setEndpointId(e.target.value)}
                  placeholder="例如：doubao-seedream-5-0-260128 或您的接入点 ID"
                  className="w-full bg-white border border-zinc-200 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-zinc-900 placeholder-zinc-400 outline-none"
                />
              </div>
            </div>
          )}

          {/* Model info banner */}
          <div className="text-[11px] text-zinc-500 bg-zinc-50 p-3.5 rounded-2xl border border-zinc-200/80 leading-relaxed font-medium">
            💡 本平台专为<strong className="text-blue-600 font-bold">豆包生图模型（Volcengine Doubao Image API）</strong>设计，支持修图、消除和替换文字。无缝兼容真实照片尺寸与高清分辨率输出，无水印且保持高画质。
          </div>

          {/* Action buttons */}
          <div className="pt-2 border-t border-zinc-100">
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md shadow-blue-500/20"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>配置已保存！</span>
                </>
              ) : (
                <span>保存豆包 API 配置</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
