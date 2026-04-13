const fs = require('fs');

let content = fs.readFileSync('src/app.js', 'utf8');

// 1. Get Top Part
let topPart = content.split('// ==== 2. YÜKLENİYOR & AI ROUTER SÜRECİ ====')[0];
if (!topPart) {
  console.log("Could not find YÜKLENİYOR string");
  process.exit(1);
}

// 2. Get Bottom Part
let bottomPartRaw = content.split('## JSON SCHEMA MUST BE:')[1];
if (!bottomPartRaw) {
  console.log("Could not find JSON SCHEMA string");
  process.exit(1);
}

// 3. Assemble Middle Part (The Router process, the prompt, and the AI context assembly)
let middlePart = `  // ==== 2. YÜKLENİYOR & AI ROUTER SÜRECİ ====
  if (lw.startsWith('/ders')) {
     currentMode = 'ders';
  }

  setIsLoading(true);
  toggleTypingIndicator(true);
  updateBotStatus('🟢 Düşünüyor...', '#4ade80');
  
  try {
     // A. MASTER AI ROUTER PROMPT
     const routerSystemPrompt = \`SEN = ATA Mentor (Akıllı Eğitim Asistanı)

ROLÜN:
Sen öğrencilere, gençlere ve kendini geliştirmek isteyen herkese yardım eden samimi, dostane ve inanılmaz bilgili bir eğitim mentorüsün.
Kötü, acımasız veya "robot" gibi davranmazsın. Tam tersine, karşıdakiyle arkadaş gibi, cesaretlendirici ve açıklayıcı konuşursun.

AMAÇ:
Kullanıcının sorduğu soruları çözmek, derslerinde ona yardım etmek, bilmediği şeyleri öğretmek ve ona normal bir sohbette eşlik etmek.

---

🔒 ANA KURALLAR:
* "Merhaba", "Nasılsın", "Selam" diyen birine GÜZELCE ve SICAK BİR ŞEKİLDE karşılık ver. Karşılamanı rahat ve dostane yap.
* Konuyu ANLAŞILIR ve NET açıkla. Öğrenci bir şey soruyorsa "Bilal'e anlatır gibi" ama zekice anlat.
* Eğer kullanıcı sadece sohbet ediyorsa, sen de onunla normal bir insan gibi, empati kurarak sohbet et.
* Öğrenci bilmediğini söyleyince onu köşeye sıkıştırma, hemen "işte böyle!" diyerek mantığını anlat.
* Her zaman yapıcı ve motive edici ol!

---

💡 ÖĞRETİM STİLİ:
Maddeler halinde, okunması kolay, emoji destekli ve akıcı metinler üret.
Sıkıcı ve uzun paragraf bloklarından kaçın.

SON MESAJ STİLİ:
Dostça, yardımsever ve aydınlatıcı.
Her zaman sonuna 'Hadi bir soru daha sor' veya 'Anladın mı?' gibi destekleyici bir soru ekleyebilirsin.

⚡ EĞİTİM VE AÇIKLAMA İSTİSNASI (ÇOK ÖNEMLİ):
Eğer kullanıcı "yanlışlarımı anlat", "eksiğimi anlat", "tekrar planı", "konuyu anlat" gibi eğitime yönelik soru soruyorsa:
- Uzun, detaylı ve öğretici bir şekilde BAŞTAN SONA ANLAT.
- Konuyu anlattıktan sonra, mutlaka 4 şıklı bir mini test sorusu (A, B, C, D) sor.
- En sona şu HTML buton kodunu ekle: <br><br><button class="chip" style="background:var(--acc);color:white;padding:8px 16px;border-radius:12px;font-weight:bold;border:none;cursor:pointer;" onclick="document.getElementById('userInput').value='Soruyu cevapla: '; document.getElementById('userInput').focus();">Devam Et ➡️</button><br>

Your job is to STRICTLY classify user intent and respond ONLY in valid JSON format.
Never respond with plain text.

## JSON SCHEMA MUST BE:\`;

       // B. AI BAĞLAMI KURULUYOR (Kısa Bellek Entegrasyonu)
       let AI_CONTEXT = \`Sistem Modu: \${currentMode.toUpperCase()}\\n\`;
       AI_CONTEXT += \`Seçili Karakter: \${window._activeCharacter ? window._activeCharacter.id : 'Yok'}\\n\`;
       AI_CONTEXT += routerSystemPrompt;

       // Son 5 mesajı AI contexte yedir
       const recentContext = state.messages.slice(-5).map(m => \`\${m.role === 'user' ? 'Kullanıcı' : 'Sen'}: \${m.content.replace(/<[^>]+>/g, '').substring(0, 150)}...\`).join('\\n');
       if(recentContext.length > 5){
         AI_CONTEXT += \`\\n\\n[SOHBET GEÇMİŞİ (Senin önceki cevapların ve kullanıcının dedikleri)]\\n\${recentContext}\\n\\nÖNEMLİ BİLGİ: Kullanıcının son cümlesine dostça cevap ver. Asla garip girişler ("Dur rastgele gelmedin" vs) yapma.\`;
       }

       let aiInputText = msg;

       // C. EĞİTİM ÇALIŞMA SİHİRBAZI EKLERİ
       if (window.activeStudySession && window.activeStudySession.isActive) {
           aiInputText = \`ÖĞRENCİNİN SEÇTİĞİ DERS: \${window.activeStudySession.subject}\\nSEÇİLEN KONU: \${window.activeStudySession.topic}\\n\\n\${msg}\`;
       }

       // D. API'YE JSON İSTEĞİ AT
       if (window._debugMode) {
          console.log('[AI REQ]', aiInputText);
       }
       
       const aiResRaw = await askAI(aiInputText, AI_CONTEXT);
       
       if (window._debugMode) {
          console.log('[AI RES RAW]', aiResRaw);
       }

       let aiData;
       try {
         // Eger metin icinde valid json varsa regex ile cikar
         const jsonMatch = aiResRaw.match(/\\{.*\\}/s);
         if (jsonMatch) {
            aiData = JSON.parse(jsonMatch[0]);
         } else {
            aiData = JSON.parse(aiResRaw);
         }
       } catch (err) {
         // PARSE HATASI FALLBACK
         if (window._debugMode) console.log('JSON Parse Hatasi, fallback uygulanıyor...', err);
         aiData = {
           intent: "chat",
           action: "reply",
           data: {
             content: aiResRaw.replace(/\\n/g, "<br>"),
             quantity: 1,
             object: "",
             subject: "",
             grade: null,
             topic: "",
             difficulty: "medium",
             suggestion_text: ""
           }
         };
       }

       // ============================
       // 3. AI YANITINI (ACTION) YÜRET
       // ============================
`;

// However, we MUST be careful! The `bottomPartRaw` starts right AFTER "## JSON SCHEMA MUST BE:". 
// But in my Middle Part, I ended with the execution block inside `handleSendMessage`.
// Wait!! If I do this, I will overwrite `handleSendMessage`'s entire execution logic down to JSON schema... wait, no.
// `bottomPartRaw` starts at `\n{\n  "intent": "chat | image | quiz",\n`
// But my `middlePart` includes ALL the JSON parsing logic? 
// No! The original file had the JSON parsing logic AFTER the schema.
// Let's print out what `bottomPartRaw` looks like at the beginning.
`;
console.log('');
