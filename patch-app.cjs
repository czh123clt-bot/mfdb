const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. disable resizeAndPreserveAspect
const resizeAndPreserveAspect = `const resizeAndPreserveAspect = (dataUrl: string): Promise<{ dataUrl: string; width: number; height: number; aspectRatio: number }> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ dataUrl, width: img.naturalWidth, height: img.naturalHeight, aspectRatio: img.naturalWidth / img.naturalHeight });
      };
      img.src = dataUrl;
    });
  };`;
content = content.replace(/const resizeAndPreserveAspect = \(dataUrl: string\).*?img\.src = dataUrl;\n    \}\);\n  \};/s, resizeAndPreserveAspect);

// 2. disable compressImageForApi
const compressImageForApi = `const compressImageForApi = (dataUrl: string, maxDimension = 1280): Promise<string> => {
    return Promise.resolve(dataUrl);
  };`;
content = content.replace(/const compressImageForApi = \(dataUrl: string, maxDimension = 1280\).*?img\.src = dataUrl;\n    \}\);\n  \};/s, compressImageForApi);

fs.writeFileSync('src/App.tsx', content);
