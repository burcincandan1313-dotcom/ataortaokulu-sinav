const fs = require('fs');
let txt = fs.readFileSync('src/features/duelArena.js', 'utf8');

// 1. Add Grade HTML
const targetHtml = '<div>\\n            <label style=\"color: var(--txt); font-weight: bold; margin-bottom: 5px; display: block;\">Ders Seçimi:</label>';
const replacementHtml = `<div>
            <label style="color: var(--txt); font-weight: bold; margin-bottom: 5px; display: block;">Sınıf Seçimi:</label>
            <select id="lobbyGrade" style="width: 100%; padding: 12px; border-radius: 10px; background: rgba(0,0,0,0.3); color: var(--txt); border: 1px solid var(--bdr); outline: none;">
              <option value="1">1. Sınıf</option>
              <option value="2">2. Sınıf</option>
              <option value="3">3. Sınıf</option>
              <option value="4">4. Sınıf</option>
              <option value="5">5. Sınıf</option>
              <option value="6">6. Sınıf</option>
              <option value="7">7. Sınıf</option>
              <option value="8" selected>8. Sınıf</option>
              <option value="9">9. Sınıf</option>
              <option value="10">10. Sınıf</option>
              <option value="11">11. Sınıf</option>
              <option value="12">12. Sınıf</option>
            </select>
          </div>
          <div>
            <label style="color: var(--txt); font-weight: bold; margin-bottom: 5px; display: block;">Ders Seçimi:</label>`;

if(txt.includes('Ders Seçimi:')) {
  txt = txt.replace(/<div>\s*<label style="color: var\(--txt\); font-weight: bold; margin-bottom: 5px; display: block;">Ders Seçimi:<\/label>/, replacementHtml);
} else {
  console.log('Target HTML not found!');
}

// 2. Add event listeners logic
const replacementJs = `const gradeSelect = document.getElementById('lobbyGrade');
    const subjectSelect = document.getElementById('lobbySubject');
    const topicSelect = document.getElementById('lobbyTopic');

    const updateSubjects = () => {
      const g = gradeSelect.value;
      let newSubjects = ['Matematik', 'Fen Bilimleri', 'Türkçe', 'Sosyal Bilgiler', 'İngilizce', 'Din Kültürü ve Ahlak Bilgisi'];
      if (curriculumData[g]) {
        newSubjects = Object.keys(curriculumData[g]);
      }
      subjectSelect.innerHTML = newSubjects.map(s => \`<option value="\${s}">\${s}</option>\`).join('');
      updateTopics();
    };

    const updateTopics = () => {
      const g = gradeSelect.value;
      const subj = subjectSelect.value;
      if (curriculumData[g] && curriculumData[g][subj]) {
        const topics = curriculumData[g][subj];
        topicSelect.innerHTML = '<option value="Genel">Tüm Konular (Genel)</option>' + topics.map(t => \`<option value="\${t}">\${t}</option>\`).join('');
      } else {
        topicSelect.innerHTML = '<option value="Genel">Tüm Konular (Genel)</option>';
      }
    };

    gradeSelect.addEventListener('change', updateSubjects);
    subjectSelect.addEventListener('change', updateTopics);
    
    // Initialize subjects for selected grade
    if(gradeSelect.value !== grade) {
       gradeSelect.value = grade;
    }
    updateSubjects();`;

if(txt.includes('const subjectSelect')) {
  txt = txt.replace(/const subjectSelect = document.getElementById\('lobbySubject'\);[\s\S]*?updateTopics\(\);/, replacementJs);
} else {
  console.log('Target JS not found!');
}

// 3. Update the start action to use gradeSelect
const targetStart = 'this.startActualDuel(grade, s, t, qc, time);';
const replacementStart = `const g = document.getElementById('lobbyGrade').value;
      this.startActualDuel(g, s, t, qc, time);`;

if(txt.includes(targetStart)) {
  txt = txt.replace(targetStart, replacementStart);
} else {
  console.log('Target start not found!');
}

fs.writeFileSync('src/features/duelArena.js', txt, 'utf8');
console.log('Replaced successfully');
