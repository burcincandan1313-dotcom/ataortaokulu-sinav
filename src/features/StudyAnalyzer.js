/**
 * StudyAnalyzer — Ders Notu Analizörü
 * PDF/TXT dosyalardan metin çıkarıp AI ile quiz soruları üretir
 */

export class StudyAnalyzer {
  constructor() {
    this.text = '';
    this.filename = '';
    this.questions = [];
    this.currentQ = 0;
    this.score = 0;
    this.maxFileSize = 500 * 1024; // 500KB
  }

  loadText(text, filename) {
    this.text = text.substring(0, 5000); // İlk 5000 karakter
    this.filename = filename;
    this.questions = [];
    this.currentQ = 0;
    this.score = 0;
  }

  clear() {
    this.text = '';
    this.filename = '';
    this.questions = [];
    this.currentQ = 0;
    this.score = 0;
  }

  hasContent() {
    return this.text.length > 50;
  }

  getStats() {
    const words = this.text.split(/\s+/).filter(Boolean).length;
    const sentences = this.text.split(/[.!?]+/).filter(Boolean).length;
    return { chars: this.text.length, words, sentences };
  }

  /**
   * AI'ya gönderilecek quiz prompt'u üretir
   */
  buildQuizPrompt() {
    return `Aşağıdaki ders notuna dayalı olarak TAM 5 adet çoktan seçmeli soru oluştur.

KURAL:
- Her soru 4 seçenekli olsun (A, B, C, D)
- Doğru cevabı belirt
- Soruları Türkçe yaz
- JSON formatında döndür

FORMAT (bu formatı aynen kullan):
[
  {"q": "Soru metni?", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "answer": 0},
  ...
]
answer alanı 0-3 arası index (0=A, 1=B, 2=C, 3=D)

DERS NOTU:
${this.text.substring(0, 3000)}`;
  }

  /**
   * AI'ya gönderilecek analiz prompt'u üretir
   */
  buildAnalysisPrompt() {
    return `Aşağıdaki ders notunu analiz et ve şu bilgileri Türkçe Ver:

1. **Ana Konular** (madde listesi)
2. **Anahtar Kavramlar** (önemli terimler listesi)
3. **Özet** (3-4 cümle)
4. **Zorluk Seviyesi** (Kolay/Orta/Zor)

DERS NOTU:
${this.text.substring(0, 3000)}`;
  }

  /**
   * JSON quiz verisi parse et
   */
  parseQuizResponse(responseText) {
    try {
      // JSON array'i bul
      const match = responseText.match(/\[[\s\S]*\]/);
      if (!match) return null;
      const parsed = JSON.parse(match[0]);
      if (!Array.isArray(parsed) || parsed.length === 0) return null;
      this.questions = parsed.filter(q => q.q && q.options && typeof q.answer === 'number');
      this.currentQ = 0;
      this.score = 0;
      return this.questions;
    } catch (e) {
      console.warn('Quiz parse error:', e);
      return null;
    }
  }

  getCurrentQuestion() {
    if (this.currentQ >= this.questions.length) return null;
    return this.questions[this.currentQ];
  }

  checkAnswer(selectedIndex) {
    const q = this.questions[this.currentQ];
    if (!q) return null;
    const correct = selectedIndex === q.answer;
    if (correct) this.score++;
    this.currentQ++;
    return {
      correct,
      correctAnswer: q.options[q.answer],
      isFinished: this.currentQ >= this.questions.length,
      score: this.score,
      total: this.questions.length
    };
  }

  /**
   * Quiz sonuç HTML'i üretir
   */
  getResultHTML() {
    const pct = Math.round((this.score / this.questions.length) * 100);
    const emoji = pct >= 80 ? '🏆' : pct >= 60 ? '👍' : pct >= 40 ? '📚' : '💪';
    return `<div style="text-align:center;padding:14px;background:rgba(0,0,0,.35);border-radius:12px">
      <p style="font-size:2rem;margin-bottom:4px">${emoji}</p>
      <p style="font-size:1.1rem;font-weight:700;color:var(--acc)">Quiz Tamamlandı!</p>
      <p style="font-size:.88rem;margin:6px 0"><b>${this.score}</b> / ${this.questions.length} doğru (${pct}%)</p>
      <p style="font-size:.78rem;color:var(--sub)">Dosya: ${this.filename}</p>
    </div>`;
  }

  /**
   * Soru HTML'i üretir (chat mesajı olarak)
   */
  getQuestionHTML() {
    const q = this.getCurrentQuestion();
    if (!q) return this.getResultHTML();

    const num = this.currentQ + 1;
    const total = this.questions.length;
    let html = `<div style="background:rgba(0,0,0,.35);padding:14px;border-radius:12px">
      <p style="font-size:.72rem;color:var(--acc);font-weight:700;margin-bottom:8px">📝 Soru ${num}/${total}</p>
      <p style="font-size:.88rem;font-weight:600;margin-bottom:12px;line-height:1.5">${q.q}</p>`;

    q.options.forEach((opt, i) => {
      html += `<div class="suggestion-chip" style="display:block;margin-bottom:6px;padding:8px 12px;text-align:left;cursor:pointer" data-quiz-answer="${i}">${opt}</div>`;
    });

    html += `</div>`;
    return html;
  }
}
