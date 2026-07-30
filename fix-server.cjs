const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const uguuFunc = `const uploadToUguu = async (base64Str: string, filename: string): Promise<string> => {
  const base64Data = base64Str.replace(/^data:image\\/\\w+;base64,/, "");
  const buffer = Buffer.from(base64Data, 'base64');
  const blob = new Blob([buffer]);
  const fd = new FormData();
  fd.append('files[]', blob, filename);

  const response = await fetch('https://uguu.se/upload.php', {
    method: 'POST',
    body: fd,
  });
  if (!response.ok) {
    throw new Error(\`Failed to upload \${filename} to uguu.se: \${response.statusText}\`);
  }
  const data = await response.json();
  if (data.success && data.files && data.files.length > 0) {
    return data.files[0].url;
  }
  throw new Error(\`Failed to upload \${filename} to uguu.se: Invalid response format\`);
};

`;

content = content.replace('// Initialize server-side Gemini client', uguuFunc + '// Initialize server-side Gemini client');

const regex = /const base64Data = originalImage.*?body: JSON.stringify\(payload\)/s;
const newCode = `const imageUrl = await uploadToUguu(originalImage, 'image.jpg');
        
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
          if (ratio >= 1.2) {
            payload.size = '1024x768';
          } else if (ratio <= 0.83) {
            payload.size = '768x1024';
          }
        }

        if (maskImage) {
          payload.mask_image = await uploadToUguu(maskImage, 'mask.jpg');
        }

        const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': \`Bearer \${apiKey}\`
          },
          body: JSON.stringify(payload)`;

content = content.replace(regex, newCode);

fs.writeFileSync('server.ts', content);
