/**
 * Mega Asistan — Cloudflare Worker Proxy v5.1 (Gemini 2.5 + Imagen 4 Beast Mode 🚀)
 * API key sadece bu Worker'da yaşar, istemci kodunda YOKTUR.
 *
 * Endpoints:
 *   POST /api/ai     → Gemini 2.5 Flash text generation
 *   POST /api/image  → Imagen 4 Fast image generation
 *   GET  /api/health  → Health check
 *
 * Deploy:
 *   1. npm install -g wrangler
 *   2. wrangler login
 *   3. wrangler secret put GEMINI_API_KEY
 *   4. wrangler deploy
 */

// Gemini 2.5 öncelikli model zinciri
const MODEL_CONFIGS = [
  { model: 'gemini-2.5-flash', base: 'v1beta' },
  { model: 'gemini-2.5-flash-lite', base: 'v1beta' },
  { model: 'gemini-2.0-flash-lite', base: 'v1beta' },
];

// Imagen model zinciri
const IMAGEN_MODELS = [
  'imagen-4.0-fast-generate-001',
  'imagen-4.0-generate-001',
];

// İzin verilen origin'ler
function isAllowedOrigin(origin) {
  if (!origin || origin === 'null') return true; // file:// protokolü veya doğrudan açım
  // Tüm localhost ve 127.0.0.1 portlarını kabul et
  if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) return true;
  // Bütün surge altyapısını direkt kabul et
  if (origin.includes('.surge.sh') || origin.includes('ata-asistan')) return true;
  return false;
}

function corsHeaders(origin) {
  const effectiveOrigin = (!origin || origin === 'null') ? '*' : (isAllowedOrigin(origin) ? origin : '*');
  return {
    'Access-Control-Allow-Origin': effectiveOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

function jsonResponse(data, status = 200, origin = '') {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
  });
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(request.headers.get('Origin')) });
    }

    const url = new URL(request.url);

    if (url.pathname === '/api/ai' && request.method === 'POST') {
      return handleAI(request, env);
    }

    if (url.pathname === '/api/image' && request.method === 'POST') {
      return handleImage(request, env);
    }

    if (url.pathname === '/api/health') {
      return jsonResponse({
        status: 'ok',
        version: '5.1.0',
        provider: 'Google Gemini 2.5 + Imagen 4',
        models: MODEL_CONFIGS.map(c => `${c.model}@${c.base}`),
        imageModels: IMAGEN_MODELS,
        keySet: !!env.GEMINI_API_KEY,
        tier: 'paid',
      });
    }

    return jsonResponse({ error: 'Not found' }, 404);
  },
};

// ===== GEMINI AI PROXY — Gemini 2.5 Beast Mode =====
async function handleAI(request, env) {
  const origin = request.headers.get('Origin');
  if (!isAllowedOrigin(origin)) {
    return jsonResponse({ error: 'Unauthorized. İzin verilmeyen kaynak.' }, 403, origin);
  }

  if (!env.GEMINI_API_KEY) {
    return jsonResponse({ error: 'API key not configured on server.' }, 503, request.headers.get('Origin'));
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body.' }, 400);
  }

  const { input, systemPrompt, maxTokens = 400 } = body;
  if (!input || typeof input !== 'string' || input.length > 1200) {
    return jsonResponse({ error: 'Invalid input.' }, 400);
  }

  const sysText = systemPrompt ||
    'Sen yardımcı bir eğitim asistanısın. Türkçe, kısa ve anlaşılır yanıt ver. 6. sınıf öğrencisi seviyesinde konuş.';

  const errors = [];

  for (const { model, base } of MODEL_CONFIGS) {
    try {
      const apiUrl = `https://generativelanguage.googleapis.com/${base}/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`;

      const genConfig = {
        maxOutputTokens: Math.min(maxTokens, 800),
        temperature: 0.7,
        topP: 0.9,
      };

      // thinkingBudget: 0 → thinking tokenları üretilmez, maliyet düşer
      if (model.startsWith('gemini-2.5')) {
        genConfig.thinkingConfig = { thinkingBudget: 0 };
      }

      const reqBody = {
        system_instruction: { parts: [{ text: sysText }] },
        contents: [{ role: 'user', parts: [{ text: input }] }],
        generationConfig: genConfig,
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        ],
      };

      const geminiRes = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqBody),
      });

      if (geminiRes.status === 429 || geminiRes.status >= 500) {
        const errData = await geminiRes.json().catch(() => ({}));
        errors.push(`${model}@${base}: ${geminiRes.status} - ${(errData.error?.message || 'rate limited').substring(0, 120)}`);
        continue;
      }

      if (geminiRes.status === 404) {
        errors.push(`${model}@${base}: 404`);
        continue;
      }

      const data = await geminiRes.json();

      if (!geminiRes.ok) {
        errors.push(`${model}@${base}: ${geminiRes.status} - ${(data.error?.message || 'unknown').substring(0, 120)}`);
        continue;
      }

      const parts = data.candidates?.[0]?.content?.parts || [];
      const textPart = parts.find(p => p.text && !p.thought) || parts[parts.length - 1] || {};
      const text = textPart.text || '';

      if (!text || text.trim().length < 2) {
        errors.push(`${model}@${base}: empty response`);
        continue;
      }

      const usage = data.usageMetadata || {};

      return jsonResponse({
        text,
        model: `${model}@${base}`,
        tokens: {
          input: usage.promptTokenCount || 0,
          output: usage.candidatesTokenCount || 0,
          total: usage.totalTokenCount || 0,
        },
      });

    } catch (err) {
      errors.push(`${model}@${base}: ${err.message}`);
    }
  }

  console.error('All models failed:', errors);
  return jsonResponse({ error: 'All AI models unavailable.', details: errors }, 503);
}

// ===== IMAGEN 4 IMAGE GENERATION =====
async function handleImage(request, env) {
  const origin = request.headers.get('Origin');
  if (!isAllowedOrigin(origin)) {
    return jsonResponse({ error: 'Unauthorized. İzin verilmeyen kaynak.' }, 403, origin);
  }

  if (!env.GEMINI_API_KEY) {
    return jsonResponse({ error: 'API key not configured on server.' }, 503, request.headers.get('Origin'));
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body.' }, 400);
  }

  const { prompt, aspectRatio = '1:1' } = body;
  if (!prompt || typeof prompt !== 'string' || prompt.length > 500) {
    return jsonResponse({ error: 'Invalid prompt.' }, 400);
  }

  const errors = [];

  for (const model of IMAGEN_MODELS) {
    try {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:predict?key=${env.GEMINI_API_KEY}`;

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instances: [{ prompt }],
          parameters: {
            sampleCount: 1,
            aspectRatio,
          },
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        errors.push(`${model}: ${res.status} - ${(errData.error?.message || 'failed').substring(0, 120)}`);
        continue;
      }

      const data = await res.json();
      const prediction = data.predictions?.[0];

      if (!prediction?.bytesBase64Encoded) {
        errors.push(`${model}: no image data`);
        continue;
      }

      // Return image as base64 data URL
      const mimeType = prediction.mimeType || 'image/png';
      return jsonResponse({
        image: `data:${mimeType};base64,${prediction.bytesBase64Encoded}`,
        model,
        mimeType,
      });

    } catch (err) {
      errors.push(`${model}: ${err.message}`);
    }
  }

  console.error('All image models failed:', errors);
  return jsonResponse({ error: 'Image generation failed.', details: errors }, 503);
}
