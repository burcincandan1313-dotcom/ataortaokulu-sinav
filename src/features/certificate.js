export class CertificateSystem {
  constructor() {
    this.awarded = localStorage.getItem('ata_mega_certificate') === 'true';
    this.userName = localStorage.getItem('ata_student_name') || 'Mükemmel Öğrenci';
  }

  checkLevel(level) {
    if (level >= 5 && !this.awarded) {
      this.awarded = true;
      localStorage.setItem('ata_mega_certificate', 'true');
      this.showCertificate();
    }
  }

  showCertificate() {
    const overlay = document.createElement('div');
    overlay.className = 'dom-overlay';
    overlay.style.display = 'flex';
    overlay.style.zIndex = '999999';
    overlay.style.background = 'rgba(0,0,0,0.85)';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';

    const dateStr = new Date().toLocaleDateString('tr-TR');

    overlay.innerHTML = `
      <div style="position: relative; width: 90%; max-width: 800px; padding: 40px; background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%); border: 15px solid #d4af37; border-image: repeating-linear-gradient(45deg, #d4af37, #f3e5ab 10px, #d4af37 20px) 15; box-shadow: 0 0 50px rgba(212,175,55,0.5); text-align: center; font-family: 'Georgia', serif; color: #111;">
        
        <button id="certClose" style="position: absolute; right: 20px; top: 20px; background: transparent; border: none; font-size: 2rem; color: #555; cursor: pointer;">✖</button>

        <div style="font-size: 4rem; margin-bottom: 10px;">🎓</div>
        <h1 style="color: #d4af37; font-size: 3rem; margin: 0; text-transform: uppercase; letter-spacing: 5px; text-shadow: 1px 1px 2px rgba(0,0,0,0.2);">Üstün Başarı Belgesi</h1>
        
        <hr style="border: 0; height: 2px; background: #d4af37; margin: 30px auto; width: 60%;">

        <p style="font-size: 1.5rem; color: #444; font-style: italic;">Bu belge,</p>
        <h2 style="font-size: 3.5rem; color: #1e293b; margin: 20px 0; border-bottom: 2px dashed #94a3b8; display: inline-block; padding-bottom: 10px;">${this.userName}</h2>
        <p style="font-size: 1.5rem; color: #444; line-height: 1.6; padding: 0 20px;">
           adlı öğrenciye, <strong>Ata Ortaokulu Eğitim Asistanı</strong> sisteminde gösterdiği olağanüstü performans, çözdüğü yüzlerce soru ve <strong>"Efsanevi Öğrenci"</strong> unvanına ulaşması nedeniyle gururla takdim edilmiştir.
        </p>

        <div style="display: flex; justify-content: space-between; margin-top: 50px; padding: 0 50px; align-items: flex-end;">
           <div style="text-align: center;">
              <div style="font-size: 1.2rem; font-weight: bold; border-bottom: 1px solid #000; width: 150px; margin-bottom: 10px;">${dateStr}</div>
              <div style="color: #555;">Tarih</div>
           </div>
           
           <div style="text-align: center;">
              <div style="font-size: 4rem; color: #d4af37; filter: drop-shadow(0px 4px 4px rgba(0,0,0,0.3));">🎖️</div>
           </div>

           <div style="text-align: center;">
              <div style="font-size: 2rem; font-family: 'Brush Script MT', cursive; border-bottom: 1px solid #000; width: 150px; margin-bottom: 5px;">Ata Core AI</div>
              <div style="color: #555;">Yapay Zeka Mentor</div>
           </div>
        </div>

        <button id="certPrint" style="margin-top: 40px; background: #d4af37; color: #fff; padding: 15px 30px; font-size: 1.2rem; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; box-shadow: 0 4px 6px rgba(212,175,55,0.3); transition: all 0.3s;" onmouseover="this.style.background='#b3932e'" onmouseout="this.style.background='#d4af37'">🖨️ Sertifikayı PDF Olarak Kaydet / Yazdır</button>

      </div>
    `;

    document.body.appendChild(this.overlay);

    document.getElementById('certClose').addEventListener('click', () => {
      if(this.overlay && this.overlay.parentNode) this.overlay.parentNode.removeChild(this.overlay);
    });

    document.getElementById('certPrint').addEventListener('click', () => {
       const btn = document.getElementById('certPrint');
       const close = document.getElementById('certClose');
       btn.style.display = 'none';
       close.style.display = 'none';
       
       const content = this.overlay.innerHTML;
       const win = window.open('', '', 'width=900,height=700');
       win.document.write('<html><head><title>Ata_Sertifika</title></head><body style="margin:0; padding:0; display:flex; justify-content:center; align-items:center; height:100vh; background:#fff;">');
       win.document.write(content);
       win.document.write('</body></html>');
       win.document.close();
       
       win.onload = () => {
         win.print();
         btn.style.display = 'inline-block';
         close.style.display = 'inline-block';
       };
    });

    if(window.triggerConfetti) window.triggerConfetti();
  }
}

export const certSystem = new CertificateSystem();
