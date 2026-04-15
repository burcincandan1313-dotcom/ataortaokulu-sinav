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
export async function askAI(message, systemPrompt = '', maxTokens = 800) {
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
  // 1. ANA SİSTEM: Cloudflare Worker Proxy (Zero-Downtime)
  //    Artık tüm önbellekleme (Cache) ve Pollinations Yedekleri
  //    Worker içinde güvenle çalışıyor.
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
          input: message.substring(0, 1500),
          systemPrompt: sys,
          maxTokens: maxTokens
        }),
        signal: AbortSignal.timeout(15000)
      }).catch((e) => { console.warn('[API] CF fetch error:', e.message); return null; });

      if (res && res.ok) {
        const data = await res.json();
        const txt = clean(data?.text);
        if (txt) {
          console.log(`[API] ✅ CF Worker (model: ${data?.model}, tokens: ${data?.tokens?.total || '?'}, attempt: ${cfAttempt + 1})`);
          return txt;
        }
      } else if (res) {
        const status = res.status;
        console.warn(`[API] CF Worker status: ${status} (attempt ${cfAttempt + 1})`);
        if (status === 503) break;
      }
    } catch (e) { console.warn('[API] CF Worker exception:', e.message); }
  }

  console.warn("[API] ❌ Tüm Worker sistemleri (Gemini + Pollinations Cache) yanıt veremedi.");

  // ════════════════════════════════════════════════════
  // 2. OFFLINE PEDAGOJİK ÇÖKÜŞ (Graceful Degradation)
  // ════════════════════════════════════════════════════
  const offlineMessages = [
    "Hmm... Şu anda hafıza hücrelerimde ufak bir güncelleme yapılıyor. Sen bu arada kitabındaki ilgili sayfaları tekrar okumaya ne dersin?",
    "Derin bir nefes al... Nöronlarım kısa bir molada. Belki bu konuyu okulda öğretmeninle de tartışmak istersin?",
    "Aaa! Şu an çok fazla öğrenci bana soru soruyor, beynim biraz yoruldu! 1-2 dakika dinlenip öyle devam edelim olur mu?",
    "Tekniğe bağlı ufak bir sinyal kopukluğu var. Sen hemen defterindeki notları gözden geçir, birazdan tekrar konuşalım!"
  ];
  return "⚙️ *" + offlineMessages[Math.floor(Math.random() * offlineMessages.length)] + "*";
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
