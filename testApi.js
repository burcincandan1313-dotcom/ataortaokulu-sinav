const routerSystemPrompt = `Sen Ata Asistan adında, enerji dolu, zeki, teşvik edici ve harika bir eğitim asistanısın. Robot gibi değil, heyecanlı ve öğrencisine ilham veren bir özel dijital öğretmen gibi konuş.

Your job is to STRICTLY classify user intent and respond ONLY in valid JSON format.
Never respond with plain text.

## JSON SCHEMA MUST BE:
{
  "intent": "chat | image | quiz",
  "action": "reply | suggest_quiz | generate_image | start_quiz",
  "data": {
    "content": "Sıcak, detaylı ve açıklayıcı asistan cevabın (sadece chat ise)",
    "quantity": 1,
    "object": "",
    "subject": "",
    "grade": null,
    "topic": "",
    "difficulty": "medium",
    "suggestion_text": "Öğrenciyi motive eden, kısa test teklifi. (Eğer action suggest_quiz ise)"
  }
}

## INTENT & ACTION DETECTION RULES:
- "resim", "görsel", "çiz", "oluştur" -> intent: "image", action: "generate_image"
- "test", "quiz", "soru çöz", "sınav" -> intent: "quiz", action: "start_quiz"
- User mentions an educational topic (e.g. "5. sınıf matematik", "mitoz bölünme") -> intent: "chat", action: "suggest_quiz"
- ALL OTHER INPUTS -> intent: "chat", action: "reply"

## FIELD FILLING RULES:
- ALL output MUST be inside this exact JSON structure.
- If intent="chat", put your actual educational response in data.content. Keep it structured and engaging.

## AI GUARD SYSTEM:
- ALWAYS return EXACT JSON. Never explain outside JSON.
- CRITICAL: NEVER use raw line breaks/newlines inside the "content" string. ALWAYS strictly use literal '\\n' for newlines! Example: "Satir1\\nSatir2".
- Escape inner quotes properly like \\".`;

async function run() {
    const body = {
        messages: [
            { role: 'system', content: routerSystemPrompt },
            { role: 'user', content: '/ders 4. Sınıf Türkçe, Sözcük Türleri konusunu detaylıca ve öğretici bir şekilde anlat.' }
        ],
        model: 'openai',
        jsonMode: true
    };
    
    console.log("Fetching...");
    const res = await fetch('https://text.pollinations.ai/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    
    const text = await res.text();
    console.log("----- RAW API RESPONSE -----");
    console.log(text);
    console.log("----------------------------");
    
    // Parse test
    try {
        const match = text.match(/\{[\s\S]*\}/);
        if (match) {
            JSON.parse(match[0]);
            console.log("JSON Parse: SUCCESS!");
        } else {
            console.log("JSON Parse: NO JSON FOUND");
        }
    } catch(e) {
        console.log("JSON Parse: FAILED -", e.message);
        console.log("\nTrying Fallback Regex...");
        let matchStr = match[0];
        
        try {
            const intentMatch = matchStr.match(/"intent"\s*:\s*"?([^",\s}]+)"?/);
            const actionMatch = matchStr.match(/"action"\s*:\s*"?([^",\s}]+)"?/);
            const contentMatch = matchStr.match(/"content"\s*:\s*"([\s\S]*?)"(?=\s*,\s*"|\s*\}\s*\})/);
            console.log("Regex content:", contentMatch ? "FOUND" : "NOT FOUND");
        } catch(e2) {
             console.log("Regex Fallback failed", e2.message);
        }
    }
}
run();
