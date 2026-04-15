/**
 * wizard.js
 * Bu dosya projenin ayrılmaz bir parçasıdır ve modüler özellik sağlar.
 */
// src/features/wizard.js
// Eğitim Seçim Sihirbazı (Ders / Quiz)

/**
 * wizard.js
 * Bu dosya projenin ayrilmaz bir parcasidir.
 */
import { curriculumData } from '../curriculum.js';

export let studySelections = { mode: '', grade: null, subject: '', topic: '' };

export function openStudyWizard(mode) {
  studySelections = { mode, grade: null, subject: '', topic: '' };
  
  const studyOverlay = document.getElementById('studyOverlay');
  const studyTitle = document.getElementById('studyTitle');
  const step1 = document.getElementById('studyStep1');
  const step2 = document.getElementById('studyStep2');
  const step3 = document.getElementById('studyStep3');
  const btnStartContainer = document.getElementById('btnStartStudyContainer');
  
  if (!studyOverlay) return;
  
  studyTitle.textContent = mode === 'quiz' ? '📊 Soru-Cevap Sınavı Oluştur' : '📚 Ders / Konu Anlatımı';
  
  // Reset steps — sadece step1 görünsün
  step1.style.display = 'block';
  step2.style.display = 'none';
  step3.style.display = 'none';
  if (btnStartContainer) btnStartContainer.style.display = 'none';
  
  // Özet satırlarını temizle
  clearSummaryBars();
  
  // Sınıf ızgarasını doldur
  const classGrid = document.getElementById('studyClassGrid');
  classGrid.innerHTML = '';
  for(let i=1; i<=12; i++) {
    const btn = document.createElement('button');
    btn.className = 'gbtn gs';
    btn.style.padding = '8px';
    btn.style.fontSize = '0.9rem';
    btn.textContent = i + '. Sınıf';
    btn.onclick = () => {
      // aktif durumu ayarla
      classGrid.querySelectorAll('.gbtn').forEach(b => {
        b.style.background = 'rgba(255,255,255,.06)';
        b.style.color = 'var(--txt)';
      });
      btn.style.background = 'linear-gradient(135deg, var(--acc), var(--acc2))';
      btn.style.color = '#fff';
      
      studySelections.grade = i;
      studySelections.subject = '';
      studySelections.topic = '';
      step3.style.display = 'none';
      if (btnStartContainer) btnStartContainer.style.display = 'none';
      
      // Step 1'i gizle, özet göster
      step1.style.display = 'none';
      showSummaryBar('summaryStep1', '1️⃣ Sınıf', i + '. Sınıf', () => {
        // Geri dönüş: step1'i göster, step2/3 gizle
        clearSummaryBars();
        step1.style.display = 'block';
        step2.style.display = 'none';
        step3.style.display = 'none';
        if (btnStartContainer) btnStartContainer.style.display = 'none';
      });
      
      populateStudySubjects(i);
      step2.style.display = 'block';
    };
    classGrid.appendChild(btn);
  }
  
  studyOverlay.style.display = 'flex';
  // active overlay animasyonu
  setTimeout(() => studyOverlay.classList.add('active'), 10);
  
  // Attach event listener once
  const btnStartStudy = document.getElementById('btnStartStudy');
  if (btnStartStudy) {
     btnStartStudy.onclick = () => {
         studyOverlay.style.display = 'none';
         const gradeStr = studySelections.grade + '. Sınıf';
         const s = studySelections.subject;
         const topic = studySelections.topic;
         const cmdString = mode === 'quiz' 
             ? `/quiz ${gradeStr} ${s} dersinde. Hedefim: Orta. Benim zayıf olduğum konuyu teşhis etmek ve bana özel bir çalışma planı çıkarmak için basitten zora doğru 5 soruluk analiz testi başlat. Konu: ${topic}`
             : `/ders ${gradeStr} ${s}, ${topic} konusunu detaylıca ve öğretici bir şekilde anlat.`;
             
         const chatInput = document.getElementById('userInput');
         const chatBtn = document.getElementById('btnSendMessage');
         if (chatInput && chatBtn) {
             chatInput.value = cmdString;
             chatBtn.click();
         }
     };
  }
}

// Özet çubuğu oluştur (tamamlanan adım için compact satır)
function showSummaryBar(id, label, value, onClickBack) {
  const body = document.getElementById('studyBody');
  if (!body) return;
  
  // Varsa eskisini sil
  const existing = document.getElementById(id);
  if (existing) existing.remove();
  
  const bar = document.createElement('div');
  bar.id = id;
  bar.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:8px 12px;margin-bottom:8px;background:rgba(255,255,255,.04);border:1px solid var(--bdr);border-radius:10px;cursor:pointer;transition:.2s;';
  bar.innerHTML = `
    <div style="display:flex;align-items:center;gap:8px;">
      <span style="font-size:.72rem;font-weight:700;color:var(--sub);text-transform:uppercase;">${label}:</span>
      <span style="font-size:.88rem;font-weight:700;color:var(--acc);">${value}</span>
    </div>
    <span style="font-size:.72rem;color:var(--sub);">✏️ Değiştir</span>
  `;
  bar.onmouseenter = () => { bar.style.borderColor = 'var(--acc)'; };
  bar.onmouseleave = () => { bar.style.borderColor = 'var(--bdr)'; };
  bar.onclick = onClickBack;
  
  // step1 öncesine ekle (body'nin başına)
  body.insertBefore(bar, body.firstChild);
}

function clearSummaryBars() {
  ['summaryStep1', 'summaryStep2'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.remove();
  });
}

function populateStudySubjects(grade) {
  const data = curriculumData[grade];
  if (!data) return;
  
  const subjectGrid = document.getElementById('studySubjectGrid');
  subjectGrid.innerHTML = '';
  const subjects = Object.keys(data);
  
  subjects.forEach(subj => {
    const btn = document.createElement('button');
    btn.className = 'gbtn gs';
    btn.style.padding = '10px';
    btn.textContent = subj;
    btn.onclick = () => {
      subjectGrid.querySelectorAll('.gbtn').forEach(b => {
        b.style.background = 'rgba(255,255,255,.06)';
        b.style.color = 'var(--txt)';
      });
      btn.style.background = 'linear-gradient(135deg, var(--acc), var(--acc2))';
      btn.style.color = '#fff';
      
      studySelections.subject = subj;
      studySelections.topic = '';
      
      // Step 2'yi gizle, özet göster
      const step2 = document.getElementById('studyStep2');
      const step3 = document.getElementById('studyStep3');
      const btnStartContainer = document.getElementById('btnStartStudyContainer');
      
      step2.style.display = 'none';
      showSummaryBar('summaryStep2', '2️⃣ Ders', subj, () => {
        // Geri dönüş: step2'yi göster, step3 gizle
        const s2bar = document.getElementById('summaryStep2');
        if (s2bar) s2bar.remove();
        step2.style.display = 'block';
        step3.style.display = 'none';
        if (btnStartContainer) btnStartContainer.style.display = 'none';
      });
      
      populateStudyTopics(grade, subj);
      step3.style.display = 'block';
    };
    subjectGrid.appendChild(btn);
  });
}

function populateStudyTopics(grade, subject) {
  const topics = curriculumData[grade][subject] || [];
  const topicGrid = document.getElementById('studyTopicGrid');
  if (!topicGrid) return;
  topicGrid.innerHTML = '';
  
  const btnContainer = document.getElementById('btnStartStudyContainer');
  if (btnContainer) btnContainer.style.display = 'none';
  
  if (topics.length === 0) {
      topicGrid.innerHTML = '<p style="color:var(--sub);font-size:0.9rem;">Bu ders için konu listesi bulunamadı.</p>';
      return;
  }
  
  topics.forEach(t => {
    const btn = document.createElement('button');
    btn.className = 'gbtn gs';
    btn.style.padding = '10px';
    btn.style.textAlign = 'left';
    btn.textContent = t;
    btn.onclick = () => {
      topicGrid.querySelectorAll('.gbtn').forEach(b => {
        b.style.background = 'rgba(255,255,255,.06)';
        b.style.color = 'var(--txt)';
      });
      btn.style.background = 'linear-gradient(135deg, var(--acc), var(--acc2))';
      btn.style.color = '#fff';
      
      studySelections.topic = t;
      if (btnContainer) btnContainer.style.display = 'block';
      setTimeout(() => {
        const body = document.getElementById('studyBody');
        if (body) body.scrollTop = body.scrollHeight;
      }, 50);
    };
    topicGrid.appendChild(btn);
  });
}
