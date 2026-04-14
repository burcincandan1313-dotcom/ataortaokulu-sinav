/**
 * api.js
 * Bu dosya projenin ayrılmaz bir parçasıdır ve modüler özellik sağlar.
 */
// src/api.js
// Uygulamanın API istekleri katmanı — BEAST MODE v6 🚀
// Gemini 2.5 Flash (Paid Tier) + Multi-Provider Fallback Zinciri

/**
 * api.js
 * Bu dosya projenin ayrilmaz bir parcasidir.
 */
const delay = (ms) => new Promise(r => setTimeout(r, ms));

// CF Worker endpoint
const CF_WORKER_URL = 'https://mega-asistan-proxy.mega-asistan-burcan.workers.dev/api/ai';

// Client-side spam engelleme kuralı
let _lastRequestTime = 0;

/**
 * Kullanıcının mesajını yapay zekaya gönderir
 * Fallback zinciri:
 *  1. CF Worker (Gemini 2.5 Flash — Paid Tier) — 3 deneme
 *  2. Pollinations GET (retry)
 *  3. Pollinations POST (OpenAI uyumlu)
 *  4. DuckDuckGo Chat API
 *  5. Airforce API
 *  6. AllOrigins CORS Proxy → Pollinations
 */
export async function askAI(message, systemPrompt = '', maxTokens = 350) {
  // Throttle kaldırıldı: Çünkü V11 Engine arka planda "Niyet Analizi" ve "Cevap Üretimi" olarak 
  // ardışık iki AI çağrısı yapıyor. Arayüzde zaten bekleme kilidi olduğu için kullanıcı spamlara karşı korunuyor.

  const sysDefault = 'Sen Ata İlk ve Ortaokulu öğrencileri için geliştirilmiş, dost canlısı bir eğitim asistanısın. Kısa ve öz, eğitici, yaş gruplarına uygun cevaplar verirsin. Küfür/hakaret vb şeylere olumsuz tepki verir ve reddedersin. Asla kodu bozacak Markdown tagleri kullanma. HTML Çıktısı verirken <br> kullan.';

  const sys = systemPrompt || sysDefault;

  // Yanıt temizleyici
  const clean = (t) => {
    if (!t || typeof t !== 'string') return null;
    if (t.trim() === '⚠️') {
      return "🚫 Bu ifade yapay zeka içerik filtreleri tarafından okul için uygunsuz bulunarak engellendi. Lütfen eğitici sorular sorun.";
    }
    let c = t.replace(/⚠️\s*\*?\*?IMPORTANT NOTICE\*?\*?[\s\S]*/gi, '').trim();
    c = c.replace(/\n*Need proxies cheaper[\s\S]*/gi, '').trim();
    c = c.replace(/\n*\[.*?Pollinations.*?\][\s\S]*/gi, '').trim();
    if (c === '' || c.length < 2) return null;
    if (c.toLowerCase().includes('rate limit')) return null;
    if (c.includes('is being deprecated')) return null;
    return c;
  };

  // ════════════════════════════════════════════════════
  // 1. ANA SİSTEM: Cloudflare Worker Proxy (Gemini 2.5 Flash — Paid Tier)
  //    Worker kendi içinde 3 farklı Gemini 2.5 modelini sırayla dener
  //    Client tarafında 3 deneme yapılır (paid tier = daha güvenilir)
  // ════════════════════════════════════════════════════
  for (let cfAttempt = 0; cfAttempt < 3; cfAttempt++) {
    try {
      if (cfAttempt > 0) await delay(1500);
      const res = await fetch(CF_WORKER_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          input: message.substring(0, 800),
          systemPrompt: sys,
          maxTokens: maxTokens   // Chat: 350 (hızlı), Quiz: 800 (JSON için yeterli)
        }),
        signal: AbortSignal.timeout(15000)
      }).catch((e) => { console.warn('[API] CF fetch error:', e.message); return null; });

      if (res && res.ok) {
        const data = await res.json();
        const txt = clean(data?.text);
        if (txt) {
          console.log(`[API] ✅ CF Worker Gemini 2.5 (model: ${data?.model}, tokens: ${data?.tokens?.total || '?'}, attempt: ${cfAttempt + 1})`);
          return txt;
        }
      } else if (res) {
        const status = res.status;
        console.warn(`[API] CF Worker status: ${status} (attempt ${cfAttempt + 1})`);
        if (status === 503) break;
      }
    } catch (e) { console.warn('[API] CF Worker exception:', e.message); }
  }

  console.warn("[API] Ana CF Proxy başarısız. Yedek sistemler devreye giriyor...");

  // ════════════════════════════════════════════════════
  // 2. YEDEK #1: Pollinations GET (retry destekli)
  //    Basit GET → Okul ağlarında en güvenilir yöntem
  // ════════════════════════════════════════════════════
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      if (attempt > 0) await delay(2500);
      const getUrl = 'https://text.pollinations.ai/' + encodeURIComponent(message.substring(0, 800));
      console.log('[API] Pollinations GET attempt', attempt + 1);
      const res = await fetch(getUrl, { signal: AbortSignal.timeout(15000) })
        .catch((e) => { console.warn('[API] Polli GET fetch error:', e.message); return null; });
      if (res && res.ok) {
        const t = await res.text();
        console.log('[API] Polli GET raw length:', t.length);
        const txt = clean(t);
        if (txt) { console.log('[API] ✅ Pollinations GET (attempt ' + (attempt + 1) + ')'); return txt; }
      }
    } catch (e) { console.warn('[API] Polli GET exception:', e.message); }
  }

  // ════════════════════════════════════════════════════
  // 3. YEDEK #2: Pollinations POST (OpenAI uyumlu format)
  // ════════════════════════════════════════════════════
  await delay(1000);
  try {
    const res = await fetch('https://text.pollinations.ai/openai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: sys },
          { role: 'user', content: message }
        ],
        model: 'openai'
      }),
      signal: AbortSignal.timeout(15000)
    }).catch(() => null);
    if (res && res.ok) {
      try {
        const d = await res.json();
        const raw = d?.choices?.[0]?.message?.content;
        const txt = clean(raw);
        if (txt) { console.log('[API] ✅ Pollinations POST'); return txt; }
      } catch {
        const t = await res.text();
        const txt = clean(t);
        if (txt) { console.log('[API] ✅ Pollinations POST (text)'); return txt; }
      }
    }
  } catch (e) { /* Devam et */ }

  // ════════════════════════════════════════════════════
  // 4. YEDEK #3: DuckDuckGo Chat API (ücretsiz, limitsiz)
  // ════════════════════════════════════════════════════
  await delay(1000);
  try {
    // DuckDuckGo chat status token al
    const statusRes = await fetch('https://duckduckgo.com/duckchat/v1/status', {
      headers: { 'x-vqd-accept': '1' },
      signal: AbortSignal.timeout(5000)
    }).catch(() => null);

    if (statusRes) {
      const vqd = statusRes.headers.get('x-vqd-4');
      if (vqd) {
        const chatRes = await fetch('https://duckduckgo.com/duckchat/v1/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-vqd-4': vqd
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'user', content: sys + '\n\n' + message }
            ]
          }),
          signal: AbortSignal.timeout(12000)
        }).catch(() => null);

        if (chatRes && chatRes.ok) {
          const text = await chatRes.text();
          // SSE formatını parse et
          const lines = text.split('\n').filter(l => l.startsWith('data: '));
          let fullText = '';
          for (const line of lines) {
            const jsonStr = line.replace('data: ', '');
            if (jsonStr === '[DONE]') break;
            try {
              const parsed = JSON.parse(jsonStr);
              if (parsed.message) fullText += parsed.message;
            } catch { /* skip */ }
          }
          const txt = clean(fullText);
          if (txt) { console.log('[API] ✅ DuckDuckGo Chat'); return txt; }
        }
      }
    }
  } catch (e) { console.warn('[API] DDG Chat exception:', e.message); }

  // ════════════════════════════════════════════════════
  // 5. YEDEK #4: Airforce API
  // ════════════════════════════════════════════════════
  await delay(1000);
  try {
    const res = await fetch('https://api.airforce/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: sys },
          { role: 'user', content: message }
        ],
        model: 'gpt-4o-mini'
      }),
      signal: AbortSignal.timeout(10000)
    }).catch(() => null);
    if (res && res.ok) {
      const data = await res.json();
      const txt = clean(data?.choices?.[0]?.message?.content);
      if (txt) { console.log('[API] ✅ Airforce'); return txt; }
    }
  } catch (e) { /* Devam et */ }

  // ════════════════════════════════════════════════════
  // 6. YEDEK #5: AllOrigins CORS Proxy → Pollinations
  // ════════════════════════════════════════════════════
  try {
    const innerUrl = 'https://text.pollinations.ai/' + encodeURIComponent(message.substring(0, 800));
    const res = await fetch('https://api.allorigins.win/raw?url=' + encodeURIComponent(innerUrl), {
      signal: AbortSignal.timeout(12000)
    }).catch(() => null);
    if (res && res.ok) {
      const t = await res.text();
      const txt = clean(t);
      if (txt) { console.log('[API] ✅ AllOrigins Proxy'); return txt; }
    }
  } catch (e) { /* Devam et */ }

  // ════════════════════════════════════════════════════
  // 7. TÜM SİSTEMLER BAŞARISIZ
  // ════════════════════════════════════════════════════
  console.error("[API] ❌ Tüm fallback'ler başarısız oldu.");
  return "Yapay zeka sunucuları şu an yanıt veremiyor, lütfen birazdan tekrar deneyin. 🔄";
}

export async function generateImage(prompt) {
  try {
    const res = await fetch('https://mega-asistan-proxy.mega-asistan-burcan.workers.dev/api/image', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt, aspectRatio: '1:1' }),
      signal: AbortSignal.timeout(20000)
    });
    if (res.ok) {
      const data = await res.json();
      if (data.image) return data.image; 
    }
  } catch (e) {
    console.warn('[API] Image generation failed', e);
  }
  return null;
}
