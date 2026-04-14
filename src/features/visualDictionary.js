/**
 * visualDictionary.js
 * Bu dosya projenin ayrılmaz bir parçasıdır ve modüler özellik sağlar.
 */
// src/features/visualDictionary.js
// ATA Asistan Görsel Sözlük Modülü (Kullanıcı Denetimli)

// Başlangıç (Default) Veritabanı (Sabit ve Kırılmayan Linkler)
/**
 * visualDictionary.js
 * Bu dosya projenin ayrilmaz bir parcasidir.
 */
const defaultDictionaryData = [
  {
    id: "dog_parts",
    title: "🐶 Parts of a Dog (Köpeğin Bölümleri)",
    // Güvenilir ve CORS destekli kaynak
    image_url: "https://images.dog.ceo/breeds/labrador/n02099712_4323.jpg",
    hotspots: [
      { x: 30, y: 22, label: "Ear" },
      { x: 42, y: 38, label: "Eye" },
      { x: 52, y: 58, label: "Nose" },
      { x: 52, y: 67, label: "Mouth" },
      { x: 70, y: 50, label: "Body" },
      { x: 85, y: 80, label: "Tail" },
      { x: 38, y: 85, label: "Paw" }
    ]
  },
  {
    id: "fruit_basket",
    title: "🍎 Fruits (Meyveler)",
    image_url: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&q=80",
    hotspots: [
      { x: 45, y: 65, label: "Apple" },
      { x: 25, y: 50, label: "Banana" },
      { x: 70, y: 55, label: "Orange" },
      { x: 55, y: 35, label: "Grapes" }
    ]
  }
];

let activeTooltip = null;

// Tüm sözlükleri LocalStorage'dan al
function getDictionaries() {
  const customStr = localStorage.getItem('mega_custom_dicts');
  let customList = [];
  if (customStr) {
    try { customList = JSON.parse(customStr); } catch(e) {}
  }
  return [...defaultDictionaryData, ...customList];
}

function saveCustomDictionary(dict) {
  const customStr = localStorage.getItem('mega_custom_dicts');
  let customList = [];
  if (customStr) {
    try { customList = JSON.parse(customStr); } catch(e) {}
  }
  customList.push(dict);
  localStorage.setItem('mega_custom_dicts', JSON.stringify(customList));
}

/**
 * Görsel Sözlük Modülünü gösterir
 */
export function renderVisualDictionaryMenu(container) {
  const allDicts = getDictionaries();
  
  container.innerHTML = `
    <div style="padding: 20px; text-align: center; color: var(--text-color); max-height: 100%; overflow-y: auto;">
      <h2 style="font-size: 1.8rem; margin-bottom: 5px; color: var(--acc);">🌟 Görsel İnteraktif Sözlük</h2>
      <p style="color: var(--sub); margin-bottom: 25px;">Kendi sözlüğünüzü oluşturabilir veya mevcutlardan birini seçebilirsiniz.</p>
      
      <div style="display: flex; flex-wrap: wrap; gap: 15px; justify-content: center; margin-bottom: 30px;">
        <!-- Kendi Sözlüğünü Ekle Butonu -->
        <div id="btnAddNewDict" style="
            background: rgba(74, 222, 128, 0.1); border: 2px dashed #4ade80; border-radius: 16px; padding: 15px; width: 220px; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: all 0.3s ease;">
             <div style="font-size: 3rem; margin-bottom: 10px;">➕</div>
             <div style="font-weight:bold; color: #4ade80;">Yeni Sözlük Ekle</div>
        </div>

        ${allDicts.map(topic => `
          <div class="dict-card" data-id="${topic.id}" style="
            background: rgba(255,255,255,0.05); border: 1px solid var(--bdr); border-radius: 16px; padding: 15px; width: 220px; cursor: pointer; transition: all 0.3s ease;">
             <img src="${topic.image_url}" onerror="this.src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png'" style="width:100%; height:130px; object-fit:cover; border-radius:10px; margin-bottom:10px;">
             <div style="font-weight:bold;">${topic.title}</div>
          </div>
        `).join('')}
      </div>
      
      <button id="closeDictMenu" style="padding: 10px 20px; border-radius: 8px; background: var(--bdr); color: var(--text-color); border: none; cursor: pointer;">Kapat</button>
    </div>
  `;

  // Mevcut kartlara tıklama
  container.querySelectorAll('.dict-card').forEach(card => {
    card.addEventListener('mouseenter', () => card.style.transform = 'translateY(-5px)');
    card.addEventListener('mouseleave', () => card.style.transform = 'translateY(0)');
    card.addEventListener('click', () => {
      const topicId = card.getAttribute('data-id');
      const topic = allDicts.find(d => d.id === topicId);
      if(topic) renderVisualDictionaryMap(container, topic);
    });
  });

  // Yeni Sözlük Ekleme Ekranına Geçiş
  document.getElementById('btnAddNewDict').addEventListener('click', () => {
    renderDictionaryBuilder(container);
  });

  document.getElementById('closeDictMenu').addEventListener('click', () => {
    const overlay = document.getElementById('gameOverlay');
    if (overlay) overlay.style.display = 'none';
    container.innerHTML = '';
    if(window.speechSynthesis) window.speechSynthesis.cancel();
  });
}

// ═══════════════════════════════════════════
// SÖZLÜK OLUŞTURUCU (BUILDER) SİSTEMİ
// ═══════════════════════════════════════════
function renderDictionaryBuilder(container) {
  let tempHotspots = [];
  let currentImageUrl = "";

  container.innerHTML = `
    <div style="padding: 20px; text-align: center; height: 100%; overflow-y: auto;">
       <h2 style="color: var(--acc2);">🛠️ Sözlük Oluşturucu</h2>
       
       <div id="builderStep1" style="max-width: 500px; margin: 0 auto; background: rgba(0,0,0,0.2); padding: 20px; border-radius: 12px;">
         <div style="margin-bottom: 15px; text-align: left;">
           <label>Sözlük Başlığı (Örn: Arabamın Parçaları)</label>
           <input type="text" id="bTitle" class="v18-input" style="width: 100%; margin-top: 5px;">
         </div>
         <div style="margin-bottom: 15px; text-align: left;">
           <label>Resim Linki (İnternetten bir resim linki yapıştırın)</label>
           <input type="text" id="bImage" class="v18-input" placeholder="https://..." style="width: 100%; margin-top: 5px;">
         </div>
         <button id="bNext" class="chip v18-btn" style="width: 100%; background: var(--primary);">Resmi Yükle ve Etiketle ➡️</button>
         <br><br>
         <button id="bCancel" class="chip v18-btn" style="background: var(--bdr);">İptal</button>
       </div>

       <div id="builderStep2" style="display: none; height: calc(100% - 60px); flex-direction: column;">
         <p style="color: #4ade80;">Resme tıklayarak etiket ekleyin!</p>
         <div style="flex: 1; position: relative; background: #000; border-radius: 12px; overflow: hidden; display: flex; justify-content: center; align-items: center;" id="bImageContainer">
            <img id="bTargetImage" style="max-width: 100%; max-height: 100%; object-fit: contain; cursor: crosshair;">
            <div id="builderMarkersContainer"></div>
         </div>
         <div style="margin-top: 15px; display: flex; justify-content: space-between;">
           <button id="bCancel2" class="v18-btn" style="background: var(--bdr);">İptal</button>
           <button id="bSave" class="v18-btn" style="background: var(--acc2); font-weight: bold;">Sözlüğü Kaydet ✅</button>
         </div>
       </div>
    </div>
  `;

  document.getElementById('bCancel').addEventListener('click', () => renderVisualDictionaryMenu(container));
  document.getElementById('bCancel2').addEventListener('click', () => renderVisualDictionaryMenu(container));

  document.getElementById('bNext').addEventListener('click', () => {
    const title = document.getElementById('bTitle').value.trim();
    const imageUri = document.getElementById('bImage').value.trim();
    if (!title || !imageUri) return alert("Lütfen başlık ve resim linki girin.");
    
    currentImageUrl = imageUri;
    document.getElementById('builderStep1').style.display = 'none';
    const step2 = document.getElementById('builderStep2');
    step2.style.display = 'flex';
    
    const imgEl = document.getElementById('bTargetImage');
    imgEl.src = imageUri;

    // Etiket ekleme zekası
    imgEl.addEventListener('click', (e) => {
      // Resmin render edilen boyutları üzerinden % hesapla
      const rect = imgEl.getBoundingClientRect();
      const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
      const yPercent = ((e.clientY - rect.top) / rect.height) * 100;
      
      const labelName = prompt("Bu noktanın İngilizce adı nedir?");
      if (labelName && labelName.trim() !== "") {
         tempHotspots.push({ x: xPercent, y: yPercent, label: labelName.trim() });
         renderBuilderMarkers();
      }
    });

    function renderBuilderMarkers() {
      const markersBox = document.getElementById('builderMarkersContainer');
      markersBox.innerHTML = '';
      tempHotspots.forEach(pt => {
         markersBox.innerHTML += `<div style="position:absolute; left:${pt.x}%; top:${pt.y}%; width:15px; height:15px; background:red; border-radius:50%; border:2px solid white; transform:translate(-50%,-50%);" title="${pt.label}"></div>`;
      });
    }
  });

  document.getElementById('bSave').addEventListener('click', () => {
    const title = document.getElementById('bTitle').value.trim();
    if (tempHotspots.length === 0) return alert("Lütfen resme tıklayarak en az 1 etiket ekleyin!");
    
    saveCustomDictionary({
      id: "custom_" + Date.now(),
      title: "✨ " + title,
      image_url: currentImageUrl,
      hotspots: tempHotspots
    });
    
    renderVisualDictionaryMenu(container); // Geri dön
  });
}

// ═══════════════════════════════════════════
// HARİTA GÖSTERİM SİSTEMİ
// ═══════════════════════════════════════════
function renderVisualDictionaryMap(container, topic) {
  container.innerHTML = `
    <div style="display: flex; flex-direction: column; height: 100%; width: 100%; padding: 10px; box-sizing: border-box;">
       <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; padding: 0 10px;">
         <h2 style="margin:0; font-size: 1.5rem; text-shadow: 1px 1px 3px rgba(0,0,0,0.5);">${topic.title}</h2>
         <button id="backToDictMenu" style="padding: 8px 16px; border-radius: 8px; background: var(--primary); color: white; border: none; cursor: pointer;">⬅️ Geri Dön</button>
       </div>
       
       <div style="flex: 1; display:flex; justify-content:center; align-items:center; overflow:hidden; position:relative; background: #000; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
         <div class="visual-dict-container" style="position: relative; max-width: 100%; max-height: 100%; display: inline-block;">
            <img src="${topic.image_url}" onerror="this.src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png'" style="max-width: 100%; max-height: calc(100vh - 120px); object-fit: contain; display: block; border-radius: 8px;">
            ${topic.hotspots.map((point) => `
              <div class="dict-hotspot pulse-white" data-label="${point.label}" style="left: ${point.x}%; top: ${point.y}%;"></div>
            `).join('')}
         </div>
       </div>
    </div>
  `;

  if(!document.getElementById('dictTooltip')) {
    const tooltip = document.createElement('div');
    tooltip.id = 'dictTooltip';
    tooltip.className = 'dict-tooltip';
    document.body.appendChild(tooltip);
    activeTooltip = tooltip;
  } else {
    activeTooltip = document.getElementById('dictTooltip');
  }

  document.getElementById('backToDictMenu').addEventListener('click', () => {
    if(activeTooltip) activeTooltip.style.opacity = '0';
    if(window.speechSynthesis) window.speechSynthesis.cancel();
    renderVisualDictionaryMenu(container);
  });

  const hotspots = container.querySelectorAll('.dict-hotspot');
  
  hotspots.forEach(hotspot => {
    hotspot.addEventListener('mouseenter', (e) => {
      const label = hotspot.getAttribute('data-label');
      
      if(activeTooltip) {
         activeTooltip.textContent = label;
         activeTooltip.style.opacity = '1';
         const rect = hotspot.getBoundingClientRect();
         activeTooltip.style.left = (rect.left + 30) + 'px';
         activeTooltip.style.top = (rect.top - 10) + 'px';
      }

      speakWord(label);
      
      hotspot.style.transform = 'translate(-50%, -50%) scale(1.5)';
      hotspot.style.background = 'rgba(74, 222, 128, 0.6)';
    });

    hotspot.addEventListener('mouseleave', () => {
      if(activeTooltip) activeTooltip.style.opacity = '0';
      hotspot.style.transform = 'translate(-50%, -50%) scale(1)';
      hotspot.style.background = 'rgba(255, 255, 255, 0.4)';
    });
  });
}

function speakWord(text) {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }
}
