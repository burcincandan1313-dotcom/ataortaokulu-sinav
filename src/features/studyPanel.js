/**
 * studyPanel.js
 * Bu dosya projenin ayrılmaz bir parçasıdır ve modüler özellik sağlar.
 */
// src/features/studyPanel.js
/**
 * studyPanel.js
 * Bu dosya projenin ayrilmaz bir parcasidir.
 */
import { StudyAnalyzer } from './StudyAnalyzer.js';
import { extractTextFromPDF } from './PDFReader.js';

export const studyAnalyzer = new StudyAnalyzer();

export function initStudyPanel(handleSendMessage, appendMessage, formatMessage) {
  const dropZone = document.getElementById('studyDropZone');
  const fileInput = document.getElementById('studyFileInput');
  const fileName = document.getElementById('studyFileName');
  const fileStats = document.getElementById('studyFileStats');
  const btnQuiz = document.getElementById('btnStudyQuiz');
  const btnAnalyze = document.getElementById('btnStudyAnalyze');
  const btnClear = document.getElementById('btnStudyClear');
  const resultP = document.getElementById('studyResult');

  if (!dropZone || !fileInput) return;

  dropZone.addEventListener('click', () => fileInput.click());

  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = 'var(--acc)';
    dropZone.style.background = 'rgba(255,255,255,0.05)';
  });

  dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = 'rgba(255,255,255,0.1)';
    dropZone.style.background = 'transparent';
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = 'rgba(255,255,255,0.1)';
    dropZone.style.background = 'transparent';
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
    fileInput.value = '';
  });

  btnClear.addEventListener('click', () => {
    studyAnalyzer.clear();
    updateUI();
  });

  btnQuiz.addEventListener('click', () => {
    if (!studyAnalyzer.hasContent()) return;
    const prompt = studyAnalyzer.buildQuizPrompt();
    appendMessage('user', formatMessage('user', `📄 ${studyAnalyzer.filename} dosyasından quiz oluştur.`));
    // Trigger the AI chat
    handleSendMessage(prompt, true, "QUIZ_MODE_JSON"); 
    closeModal();
  });

  btnAnalyze.addEventListener('click', () => {
    if (!studyAnalyzer.hasContent()) return;
    const prompt = studyAnalyzer.buildAnalysisPrompt();
    appendMessage('user', formatMessage('user', `📄 ${studyAnalyzer.filename} dosyasını analiz et.`));
    // Trigger the AI chat
    handleSendMessage(prompt, true, "ANALYSIS_MODE");
    closeModal();
  });

  async function handleFile(file) {
    if (file.size > studyAnalyzer.maxFileSize) {
      showMenuError(`Dosya çok büyük. Maksimum ${Math.floor(studyAnalyzer.maxFileSize / 1024)}KB.`);
      return;
    }

    try {
      resultP.textContent = '⏳ Okunuyor...';
      let text = '';
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        text = await file.text();
      } else if (file.type === 'application/pdf') {
        text = await extractTextFromPDF(file);
      } else {
        showMenuError('Sadece PDF ve TXT desteklenir.');
        return;
      }

      studyAnalyzer.loadText(text, file.name);
      updateUI();
      resultP.textContent = '✅ Dosya yüklendi ve okundu.';
      
      // Update global context for chat interactions
      window.lastAnalyzedDocument = text.substring(0, 15000);
      
    } catch (err) {
      showMenuError(err.message || 'Dosya okuma hatası');
    }
  }

  function updateUI() {
    if (studyAnalyzer.hasContent()) {
      fileName.textContent = `📄 ${studyAnalyzer.filename}`;
      const stats = studyAnalyzer.getStats();
      fileStats.textContent = `${stats.words} kelime, ${stats.sentences} cümle`;
      btnQuiz.disabled = false;
      btnAnalyze.disabled = false;
      btnClear.disabled = false;
    } else {
      fileName.textContent = '';
      fileStats.textContent = '';
      btnQuiz.disabled = true;
      btnAnalyze.disabled = true;
      btnClear.disabled = true;
      resultP.textContent = '';
    }
  }

  function showMenuError(msg) {
    resultP.textContent = `❌ ${msg}`;
    resultP.style.color = '#ef4444';
    setTimeout(() => {
      resultP.textContent = '';
      resultP.style.color = 'var(--text-color)';
    }, 3000);
  }
  
  function closeModal() {
    const modal = document.getElementById('settingsModal');
    if (modal) modal.style.display = 'none';
  }
}
