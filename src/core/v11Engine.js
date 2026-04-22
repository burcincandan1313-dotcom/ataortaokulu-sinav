/**
 * v11Engine.js
 * Bu dosya projenin ayrılmaz bir parçasıdır ve modüler özellik sağlar.
 */
// ═══════════════════════════════════════════════════════════════════
// ATA ASİSTAN V11 — STRICT AGENTIC ENGINE
// 100/100 MİMARİ: Intent Parser → JSON Validation → Router → Engines
// ═══════════════════════════════════════════════════════════════════

/**
 * v11Engine.js
 * Bu dosya projenin ayrilmaz bir parcasidir.
 */
import { askAI, generateImage } from '../api.js';
import { state } from '../state.js';

// ──────────────────────────────────────────
// 📋 MEMORY (Madde 9)
// Kısa dönemli sohbet geçmişini tutar
// ──────────────────────────────────────────
const MAX_HISTORY = 6; // Son 6 mesaj
let conversationHistory = [];

export function v11AddToMemory(role, content) {
  conversationHistory.push({ role, content: content.replace(/<[^>]+>/g, '').substring(0, 300) });
  if (conversationHistory.length > MAX_HISTORY) {
    conversationHistory.shift();
  }
}

function buildMemoryContext() {
  if (conversationHistory.length === 0) return '';
  return '\n\n[PREVIOUS CONVERSATION CONTEXT]\n' +
    conversationHistory.map(m => `${m.role === 'user' ? 'Kullanıcı' : 'Asistan'}: ${m.content}`).join('\n');
}

// ──────────────────────────────────────────
// 🛡️ VALIDATION (Madde 7)
// Gelen JSON'ın geçerli bir intent formatında olduğunu doğrular
// ──────────────────────────────────────────
function validateIntent(json) {
  try {
    const parsed = typeof json === 'string' ? JSON.parse(json) : json;
    return parsed && typeof parsed.intent === 'string' &&
      ['chat', 'image', 'quiz'].includes(parsed.intent);
  } catch {
    return false;
  }
}

// ──────────────────────────────────────────
// 🔁 SAFE PARSE + RETRY (Madde 8)
// 3 deneme ile AI'dan zorunlu JSON çıkarır
// ──────────────────────────────────────────

const INTENT_PARSER_PROMPT = `You are a STRICT AI intent parser for an educational chatbot.
You MUST return ONLY a valid JSON object. No explanation. No text before or after JSON.

Classify the user input into this EXACT schema:
{
  "intent": "chat | image | quiz",
  "object": "string (what to draw, empty if not image)",
  "count": 1,
  "subject": "string (e.g. Matematik, Fen Bilimleri, Türkçe vs. MUST BE IN TURKISH)",
  "topic": "string (specific lesson topic. MUST BE IN TURKISH)",
  "difficulty": "easy | medium | hard",
  "grade": null
}

CLASSIFICATION RULES:
- User mentions "resim", "çiz", "görsel", "fotoğraf", "image", "draw" → intent = "image"
- User mentions "test", "quiz", "sınav", "testi", "sınavı" AND asks for a STANDARD test → intent = "quiz"  
- CRITICAL: If user asks for a SPECIFIC question format (boşluk doldurma, doğru-yanlış, açık uçlu, eşleştirme, soru üret, soru sor, soru hazırla, kısa cevaplı) → intent = "chat" (NOT quiz!)
- User mentions "anlat", "nedir", "açıkla", "kimdir", "bilgi ver" → intent = "chat"
- ANY educational teaching, explaining, or natural conversation → intent = "chat"
- "soru üret", "soru hazırla", "soru sor" without explicit "test/quiz/sınav" → intent = "chat"
- If user specifies a number → extract as count
- INVALID OUTPUT FORMAT = CRITICAL FAILURE

Examples:
Input: "3 elma resmi çiz" → {"intent":"image","object":"apple","count":3,"subject":"","topic":"","difficulty":"medium","grade":null}
Input: "9. sınıf fizik testi" → {"intent":"quiz","object":"","count":1,"subject":"Fizik","topic":"Genel","difficulty":"medium","grade":9}
Input: "Merhaba nasılsın" → {"intent":"chat","object":"","count":1,"subject":"","topic":"","difficulty":"medium","grade":null}
Input: "fotosentez nedir" → {"intent":"chat","object":"","count":1,"subject":"Fen Bilimleri","topic":"Fotosentez","difficulty":"easy","grade":null}
Input: "matematik karekök konusu anlat" → {"intent":"chat","object":"","count":1,"subject":"Matematik","topic":"Karekök","difficulty":"medium","grade":null}
Input: "boşluk doldurmalı soru üret" → {"intent":"chat","object":"","count":1,"subject":"","topic":"","difficulty":"medium","grade":null}
Input: "doğru yanlış soruları hazırla" → {"intent":"chat","object":"","count":1,"subject":"","topic":"","difficulty":"medium","grade":null}
Input: "açık uçlu soru sor" → {"intent":"chat","object":"","count":1,"subject":"","topic":"","difficulty":"medium","grade":null}`;

export async function v11SafeParse(userInput) {
  const memContext = buildMemoryContext();

  // ── LOCAL PRE-CLASSIFIER ──
  // Basit/sık kullanılan komutları AI'ya göndermeden yerel olarak çözümle
  const lw = userInput.trim().toLowerCase();
  
  // Chat intent'i kesin olan kalıplar (gereksiz API çağrısını önle)
  const chatPatterns = [
    /^(merhaba|selam|hey|hi|hello|nasılsın|ne haber|günaydın|iyi akşamlar|iyi geceler)/,
    /^(teşekkür|sağol|sağ ol|eyvallah|tşk|ok|tamam|anladım|peki|olur)/,
    /^(evet|hayır|yok|var|belki|bilmem)/,
    /^(devam|devam et|devam edelim|sonraki|bir sonraki|ilerle)/,
    /^(nedir|ne demek|ne anlama gelir|kim|kimdir|nerede|ne zaman|neden|niçin|nasıl)/,
    /^(anlat|açıkla|öğret|göster|tarif et|bilgi ver)/,
    /^(yard[ıi]m|help|bana yard[ıi]m)/,
    /^[\p{Emoji}\s]{1,10}$/u,  // Sadece emoji
  ];
  
  if (chatPatterns.some(p => p.test(lw))) {
    console.log('[V11 Parser] Local pre-classifier → chat (common phrase)');
    return { intent: 'chat', object: '', count: 1, subject: '', topic: '', difficulty: 'medium', grade: null };
  }

  // ── ÖZEL SORU FORMAT İSTEKLERİ → CHAT (quiz engine'e değil!) ──
  // "boşluk doldurmalı soru üret", "doğru yanlış sorusu", "açık uçlu soru sor" vb.
  const customQuestionFormats = /\b(boşluk\s*doldur|doğru\s*yanlış|açık\s*uçlu|eşleştirme|kısa\s*cevap|uzun\s*cevap|soru\s*üret|soru\s*hazırla|soru\s*oluştur|klasik\s*soru|yazılı\s*soru|sözel\s*soru)\b/i;
  if (customQuestionFormats.test(lw)) {
    console.log('[V11 Parser] Local pre-classifier → chat (custom question format request)');
    return { intent: 'chat', object: '', count: 1, subject: '', topic: '', difficulty: 'medium', grade: null };
  }

  // Kesin görsel (resim) intent'leri
  if (/\b(resim|çiz|görsel|fotoğraf|image|draw|oluştur.*resim|kedi.*resmi|köpek.*resmi)\b/i.test(lw)) {
    console.log('[V11 Parser] Local pre-classifier → image');
    const obj = lw.replace(/(resim|çiz|görsel|fotoğraf|oluştur|image|draw|bir|tane|adet)/gi, '').trim() || 'illustration';
    const countMatch = lw.match(/(\d+)/);
    return { intent: 'image', object: obj, count: countMatch ? parseInt(countMatch[1]) : 1, subject: '', topic: '', difficulty: 'medium', grade: null };
  }

  // Kesin quiz intent'leri — SADECE standart test/sınav istekleri
  // "soru üret/hazırla" burada YOK, onlar yukarıda chat'e yönlendirildi
  if (/\b(quiz|test\b|sınav|testi\b|sınavı\b)\b/i.test(lw) && !/\banlat\b/i.test(lw) && !/\bsözlü\b/i.test(lw)) {
    console.log('[V11 Parser] Local pre-classifier → quiz');
    return { intent: 'quiz', object: '', count: 1, subject: '', topic: '', difficulty: 'medium', grade: null };
  }

  // Eğer yerel sınıflandırma yapamazsak AI parser'a gönder
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const raw = await askAI(userInput + memContext, INTENT_PARSER_PROMPT);
      if (!raw) continue;

      // JSON'ı markdown wrapper'dan kurtaran regex
      const match = raw.match(/\{[\s\S]*?\}/);
      if (!match) continue;

      const candidate = match[0];
      if (validateIntent(candidate)) {
        const parsed = JSON.parse(candidate);
        console.log(`[V11 Parser] Attempt ${attempt + 1} → intent: ${parsed.intent}`);
        return parsed;
      }
    } catch (e) {
      console.warn(`[V11 Parser] Attempt ${attempt + 1} failed:`, e.message);
    }
  }

  // 3 deneme sonrası fallback: "chat" kabul et
  console.error('[V11 Parser] All attempts failed. Defaulting to chat.');
  return { intent: 'chat', object: '', count: 1, subject: '', topic: '', difficulty: 'medium', grade: null };
}

// ──────────────────────────────────────────
// 🧠 MASTER ROUTER (Madde 3)
// Intent verisine göre doğru engine'i tetikler
// ──────────────────────────────────────────
export async function v11Route(intentData, originalInput, callbacks) {
  const { onTextOutput, onImageOutput, onQuizOutput, onError, currentMode, studySelections, activeCharacter, lastDocument } = callbacks;

  switch (intentData.intent) {
    case 'image':
      return await imageEngine(intentData, onImageOutput, onError);

    case 'quiz':
      return await quizEngine(intentData, onQuizOutput, onError, studySelections);

    case 'chat':
    default:
      return await chatEngine(originalInput, onTextOutput, onError, {
        currentMode,
        studySelections,
        activeCharacter,
        lastDocument
      });
  }
}

// ──────────────────────────────────────────
// 🖼️ IMAGE ENGINE (Madde 4 — Count Fix)
// ──────────────────────────────────────────
async function imageEngine(data, onImageOutput, onError) {
  const count = data.count || 1;
  const obj = data.object || 'a beautiful educational illustration';

  // Count fix: prompt'a tam sayı vurgusunu ekliyoruz
  const finalPrompt = `${count} ${obj}, clearly visible as ${count} separate item(s), no extra objects, ultra realistic, 4k, educational illustration style, professional lighting`;

  try {
    const imgData = await generateImage(finalPrompt);
    onImageOutput({ count, object: obj, imgData });
  } catch (e) {
    onError('Görsel oluşturulamadı: ' + e.message);
  }
}

// ──────────────────────────────────────────
// 🧠 QUIZ ENGINE (Madde 5)
// ──────────────────────────────────────────
async function quizEngine(data, onQuizOutput, onError, studySelections) {
  let parsedGrade = parseInt(data.grade);
  if (isNaN(parsedGrade)) parsedGrade = studySelections?.grade || null;
  const finalGrade = parsedGrade ? parsedGrade + '. Sınıf' : 'Genel';

  let subject = data.subject || studySelections?.subject || 'Genel';
  if (subject.toLowerCase() === 'math' || subject.toLowerCase() === 'mathematics') subject = 'Matematik';

  let topic = data.topic || studySelections?.topic || 'Genel Kültür';
  let difficulty = data.difficulty || 'medium';

  onQuizOutput({ grade: finalGrade, subject, topic, difficulty });
}

// ──────────────────────────────────────────
// 💬 CHAT ENGINE (Madde 6)
// EN KAPSAMLI YAPAY ZEKA KESİN EĞİTİM PROMPTU
// ──────────────────────────────────────────

const ATA_MENTOR_SYSTEM_PROMPT = `SEN = ATA Mentor (Akıllı Eğitim Asistanı) — V11 ENGINE

ROLÜN:
Sen Türkiye'deki ilkokul, ortaokul ve lise öğrencilerine destek veren, samimi, bilgili ve motive edici bir eğitim mentörüsün.
Arkadaş gibi, sıcak ve cesaretlendirici konuşursun. Hiçbir zaman robot gibi, soğuk veya baskıcı davranmazsın.

AMAÇ:
Öğrencilerin derslerini öğrenmelerine yardım etmek, sorularını çözmek, bilimsel konuları açıklamak.

🔒 KESİN KURALLAR:
1. Sadece eğitim, ders, bilim, akademik konulara cevap ver.
2. Siyaset, din, futbol, magazin, dizi/film, şiddet → KESİNLİKLE CEVAP VERME.
3. Eğitim dışı konularda doğrudan reddetmek yerine: Eğlenceli konuları (örn. Dinazorlar, Uzay) bilime bağla. Tamamen alakasızsa "Ben bir eğitim asistanıyım. O konuları çok bilmiyorum ama istersen okul dersleri hakkında konuşabiliriz." de.
4. Küçük yaş (1. sınıf) çocukların kelime veya harf hatalarını, anlamsız tuşlamalarını (typo) sevgiyle karşıla. Emojilerle konuşuyorlarsa onlara uyum sağla, onları azarlama.
5. "Merhaba", "Nasılsın" gibi selamlaşmalara sıcak karşılık ver.
6. Paragrafları kısa tut ama konuyu tam anlat. Başlık, madde ve örnekler kullanarak düzenli format yap.

📛 RESPONSE FORMAT:
- Kesinlikle JSON değil, düz metin olarak cevap ver.
- Markdown kullanabilirsin (**, ##, -, * vs.)
- Emoji kullan ama abartma
- Türkçe yaz`;

async function chatEngine(userInput, onTextOutput, onError, context) {
  const { currentMode, studySelections, activeCharacter, lastDocument } = context;

  let systemPrompt = ATA_MENTOR_SYSTEM_PROMPT;
  const memContext = buildMemoryContext();

  // Bağlam katmanları
  if (lastDocument) {
    systemPrompt += `\n\n[YÜKLÜ DOKÜMAN]: ${lastDocument.substring(0, 2000)}`;
  }

  if (activeCharacter) {
    systemPrompt += `\n\n[KARAKTER MODU]: Sen şu an "${activeCharacter.isim}" adlı karakteri oynuyorsun. ${activeCharacter.desc}. Mesajlarını bu karakterin bakış açısıyla ver, ama eğitim odaklı kal.`;
  }

  if (currentMode === 'ders' && studySelections?.topic) {
    systemPrompt += `\n\n[AKTİF DERS BAĞLAMI]: Öğrenci şu an ${studySelections.grade}. Sınıf "${studySelections.subject}" dersinin "${studySelections.topic}" konusunu çalışıyor.
KESİN TALİMAT: Bu konuyu HEMEN ve DETAYLI anlat! "Harika seçim" gibi gereksiz girişler yapma, DOĞRUDAN konuyu öğretmeye başla.
SADECE bu ders ve konuyla ilgili sorulara cevap ver! Diğer tüm konuları kesinlikle "Şu anda ${studySelections.subject} dersindeyiz, lütfen sadece bu dersle ilgili soru sor." diyerek reddet.`;
  } else if (currentMode === 'ders') {
    // Başka Konuya Geç popup'ından veya serbest /ders komutundan geliyorsa
    // studySelections boş ama kullanıcının mesajında konu var
    systemPrompt += `\n\n[DERS ANLATIM MODU AKTİF]: Kullanıcı yeni bir konu öğrenmek istiyor.
KESİN TALİMAT: Kullanıcının istediği konuyu HEMEN, DETAYLI ve ÖĞRETİCİ şekilde anlat!
- "Harika seçim!", "Güzel konu!" gibi gereksiz övgüler yapma, DOĞRUDAN konuyu öğretmeye başla.
- Konunun temel kavramlarını, örneklerle ve adım adım açıkla.
- Önceki konularla veya derslerle bağlantı kurma, SADECE istenen konuya odaklan.
- "Başka zaman çalışırız" gibi erteleme yapma, ŞİMDİ anlat!`;
  }

  if (window.activeOralSession) {
    systemPrompt += `\n\n[🔥 KRİTİK: SÖZLÜ MÜLAKAT SINAVI AKTİF 🔥]
ÖĞRENCİNİN YAZDIĞI MESAJ, SENİN BİR ÖNCEKİ SORUNUN CEVABIDIR! YENİ BİR KONU İSTEĞİ DEĞİLDİR!
KESİN KURALLAR:
1) Öğrencinin cevabını DOĞRU veya YANLIŞ olarak değerlendir ve mantığını TEK CÜMLE ile açıkla. "Harika konu seçimi", "Hadi derinlemesine inceleyelim" gibi ifadeler KULLANMA. Sen şu an bir sınav gözetmenisin!
2) Değerlendirmeden hemen sonra büyük harflerle "SORU [N]:" yazarak YENİ BİR SORU SOR.
3) Konu anlatımına girme, sadece mülakata devam et!`;
  }

  const finalInput = userInput + memContext;

  // Ders modunda daha uzun yanıt için yüksek token limiti
  const tokenLimit = (currentMode === 'ders') ? 1500 : 800;

  try {
    const response = await askAI(finalInput, systemPrompt, tokenLimit);

    if (!response || response.trim().length === 0) {
      onError('AI boş yanıt döndü.');
      return;
    }

    // OUTPUT VALIDATION (Madde 11): AI çıktısını direkt DOM'a verme
    // Temizle ve doğrula
    let safeOutput = response
      .replace(/```json[\s\S]*?```/gi, '') // JSON kod bloklarını sil (yanlışlıkla JSON dönerse)
      .replace(/```[\s\S]*?```/gi, (match) => match) // Diğer kod bloklarını koru
      .trim();

    // Eğer AI yanlışlıkla JSON döndürdüyse çıkar
    if (safeOutput.startsWith('{') && safeOutput.includes('"intent"')) {
      try {
        const parsed = JSON.parse(safeOutput);
        safeOutput = parsed?.data?.content || parsed?.content || 'Anlayamadım, lütfen tekrar yazar mısın?';
      } catch {
        safeOutput = 'Anlayamadım, lütfen tekrar yazar mısın?';
      }
    }

    onTextOutput(safeOutput);
  } catch (e) {
    onError('Sohbet yanıtı alınamadı: ' + e.message);
  }
}
