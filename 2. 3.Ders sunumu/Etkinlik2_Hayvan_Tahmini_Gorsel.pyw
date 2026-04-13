import tkinter as tk
from tkinter import ttk, messagebox, simpledialog
import json
import os

VERITABANI_DOSYASI = "hayvan_agaci.json"

# Emoji Sözlüğü (Resim niyetine)
EMOJILER = {
    "kedi": "🐈", "köpek": "🐕", "aslan": "🦁", "kaplan": "🐅", "ayı": "🐻",
    "maymun": "🐒", "insan": "🧑", "inek": "🐄", "koyun": "🐑", "keçi": "🐐",
    "at": "🐎", "fil": "🐘", "zürafa": "🦒", "kanguru": "🦘", "tavşan": "🐇",
    "fare": "🐁", "yarasa": "🦇", "balina": "🐳", "yunus": "🐬", "kartal": "🦅",
    "baykuş": "🦉", "güvercin": "🕊️", "tavuk": "🐔", "devekuşu": "🦤", "penguen": "🐧",
    "yılan": "🐍", "kertenkele": "🦎", "timsah": "🐊", "kurbağa": "🐸", "köpekbalığı": "🦈",
    "örümcek": "🕷️", "arı": "🐝", "sinek": "🪰", "karınca": "🐜", "domuz": "🐖",
    "geyik": "🦌", "kurt": "🐺", "tílki": "🦊", "koala": "🐨", "panda": "🐼"
}

def get_emoji(hayvan_adi):
    adi = hayvan_adi.lower().strip()
    return EMOJILER.get(adi, "🐾") # Bulamazsa pati resmi

# Başlangıç Ağacı (Soru ise 'soru' ve 'evet'/'hayir' dalları var, Yaprak ise sadece 'hayvan')
BASLANGIC_AGACI = {
    "soru": "Kanatları var mı? (Uçabiliyor mu?)",
    "evet": {
        "soru": "Kuş türü müdür?",
        "evet": {
            "soru": "Gece mi avlanır?",
            "evet": {"hayvan": "Baykuş"},
            "hayir": {"hayvan": "Kartal"}
        },
        "hayir": {
            "soru": "Memeli midir? (Yavrusunu sütle besler mi?)",
            "evet": {"hayvan": "Yarasa"},
            "hayir": {"hayvan": "Arı"}
        }
    },
    "hayir": {
        "soru": "Suda veya su altında mı yaşar?",
        "evet": {
            "soru": "Memeli midir?",
            "evet": {"hayvan": "Yunus"},
            "hayir": {"hayvan": "Köpekbalığı"}
        },
        "hayir": {
            "soru": "Evcil midir? (Evde/Çiftlikte beslenir mi?)",
            "evet": {
                "soru": "Miyavlar mı?",
                "evet": {"hayvan": "Kedi"},
                "hayir": {"hayvan": "Köpek"}
            },
            "hayir": {
                "soru": "Büyük boynuzları var mıdır?",
                "evet": {"hayvan": "Geyik"},
                "hayir": {"hayvan": "Aslan"}
            }
        }
    }
}

class OgrenenYapayZekaOyunu:
    def __init__(self, root):
        self.root = root
        self.root.title("🐾 Öğrenen Yapay Zeka: Sınırsız Hayvan")
        self.root.geometry("800x650")
        self.root.configure(bg="#0f172a")
        
        style = ttk.Style()
        style.theme_use('clam')
        style.configure("TButton", font=("Segoe UI", 12, "bold"), padding=10)
        style.configure("Evet.TButton", background="#10b981", foreground="white")
        style.map("Evet.TButton", background=[("active", "#059669")])
        style.configure("Hayir.TButton", background="#ef4444", foreground="white")
        style.map("Hayir.TButton", background=[("active", "#dc2626")])
        
        # Başlık
        ttk.Label(self.root, text="Yapay Zeka Karar Ağacı", font=("Segoe UI", 24, "bold"), background="#0f172a", foreground="#38bdf8").pack(pady=15)
        
        self.info_label = tk.Label(self.root, text="Ben öğrenebilen bir yapay zekayım. 2000'den fazla hayvanı bana öğretebilirsin!", bg="#0f172a", fg="#94a3b8", font=("Segoe UI", 11))
        self.info_label.pack(pady=5)
        
        # Resim / Emoji Alanı
        self.resim_label = tk.Label(self.root, text="🧠", bg="#0f172a", fg="white", font=("Segoe UI", 70))
        self.resim_label.pack(pady=10)
        
        self.q_frame = tk.Frame(self.root, bg="#1e293b", bd=2, relief="ridge")
        self.q_frame.pack(pady=10, padx=40, fill="both", expand=True)
        
        self.soru_label = tk.Label(self.q_frame, text="Sistem Yükleniyor...", bg="#1e293b", fg="white", font=("Segoe UI", 18, "bold"), wraplength=600, height=3)
        self.soru_label.pack(pady=20)
        
        self.btn_frame = tk.Frame(self.root, bg="#0f172a")
        self.btn_frame.pack(pady=20)
        
        self.btn_evet = ttk.Button(self.btn_frame, text="✅ EVET", style="Evet.TButton", command=lambda: self.cevap_ver("evet"))
        self.btn_evet.grid(row=0, column=0, padx=20, ipadx=10)
        
        self.btn_hayir = ttk.Button(self.btn_frame, text="❌ HAYIR", style="Hayir.TButton", command=lambda: self.cevap_ver("hayir"))
        self.btn_hayir.grid(row=0, column=1, padx=20, ipadx=10)
        
        self.btn_basla = ttk.Button(self.root, text="🚀 Oyuna Başla", command=self.oyunu_baslat)
        
        self.btn_tekrar = ttk.Button(self.root, text="🔄 Yeniden Oyna", command=self.hazirlik_yap)
        
        self.veritabanini_yukle()
        self.hazirlik_yap() # Başlangıçta soru sormak için

    def veritabanini_yukle(self):
        if os.path.exists(VERITABANI_DOSYASI):
            try:
                with open(VERITABANI_DOSYASI, "r", encoding="utf-8") as f:
                    self.agac = json.load(f)
            except:
                self.agac = BASLANGIC_AGACI
        else:
            self.agac = BASLANGIC_AGACI

    def veritabanini_kaydet(self):
        with open(VERITABANI_DOSYASI, "w", encoding="utf-8") as f:
            json.dump(self.agac, f, ensure_ascii=False, indent=4)

    def count_animals(self, node):
        if "hayvan" in node: return 1
        return self.count_animals(node["evet"]) + self.count_animals(node["hayir"])

    def hazirlik_yap(self):
        self.btn_frame.pack_forget()
        self.btn_tekrar.pack_forget()
        self.resim_label.config(text="🤔")
        self.soru_label.config(text="Aklından bir hayvan tuttuğuna emin misin?\n(Tuttuğunda BAŞLA butonuna tıkla)", fg="#fde047")
        self.info_label.config(text=f"Şu an hafızamda {self.count_animals(self.agac)} hayvan var. Hedef 2000! 🚀")
        self.btn_basla.pack(pady=20)

    def oyunu_baslat(self):
        self.btn_basla.pack_forget()
        self.btn_frame.pack(pady=20)
        self.suanki_dugum = self.agac
        self.eski_dugum = None
        self.son_cevap = None
        self.siradaki_soruyu_sor()

    def siradaki_soruyu_sor(self):
        if "soru" in self.suanki_dugum:
            self.resim_label.config(text="❓")
            self.soru_label.config(text=self.suanki_dugum["soru"], fg="white")
        else:
            hayvan = self.suanki_dugum["hayvan"]
            self.resim_label.config(text=get_emoji(hayvan))
            self.soru_label.config(text=f"Tahmin Ediyorum!!!\nTuttuğun hayvan bir {hayvan.upper()} mi?", fg="#cbd5e1")
            
    def cevap_ver(self, cevap):
        if "soru" in self.suanki_dugum:
            self.eski_dugum = self.suanki_dugum
            self.son_cevap = cevap
            self.suanki_dugum = self.suanki_dugum[cevap]
            self.siradaki_soruyu_sor()
        else:
            # Tahmin aşaması (Yaprak düğüm)
            if cevap == "evet":
                self.resim_label.config(text="🎉")
                self.soru_label.config(text=f"YAŞASIN! Yine bildim!\nBenim adım Yapay Zeka 😎", fg="#4ade80")
                self.btn_frame.pack_forget()
                self.btn_tekrar.pack(pady=20)
            else:
                self.ogrenme_asamasi()

    def ogrenme_asamasi(self):
        self.btn_frame.pack_forget()
        self.resim_label.config(text="📝")
        eski_hayvan = self.suanki_dugum["hayvan"]
        
        self.soru_label.config(text=f"Tüh, bilemedim! Peki senin tuttuğun hayvan neydi?", fg="#f87171")
        
        yeni_hayvan = simpledialog.askstring("Yapay Zeka Öğreniyor", "Aklındaki hayvanın adı neydi?", parent=self.root)
        if not yeni_hayvan:
            self.btn_tekrar.pack(pady=20)
            return
            
        yeni_hayvan = yeni_hayvan.strip().capitalize()
        
        yeni_soru = simpledialog.askstring("Bana Öğret", 
            f"Lütfen {yeni_hayvan} ile {eski_hayvan} arasındaki farkı ayırt edebileceğim EVET veya HAYIR cevaplı bir soru yaz.\n\nÖrnek: Suda yaşar mı?", parent=self.root)
            
        if not yeni_soru:
            self.btn_tekrar.pack(pady=20)
            return
            
        if not yeni_soru.endswith("?"):
            yeni_soru += "?"
            
        yeni_cevap = messagebox.askyesno("Cevap Nedir?", f"{yeni_hayvan} için bu sorunun cevabı EVET mi yoksa HAYIR mı?", parent=self.root)
        
        # Ağacı Güncelle (Öğrenme)
        self.suanki_dugum.clear()
        self.suanki_dugum["soru"] = yeni_soru
        if yeni_cevap: # Yeni hayvan EVET ise
            self.suanki_dugum["evet"] = {"hayvan": yeni_hayvan}
            self.suanki_dugum["hayir"] = {"hayvan": eski_hayvan}
        else:
            self.suanki_dugum["hayir"] = {"hayvan": yeni_hayvan}
            self.suanki_dugum["evet"] = {"hayvan": eski_hayvan}
            
        self.veritabanini_kaydet()
        
        self.soru_label.config(text=f"Harika! Teşekkür Ederim.\nSayende yeni bir hayvan öğrendim: {yeni_hayvan} {get_emoji(yeni_hayvan)}\n\nArtık 2000 olma yolunda 1 adım daha akıllıyım!", fg="#38bdf8")
        self.resim_label.config(text="📈")
        self.btn_tekrar.pack(pady=20)

if __name__ == "__main__":
    root = tk.Tk()
    app = OgrenenYapayZekaOyunu(root)
    root.eval('tk::PlaceWindow . center')
    root.mainloop()
