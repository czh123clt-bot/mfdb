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

fs.writeFileSync('server.ts', content);
