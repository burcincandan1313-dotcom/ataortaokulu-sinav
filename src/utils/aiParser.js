// src/utils/aiParser.js

/**
 * Yapay Zekadan gelen ve çoğu zaman Markdown tagleri içeren,
 * veya limitlere takılıp ortasında kesilmiş JSON çıktılarını onaran (Auto-Heal) sistem.
 */
export function extractAndFixQuizJson(text) {
  // Markdown ve gereksiz etiketleri kaldır
  let cleanText = text.trim();
  
  // Eğer ```json bloğu varsa sadece içini al
  const mdMatch = cleanText.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (mdMatch && mdMatch[1]) {
    cleanText = mdMatch[1].trim();
  } else {
    cleanText = cleanText.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim();
  }

  const objStart = cleanText.indexOf('{');
  const arrStart = cleanText.indexOf('[');
  
  let startIndex = Math.min(
    objStart !== -1 ? objStart : Infinity, 
    arrStart !== -1 ? arrStart : Infinity
  );

  if (startIndex === Infinity) return null;

  let jsonPart = cleanText.substring(startIndex);
  let parsed = null;

  // 1. Normal Parse Denemesi (Eğer AI düzgün formattaysa)
  try {
    const lastBrace = jsonPart.lastIndexOf(startIndex === objStart ? '}' : ']');
    if (lastBrace !== -1) {
      const candidate = jsonPart.substring(0, lastBrace + 1);
      try {
        parsed = JSON.parse(candidate);
      } catch (e1) {
        // ULTRA-HEAL: Eğer literal newline (Enter) yüzünden hata veriyorsa, hepsini boşlukla değiştir.
        console.warn("[ULTRA-HEAL] Quiz JSON parse failed. Removing literal newlines... Error:", e1.message);
        
        // Escape quotes inside strings trick: (Not perfect, but solves basic issues)
        let healed = candidate.replace(/(?:\r\n|\r|\n)/g, ' ');
        // Clean trailing commas in objects/arrays (common AI JSON mistake)
        healed = healed.replace(/,\s*([\}\]])/g, '$1');
        
        try {
          parsed = JSON.parse(healed);
        } catch (e2) {
          console.warn("[ULTRA-HEAL] Second pass failed:", e2.message);
        }
      }
      
      if (parsed && parsed.quiz && Array.isArray(parsed.quiz)) {
        return parsed;
      }
      
      // Eğer objekte quiz yoksa ama kendisi bir arraysa kurtar
      if (Array.isArray(parsed)) {
        return { quiz: parsed };
      }
      
      // Eğer nesne döndüyse ama quiz yoksa (örn: result: []) Object.values ile dene
      if (parsed && typeof parsed === 'object') {
        for (const key in parsed) {
          if (Array.isArray(parsed[key])) {
             return { quiz: parsed[key] };
          }
        }
      }
    }
  } catch (e) {
    // Başarısız olursa devam et
  }
  
  // 1.5 Eğer direkt Dizi idiyse (Yukarıdaki obj parse fail olduysa):
  if (jsonPart.trim().startsWith('[')) {
      try {
          const arrParsed = JSON.parse(jsonPart);
          if (Array.isArray(arrParsed)) return { quiz: arrParsed };
      } catch(e) { }
  }

  // 2. Kırık JSON Kurtarma (Auto-Heal)
  // AI cevabı bitiremediyse ve json "]" formunda kapatılamadıysa objeyi kurtarırız
  try {
    const arrStart = jsonPart.indexOf('[');
    if (arrStart !== -1) {
      let arrPart = jsonPart.substring(arrStart);
      
      let arrEnd = arrPart.lastIndexOf(']');
      
      if (arrEnd === -1) {
        // En son başarılı kapanmış objeyi (}) bul
        const lastObjEnd = arrPart.lastIndexOf('}');
        if (lastObjEnd !== -1) {
          // Diziyi force ederek kapat (kırık olan son soruyu dahil etmezk)
          arrPart = arrPart.substring(0, lastObjEnd + 1) + ']';
        } else {
          return null; // Obje bile çıkmamış
        }
      } else {
        // Dizi kapanmış ama ekstra çöp metin varsa temizle
        arrPart = arrPart.substring(0, arrEnd + 1);
      }

      // Arrays formatındaki stringi güvenle parse et
      let quizArr;
      try {
        quizArr = JSON.parse(arrPart);
      } catch (e1) {
        console.warn("[ULTRA-HEAL fallback] Array parse failed. Removing literal newlines...");
        const healedArr = arrPart.replace(/(?:\r\n|\r|\n)/g, ' ');
        quizArr = JSON.parse(healedArr);
      }
      return { quiz: quizArr };
    }
  } catch (e) {
    console.warn("AIParser: Array seviyesinde otomatik onarım başarısız.", e);
  }

  return null;
}
