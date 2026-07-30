import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

const uploadToUguu = async (base64Str: string, filename: string): Promise<string> => {
  const base64Data = base64Str.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Data, 'base64');
  const blob = new Blob([buffer]);
  const fd = new FormData();
  fd.append('files[]', blob, filename);

  const response = await fetch('https://uguu.se/upload.php', {
    method: 'POST',
    body: fd,
  });
  if (!response.ok) {
    throw new Error(`Failed to upload ${filename} to uguu.se: ${response.statusText}`);
  }
  const data = await response.json();
  if (data.success && data.files && data.files.length > 0) {
    return data.files[0].url;
  }
  throw new Error(`Failed to upload ${filename} to uguu.se: Invalid response format`);
};

// Initialize server-side Gemini client using modern @google/genai SDK
const aiGemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Increase payload size limit for high-res base64 image uploading
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Check Doubao API Configuration status
app.get('/api/doubao-status', (req, res) => {
  const apiKey = process.env.DOUBAO_ARK_API_KEY;
  const endpointId = process.env.DOUBAO_MODEL_ENDPOINT;
  const isConfigured = Boolean(
    apiKey && 
    apiKey.length > 15 && 
    !apiKey.includes('your_doubao') && 
    !apiKey.includes('MY_DOUBAO_KEY')
  );

  res.json({
    configured: isConfigured,
    modelEndpoint: endpointId || 'ep-doubao-seed-edit',
    provider: '火山引擎 (Volcengine Doubao)'
  });
});

// New endpoint: Use Gemini visual grounding to locate target object/text and output bounding box coords
app.post('/api/detect-object', async (req, res) => {
  try {
    const { image, prompt } = req.body;
    if (!image || !prompt) {
      return res.status(400).json({ success: false, error: '缺少必需的图像或指令参数' });
    }

    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
      console.log('[Gemini Grounding] GEMINI_API_KEY is not configured. Skipping.');
      return res.json({ success: false, error: 'GEMINI_API_KEY 未配置，无法进行智能检测' });
    }

    // Extract raw base64 data and mime type
    const matches = image.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
    if (!matches || matches.length < 3) {
      return res.status(400).json({ success: false, error: '无效的图像格式' });
    }
    const mimeType = matches[1];
    const base64Data = matches[2];

    const modelName = 'gemini-3.6-flash';
    console.log(`[Gemini Grounding] Detecting target bounding box for prompt: "${prompt}"`);

    const systemInstruction = 
      "You are an expert image grounding and visual layout model. Your task is to analyze the input image and the user's localized editing, removal, or text-replacement command. " +
      "Identify the exact bounding box coordinates of the target object(s), person, word, watermark, or region mentioned in the command that needs to be modified, deleted, or replaced. " +
      "You must return a JSON object with keys: ymin, xmin, ymax, xmax. " +
      "These coordinate values must be integers between 0 and 1000 representing normalized coordinates (0 is top/left, 1000 is bottom/right) of the target region in the image. " +
      "Be as precise and tight as possible, ensuring the entire target object is covered but minimizing extra background.";

    const contentResponse = await aiGemini.models.generateContent({
      model: modelName,
      contents: [
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Data
          }
        },
        {
          text: `Please identify the region for the following local editing instruction: "${prompt}". Return only a JSON object with ymin, xmin, ymax, xmax.`
        }
      ],
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ymin: { type: Type.INTEGER, description: "Normalized top coordinate of the target region (0-1000)" },
            xmin: { type: Type.INTEGER, description: "Normalized left coordinate of the target region (0-1000)" },
            ymax: { type: Type.INTEGER, description: "Normalized bottom coordinate of the target region (0-1000)" },
            xmax: { type: Type.INTEGER, description: "Normalized right coordinate of the target region (0-1000)" }
          },
          required: ["ymin", "xmin", "ymax", "xmax"]
        }
      }
    });

    const textResult = contentResponse.text;
    console.log(`[Gemini Grounding] Bounding box output:`, textResult);

    if (textResult) {
      const box = JSON.parse(textResult.trim());
      if (
        typeof box.ymin === 'number' && typeof box.xmin === 'number' &&
        typeof box.ymax === 'number' && typeof box.xmax === 'number'
      ) {
        return res.json({
          success: true,
          box: {
            ymin: Math.max(0, Math.min(1000, box.ymin)),
            xmin: Math.max(0, Math.min(1000, box.xmin)),
            ymax: Math.max(0, Math.min(1000, box.ymax)),
            xmax: Math.max(0, Math.min(1000, box.xmax))
          }
        });
      }
    }

    return res.json({ success: false, error: '未能成功识别目标框' });

  } catch (error: any) {
    console.error('Error in detect-object API:', error);
    return res.json({ success: false, error: error?.message || 'Gemini 识别出错' });
  }
});

const cleanBase64 = (base64Str: string): string => {
  if (!base64Str) return '';
  if (base64Str.startsWith('data:image')) {
    const commaIndex = base64Str.indexOf(',');
    if (commaIndex !== -1) {
      return base64Str.substring(commaIndex + 1);
    }
  }
  return base64Str;
};

// Doubao Image Inpainting / Editing API Proxy
app.post('/api/edit-image', async (req, res) => {
  try {
    const { originalImage, maskImage, prompt, mode, width, height, doubaoConfig } = req.body;

    if (!originalImage || !prompt) {
      return res.status(400).json({ success: false, error: '缺少必需的图像或修改指令参数' });
    }

    const useCustomKey = Boolean(doubaoConfig?.useCustomKey && doubaoConfig.apiKey);
    const apiKey = useCustomKey 
      ? doubaoConfig.apiKey 
      : process.env.DOUBAO_ARK_API_KEY;

    const endpointId = doubaoConfig?.useCustomKey && doubaoConfig.endpointId
      ? doubaoConfig.endpointId
      : (process.env.DOUBAO_MODEL_ENDPOINT || 'doubao-seedream-5-0-260128');

    console.log(`[Edit Image Request] Mode: ${mode}, Prompt: "${prompt}", Target Dimension: ${width}x${height}`);

    let doubaoErrorReason = '';

    // If an API Key is available, invoke Volcengine Ark API
    if (apiKey && apiKey.length > 8 && !apiKey.includes('your_doubao') && !apiKey.includes('MY_DOUBAO_KEY')) {
      try {
        console.log(`Calling Volcengine Doubao Ark API Endpoint (${endpointId})...`);
        
        const enhancedPrompt = `【绝对保密原图指令】：必须严格100%保持原图的构图、主体结构、空间透视、光影分布和原始色彩，不得有任何偏差。仅根据以下用户指令进行精准微调或消除修改：${prompt}`;

        const imageUrl = await uploadToUguu(originalImage, 'image.jpg');
        
        const payload: any = {
          model: endpointId,
          prompt: enhancedPrompt,
          image: imageUrl,
          logo_info: { add_logo: false },
          watermark: false,
          response_format: 'b64_json'
        };

        if (width && height) {
          const ratio = width / height;
          if (ratio >= 1.7) {
            payload.size = '2560x1440'; // 16:9
          } else if (ratio >= 1.2) {
            payload.size = '2304x1728'; // 4:3
          } else if (ratio >= 0.8) {
            payload.size = '2048x2048'; // 1:1
          } else if (ratio >= 0.58) {
            payload.size = '1728x2304'; // 3:4
          } else {
            payload.size = '1440x2560'; // 9:16
          }
        } else {
          payload.size = '2048x2048';
        }

        if (maskImage) {
          payload.mask_image = await uploadToUguu(maskImage, 'mask.jpg');
        }

        const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify(payload)
        });



        if (response.ok) {
          const data = await response.json();
          const resultB64 = data.data?.[0]?.b64_json 
            ? `data:image/png;base64,${data.data[0].b64_json}` 
            : data.data?.[0]?.url;

          if (resultB64) {
            return res.json({
              success: true,
              resultImage: resultB64,
              width,
              height,
              modelUsed: `豆包生图大模型 (${endpointId})`,
              isSimulated: false
            });
          }
        } else {
          const errData = await response.json().catch(() => null);
          const errText = errData?.error?.message || `HTTP ${response.status} 错误`;
          console.warn(`Doubao API returned status ${response.status}: ${errText}`);
          
          if (response.status === 401) {
            doubaoErrorReason = '豆包 API Key 格式不正确或未授权 (401 Unauthorized)';
          } else {
            doubaoErrorReason = `豆包 API 调用失败: ${errText}`;
          }
        }
      } catch (doubaoErr: any) {
        console.error('Error invoking Doubao Ark API:', doubaoErr?.message || doubaoErr);
        doubaoErrorReason = `网络连接异常: ${doubaoErr?.message || '无法连接到火山引擎'}`;
      }
    }

    // 2. Clear failure responses for Custom Uploads to prevent confusing silent returns of the original image
    if (doubaoErrorReason) {
      return res.json({
        success: false,
        error: `调用豆包大模型失败：${doubaoErrorReason}。请检查您的「设置」或后台环境变量中的 API Key 和接入点 ID (Endpoint ID) 是否匹配。`
      });
    }

    // If no API key was available and it's a custom image, prompt user directly
    return res.json({
      success: false,
      error: '火山引擎豆包 API Key 未配置，或密钥格式不正确！请点击页面右上角的「设置」按钮，填写您的火山引擎 API Key 和接入点 ID，即可启用真实的 AI 局部重绘与文字替换功能。'
    });

  } catch (error: any) {
    console.error('API Server Error:', error);
    return res.status(500).json({ success: false, error: error?.message || '服务器处理出错' });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 豆包AI魔法修图 Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
