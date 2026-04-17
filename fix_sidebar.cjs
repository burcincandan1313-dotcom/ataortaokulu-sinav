const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Replace standard <summary> with <summary> containing the chevron arrow icon
const find1 = '<summary class="sb-summary"><i class="fa-solid fa-graduation-cap"></i> Eğitim & Sınav</summary>';
const rep1 = '<summary class="sb-summary"><div style="display:flex; align-items:center; gap:8px;"><i class="fa-solid fa-graduation-cap"></i> Eğitim & Sınav</div><i class="fa-solid fa-chevron-down acc-arrow"></i></summary>';

const find2 = '<summary class="sb-summary"><i class="fa-solid fa-gamepad"></i> Oyun & Etkinlik</summary>';
const rep2 = '<summary class="sb-summary"><div style="display:flex; align-items:center; gap:8px;"><i class="fa-solid fa-gamepad"></i> Oyun & Etkinlik</div><i class="fa-solid fa-chevron-down acc-arrow"></i></summary>';

const find3 = '<summary class="sb-summary"><i class="fa-solid fa-chart-line"></i> Rapor & Araçlar</summary>';
const rep3 = '<summary class="sb-summary"><div style="display:flex; align-items:center; gap:8px;"><i class="fa-solid fa-chart-line"></i> Rapor & Araçlar</div><i class="fa-solid fa-chevron-down acc-arrow"></i></summary>';

html = html.replace(find1, rep1).replace(find2, rep2).replace(find3, rep3);

fs.writeFileSync('index.html', html, 'utf8');
console.log('HTML updated successfully');

let css = fs.readFileSync('src/style.css', 'utf8');

// Remove the ::after selectors
css = css.replace(/\.sb-summary::after\s*\{[\s\S]*?\}/g, '');
css = css.replace(/\.sb-accordion\[open\] \.sb-summary::after\s*\{[\s\S]*?\}/g, '');

const newCSSRules = `
.sb-summary .acc-arrow {
  color: var(--sub);
  font-size: 0.8rem;
  transition: transform 0.3s ease;
}
.sb-accordion[open] .sb-summary .acc-arrow {
  transform: rotate(180deg);
  color: var(--acc);
}
`;

if (!css.includes('.sb-summary .acc-arrow')) {
   css += newCSSRules;
}

fs.writeFileSync('src/style.css', css, 'utf8');
console.log('CSS updated successfully');
