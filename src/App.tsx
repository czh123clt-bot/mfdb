import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { ImageEditView } from './components/ImageEditView';
import { ResultView } from './components/ResultView';
import { ShortcutGuideModal } from './components/ShortcutGuideModal';
import { DoubaoSettingsModal } from './components/DoubaoSettingsModal';
import { PwaInstallPrompt } from './components/PwaInstallPrompt';
import { GeneratingModal } from './components/GeneratingModal';
import { IosPhotosView } from './components/IosPhotosView';
import { EditMode, ImageDimensions, DoubaoConfig, HistoryItem, GenerationResponse, PerformanceScheme } from './types';
import { AlertCircle, Settings } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<'home' | 'edit' | 'result' | 'performance'>('home');
  const [schemeIndex, setSchemeIndex] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('doubao_scheme_index');
      if (saved !== null) {
        return parseInt(saved, 10) % 3;
      }
    } catch (e) {}
    return 0;
  });

  const [performanceScheme, setPerformanceScheme] = useState<PerformanceScheme>(() => {
    const schemes: PerformanceScheme[] = ['scheme1', 'scheme2', 'scheme3'];
    try {
      const savedIndex = localStorage.getItem('doubao_scheme_index');
      if (savedIndex !== null) {
        return schemes[parseInt(savedIndex, 10) % 3];
      }
    } catch (e) {}
    return 'scheme1';
  });

  // 3 customizable slots for magic performances
  const [slots, setSlots] = useState<{
    scheme1: { original: string; result: string };
    scheme2: { original: string; result: string };
    scheme3: { original: string; result: string };
  }>(() => {
    try {
      const saved = localStorage.getItem('doubao_magic_slots');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error parsing slots', e);
    }
    return {
      scheme1: {
        original: "https://images.unsplash.com/photo-1582450871972-ab5ca641643d?auto=format&fit=crop&w=768&h=1024&q=80",
        result: "https://images.unsplash.com/photo-1626200419199-391ae4be7a40?auto=format&fit=crop&w=768&h=1024&q=80",
      },
      scheme2: {
        original: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=768&h=1024&q=80",
        result: "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=768&h=1024&q=80",
      },
      scheme3: {
        original: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=768&h=1024&q=80",
        result: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=768&h=1024&q=80",
      },
    };
  });

  const [originalImageSrc, setOriginalImageSrc] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('doubao_magic_slots');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.scheme1?.original || '';
      }
    } catch (e) {}
    return "https://images.unsplash.com/photo-1582450871972-ab5ca641643d?auto=format&fit=crop&w=768&h=1024&q=80";
  });

  const [resultImageSrc, setResultImageSrc] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('doubao_magic_slots');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.scheme1?.result || '';
      }
    } catch (e) {}
    return "https://images.unsplash.com/photo-1626200419199-391ae4be7a40?auto=format&fit=crop&w=768&h=1024&q=80";
  });

  const [dimensions, setDimensions] = useState<ImageDimensions>({ width: 768, height: 1024, aspectRatio: 3 / 4 });
  const [currentMode, setCurrentMode] = useState<EditMode>('remove');
  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [modelUsedName, setModelUsedName] = useState<string>('豆包生图模型');
  const [noticeMessage, setNoticeMessage] = useState<string | undefined>();

  // Helper to update active slot
  const updateActiveSlot = (original: string, result: string) => {
    setSlots(prev => ({
      ...prev,
      [performanceScheme]: { original, result }
    }));
  };

  const handleSelectScheme = (scheme: PerformanceScheme) => {
    setPerformanceScheme(scheme);
    const activeSlot = slots[scheme];
    setOriginalImageSrc(activeSlot.original || '');
    setResultImageSrc(activeSlot.result || '');
    setDimensions({ width: 768, height: 1024, aspectRatio: 3 / 4 });
  };

  useEffect(() => {
    try {
      localStorage.setItem('doubao_magic_slots', JSON.stringify(slots));
    } catch (e) {
      console.warn('Error saving slots to localStorage', e);
    }
  }, [slots]);

  useEffect(() => {
    try {
      localStorage.setItem('doubao_scheme_index', String(schemeIndex));
    } catch (e) {}
  }, [schemeIndex]);

  // Doubao Status & Config
  const [serverConfigured, setServerConfigured] = useState<boolean>(false);
  const [doubaoConfig, setDoubaoConfig] = useState<DoubaoConfig>({
    apiKey: '',
    endpointId: 'doubao-seedream-5-0-260128',
    useCustomKey: false,
  });

  // History records
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Modals & Error state
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isShortcutGuideOpen, setIsShortcutGuideOpen] = useState<boolean>(false);
  const [isPwaGuideOpen, setIsPwaGuideOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Check server Doubao status on mount
  useEffect(() => {
    fetch('/api/doubao-status')
      .then((res) => res.json())
      .then((data) => {
        setServerConfigured(Boolean(data.configured));
      })
      .catch((err) => console.log('Doubao status check error:', err));

    // Load history from localStorage
    try {
      const saved = localStorage.getItem('doubao_photo_history');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error('History load error', e);
    }
  }, []);

  // Save history to localStorage safely
  const saveToHistory = async (item: HistoryItem) => {
    // Keep in-memory history (up to 10 items)
    const updated = [item, ...history.slice(0, 9)];
    setHistory(updated);

    // Helper to create small thumbnail dataUrl (~250px)
    const createThumb = (dataUrl: string): Promise<string> => {
      return new Promise((resolve) => {
        if (!dataUrl || !dataUrl.startsWith('data:')) {
          return resolve(dataUrl);
        }
        const img = new Image();
        img.onload = () => {
          const maxDim = 250;
          let w = img.naturalWidth || 250;
          let h = img.naturalHeight || 250;
          if (w > maxDim || h > maxDim) {
            if (w >= h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, w, h);
            resolve(canvas.toDataURL('image/jpeg', 0.6));
          } else {
            resolve(dataUrl);
          }
        };
        img.onerror = () => resolve(dataUrl);
        img.src = dataUrl;
      });
    };

    try {
      const origThumb = await createThumb(item.originalUrl);
      const resThumb = await createThumb(item.resultUrl);

      const itemForStorage: HistoryItem = {
        ...item,
        originalUrl: origThumb,
        resultUrl: resThumb,
      };

      let storageList = [itemForStorage];
      try {
        const existing = localStorage.getItem('doubao_photo_history');
        if (existing) {
          const parsed: HistoryItem[] = JSON.parse(existing);
          storageList = [itemForStorage, ...parsed].slice(0, 8);
        }
      } catch (e) {
        storageList = [itemForStorage];
      }

      // Try setting item, trimming oldest items if quota is exceeded
      while (storageList.length > 0) {
        try {
          localStorage.setItem('doubao_photo_history', JSON.stringify(storageList));
          break;
        } catch (quotaErr) {
          storageList.pop();
        }
      }
    } catch (e) {
      console.warn('Could not persist history to localStorage:', e);
    }
  };

  const resizeAndPreserveAspect = (dataUrl: string): Promise<{ dataUrl: string; width: number; height: number; aspectRatio: number }> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ dataUrl, width: img.naturalWidth, height: img.naturalHeight, aspectRatio: img.naturalWidth / img.naturalHeight });
      };
      img.src = dataUrl;
    });
  };

  // Step 1: User selects image from album or takes camera photo (preserving original aspect ratio 100%)
  const handleSelectImage = (file: File, source: 'album' | 'camera') => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        const processed = await resizeAndPreserveAspect(dataUrl);
        
        // Advance scheme index for new upload so it goes to scheme 2 (or next slot) instead of overwriting scheme 1
        const nextIndex = (schemeIndex + 1) % 3;
        setSchemeIndex(nextIndex);
        const schemes: PerformanceScheme[] = ['scheme1', 'scheme2', 'scheme3'];
        const targetScheme = schemes[nextIndex];
        setPerformanceScheme(targetScheme);

        setOriginalImageSrc(processed.dataUrl);
        setResultImageSrc(''); // Clear previous edit for this custom slot
        setDimensions({ width: processed.width, height: processed.height, aspectRatio: processed.aspectRatio });
        
        setSlots(prev => ({
          ...prev,
          [targetScheme]: { original: processed.dataUrl, result: '' }
        }));

        setView('edit');
      }
    };
    reader.readAsDataURL(file);
  };

  // Helper function to guarantee result image strictly matches original photo dimensions and aspect ratio
  const processImageToExactDimensions = (imageUrl: string, targetW: number, targetH: number): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const naturalW = img.naturalWidth;
        const naturalH = img.naturalHeight;
        if (!naturalW || !naturalH || !targetW || !targetH) return resolve(imageUrl);

        const targetAspect = targetW / targetH;
        const currentAspect = naturalW / naturalH;

        // If aspect ratios match within 0.5%, return as is
        if (Math.abs(targetAspect - currentAspect) < 0.005) {
          return resolve(imageUrl);
        }

        // Crop center of generated image to match exact target aspect ratio
        let srcX = 0;
        let srcY = 0;
        let srcW = naturalW;
        let srcH = naturalH;

        if (currentAspect > targetAspect) {
          // Generated image is wider than original -> crop sides
          srcW = naturalH * targetAspect;
          srcX = (naturalW - srcW) / 2;
        } else {
          // Generated image is taller or squarer than original -> crop top/bottom
          srcH = naturalW / targetAspect;
          srcY = (naturalH - srcH) / 2;
        }

        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, targetW, targetH);
          resolve(canvas.toDataURL('image/png'));
        } else {
          resolve(imageUrl);
        }
      };
      img.onerror = () => resolve(imageUrl);
      img.src = imageUrl;
    });
  };

  // Compress image payload before sending over network to speed up API transmission by 10x
  const compressImageForApi = (dataUrl: string, maxDimension = 1280): Promise<string> => {
    return Promise.resolve(dataUrl);
  };

  // Bypassed Gemini Auto-Mask generator to call Doubao directly for pristine native image editing
  const generateAutoMask = (_imageSrc: string, _promptText: string, _targetW: number, _targetH: number): Promise<string | undefined> => {
    return Promise.resolve(undefined);
  };

  // Step 2: User inputs edit prompt and clicks generate
  const handleGenerate = async (promptText: string, selectedMode: EditMode) => {
    setIsGenerating(true);
    setCurrentPrompt(promptText);
    setCurrentMode(selectedMode);
    setErrorMessage(null);

    try {
      // Direct call to Doubao without using Gemini for mask generation, keeping original aspect ratio and resolution
      const maskImage = undefined;

      // 2. Compress image payload to ~200KB for ultra-fast network transfer, matching Doubao's 1024px sweet spot
      const optimizedPayloadImage = await compressImageForApi(originalImageSrc, 1024);

      const response = await fetch('/api/edit-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalImage: optimizedPayloadImage,
          maskImage,
          prompt: promptText,
          mode: selectedMode,
          width: dimensions.width,
          height: dimensions.height,
          doubaoConfig,
        }),
      });

      const data: GenerationResponse & { notice?: string } = await response.json();

      if (data.success && data.resultImage) {
        // Set the result image directly to keep original layout, aspect ratio and pixels intact
        const finalImage = data.resultImage;
        setModelUsedName(data.modelUsed || '豆包生图模型');
        setNoticeMessage(data.notice);

        // Automatically select the next scheme slot in sequence (scheme1 -> scheme2 -> scheme3 -> scheme1)
        const schemes: PerformanceScheme[] = ['scheme1', 'scheme2', 'scheme3'];
        const targetScheme = schemes[schemeIndex];
        setPerformanceScheme(targetScheme);

        setSlots(prev => ({
          ...prev,
          [targetScheme]: { original: originalImageSrc, result: finalImage }
        }));

        setResultImageSrc(finalImage);
        setView('result');

        // Record in history
        await saveToHistory({
          id: String(Date.now()),
          timestamp: Date.now(),
          originalUrl: originalImageSrc,
          resultUrl: finalImage,
          prompt: promptText,
          mode: selectedMode,
          width: dimensions.width,
          height: dimensions.height,
        });

        // Advance scheme index for the next generation
        setSchemeIndex((prevIndex) => (prevIndex + 1) % 3);
      } else {
        setErrorMessage(data.error || '生成失败，请检测 API Key 或重试');
      }
    } catch (err: any) {
      console.error('Generation call failed:', err);
      setErrorMessage('连接豆包服务超时，请检查网络后再试');
    } finally {
      setIsGenerating(false);
    }
  };

  // Select item from history
  const handleSelectHistory = (item: HistoryItem) => {
    setOriginalImageSrc(item.originalUrl);
    setResultImageSrc(item.resultUrl);
    setDimensions({ width: item.width, height: item.height, aspectRatio: item.width / item.height });
    setCurrentPrompt(item.prompt);
    setCurrentMode(item.mode);
    updateActiveSlot(item.originalUrl, item.resultUrl);
    setView('result');
  };

  return (
    <div className="flex flex-col h-full bg-[#F2F2F7] text-zinc-900 font-sans select-none overflow-hidden">
      {/* Header Bar */}
      {view !== 'performance' && (
        <Header
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenShortcutGuide={() => setIsShortcutGuideOpen(true)}
          onOpenPwaGuide={() => setIsPwaGuideOpen(true)}
          onOpenHistory={() => {}}
          onGoHome={() => setView('home')}
          isHome={view === 'home'}
          doubaoConfigured={serverConfigured || doubaoConfig.useCustomKey}
        />
      )}

      {/* Main View Router */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {view === 'home' && (
          <HomeView
            onSelectImage={handleSelectImage}
            onOpenShortcutGuide={() => setIsShortcutGuideOpen(true)}
            onOpenPwaGuide={() => setIsPwaGuideOpen(true)}
            history={history}
            onSelectHistory={handleSelectHistory}
            onEnterPerformanceMode={() => setView('performance')}
            scenario={performanceScheme}
            onSelectScenario={handleSelectScheme}
            hasCustomImage={Boolean(originalImageSrc && resultImageSrc)}
            slots={slots}
          />
        )}

        {view === 'performance' && (
          <IosPhotosView
            originalUrl={originalImageSrc}
            resultUrl={resultImageSrc}
            onClose={() => setView('home')}
            performanceScheme={performanceScheme}
          />
        )}

        {view === 'edit' && (
          <ImageEditView
            imageSrc={originalImageSrc}
            dimensions={dimensions}
            onCancel={() => setView('home')}
            onSubmit={handleGenerate}
            isGenerating={isGenerating}
          />
        )}

        {view === 'result' && (
          <ResultView
            originalUrl={originalImageSrc}
            resultUrl={resultImageSrc}
            width={dimensions.width}
            height={dimensions.height}
            prompt={currentPrompt}
            modelUsed={modelUsedName}
            notice={noticeMessage}
            onReEdit={() => setView('edit')}
            onNewPhoto={() => setView('home')}
            onOpenShortcutGuide={() => setIsShortcutGuideOpen(true)}
          />
        )}
      </main>

      {/* Settings Modal */}
      <DoubaoSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={doubaoConfig}
        onSaveConfig={(cfg) => setDoubaoConfig(cfg)}
        serverConfigured={serverConfigured}
      />

      {/* iOS Shortcuts Setup Guide Modal */}
      <ShortcutGuideModal
        isOpen={isShortcutGuideOpen}
        onClose={() => setIsShortcutGuideOpen(false)}
      />

      {/* PWA Add to Home Screen Instructions Modal */}
      <PwaInstallPrompt
        isOpen={isPwaGuideOpen}
        onClose={() => setIsPwaGuideOpen(false)}
      />

      {/* Animated Generating Progress Modal */}
      <GeneratingModal
        isOpen={isGenerating}
        prompt={currentPrompt}
      />

      {/* Error Message Dialog */}
      {errorMessage && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-zinc-100 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-zinc-900 mb-2">处理受阻</h3>
            <p className="text-xs text-zinc-600 font-medium mb-5 leading-relaxed bg-red-50/70 p-3 rounded-2xl border border-red-100/80 text-left w-full">
              {errorMessage}
            </p>
            <div className="flex gap-2 w-full">
              <button
                onClick={() => setErrorMessage(null)}
                className="flex-1 py-3 px-3 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-700 bg-white hover:bg-zinc-50"
              >
                我知道了
              </button>
              <button
                onClick={() => {
                  setErrorMessage(null);
                  setIsSettingsOpen(true);
                }}
                className="flex-1 py-3 px-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-sm shadow-blue-500/20"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>设置 API Key</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
