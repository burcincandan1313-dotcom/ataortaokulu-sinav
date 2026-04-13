// src/features/wizard.js
// Eğitim Seçim Sihirbazı (Ders / Quiz)

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
  
  // Reset steps
  step2.style.display = 'none';
  step3.style.display = 'none';
  if (btnStartContainer) btnStartContainer.style.display = 'none';
  
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
      populateStudyTopics(grade, subj);
      const step3 = document.getElementById('studyStep3');
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
