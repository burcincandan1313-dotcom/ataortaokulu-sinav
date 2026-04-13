"""
🍎🍐 Yapay Zeka Makine Öğrenimi Simülatörü — Python Gelişmiş Versiyon
Görsel Makine Öğrenimi: Elma mı, Armut mu?

Teknoloji: Python 3 + tkinter (Canvas tabanlı interaktif çizim)
6. Sınıf Eğitim Materyali — Yapay Zeka Nasıl Öğrenir?
"""

import tkinter as tk
from tkinter import ttk, font as tkfont
import math
import random
import colorsys

# ============================================
# RENK PALETİ (Koyu Tema)
# ============================================
COLORS = {
    'bg': '#0f172a',
    'panel': '#1e293b',
    'panel_dark': '#0d1117',
    'canvas_bg': '#1e1b4b',
    'text': '#f8fafc',
    'text_dim': '#94a3b8',
    'text_sub': '#cbd5e1',
    'elma': '#ef4444',
    'elma_light': '#fca5a5',
    'elma_glow': '#7f1d1d',
    'armut': '#10b981',
    'armut_light': '#6ee7b7',
    'armut_glow': '#064e3b',
    'test': '#f59e0b',
    'test_light': '#fde047',
    'accent': '#38bdf8',
    'accent2': '#8b5cf6',
    'border': '#334155',
    'border_light': '#475569',
    'success': '#4ade80',
    'warning': '#fbbf24',
    'danger': '#f87171',
    'gradient1': '#3b82f6',
    'gradient2': '#ec4899',
}


class GradientFrame(tk.Canvas):
    """Gradient arka planlı panel bileşeni."""
    def __init__(self, parent, color1, color2, **kwargs):
        super().__init__(parent, highlightthickness=0, **kwargs)
        self.color1 = color1
        self.color2 = color2
        self.bind('<Configure>', self._draw_gradient)

    def _draw_gradient(self, event=None):
        self.delete('gradient')
        w = self.winfo_width()
        h = self.winfo_height()
        r1, g1, b1 = self.winfo_rgb(self.color1)
        r2, g2, b2 = self.winfo_rgb(self.color2)
        steps = max(h, 1)
        for i in range(steps):
            r = int(r1 + (r2 - r1) * i / steps) >> 8
            g = int(g1 + (g2 - g1) * i / steps) >> 8
            b = int(b1 + (b2 - b1) * i / steps) >> 8
            color = f'#{r:02x}{g:02x}{b:02x}'
            self.create_line(0, i, w, i, fill=color, tags='gradient')
        self.tag_lower('gradient')


class MakineOgrenimiSimulator:
    """Ana simülatör sınıfı — Tüm işi yönetir."""

    def __init__(self, root):
        self.root = root
        self.root.title("🍎🍐 Görsel Makine Öğrenimi Simülatörü — Python")
        self.root.geometry("1200x750")
        self.root.minsize(1000, 650)
        self.root.configure(bg=COLORS['bg'])

        # Durum
        self.mode = 'elma'  # 'elma', 'armut', 'test'
        self.elmalar = []
        self.armutlar = []
        self.testler = []
        self.pulse_phase = 0
        self.glow_items = []

        # Font tanımları
        self.font_title = tkfont.Font(family='Segoe UI', size=20, weight='bold')
        self.font_subtitle = tkfont.Font(family='Segoe UI', size=11)
        self.font_button = tkfont.Font(family='Segoe UI', size=11, weight='bold')
        self.font_small = tkfont.Font(family='Segoe UI', size=9)
        self.font_large = tkfont.Font(family='Segoe UI', size=14, weight='bold')
        self.font_status = tkfont.Font(family='Segoe UI', size=10)
        self.font_canvas = tkfont.Font(family='Segoe UI', size=9)
        self.font_stat_big = tkfont.Font(family='Segoe UI', size=22, weight='bold')

        self._build_ui()
        self._animate_pulse()

    def _build_ui(self):
        """Tüm arayüzü oluşturur."""

        # === ÜST BAŞLIK BARI ===
        header = tk.Frame(self.root, bg=COLORS['panel_dark'], height=70)
        header.pack(fill='x', side='top')
        header.pack_propagate(False)

        header_inner = tk.Frame(header, bg=COLORS['panel_dark'])
        header_inner.pack(fill='both', expand=True, padx=20, pady=8)

        tk.Label(
            header_inner,
            text="🧠 Görsel Makine Öğrenimi (AI) — Python Simülatörü",
            font=self.font_title,
            fg=COLORS['accent'],
            bg=COLORS['panel_dark']
        ).pack(side='left')

        tk.Label(
            header_inner,
            text="\"Yapay Zeka Nasıl Öğrenir?\"",
            font=self.font_subtitle,
            fg=COLORS['accent'],
            bg=COLORS['panel_dark']
        ).pack(side='right')

        # === ANA ALAN (Sol Panel + Canvas) ===
        main = tk.Frame(self.root, bg=COLORS['bg'])
        main.pack(fill='both', expand=True, padx=10, pady=10)

        # --- SOL PANEL ---
        self.sidebar = tk.Frame(main, bg=COLORS['panel'], width=310, relief='flat')
        self.sidebar.pack(side='left', fill='y', padx=(0, 10))
        self.sidebar.pack_propagate(False)

        sidebar_inner = tk.Frame(self.sidebar, bg=COLORS['panel'])
        sidebar_inner.pack(fill='both', expand=True, padx=15, pady=15)

        # Adım 1 Başlığı
        tk.Label(
            sidebar_inner, text="1️⃣  Eğitim Verisi Ekle",
            font=self.font_large, fg=COLORS['text'], bg=COLORS['panel'],
            anchor='w'
        ).pack(fill='x', pady=(0, 5))

        tk.Label(
            sidebar_inner,
            text="Bir meyve türü seç ve yandaki alana\ntıklayarak verileri gir:",
            font=self.font_small, fg=COLORS['text_dim'], bg=COLORS['panel'],
            anchor='w', justify='left'
        ).pack(fill='x', pady=(0, 12))

        # Elma Butonu
        self.btn_elma = self._create_tool_button(
            sidebar_inner, "🍎", "Elma Verisi (Kırmızı)",
            "Eklemek için seç + tıkla",
            COLORS['elma'], 'elma'
        )

        # Armut Butonu
        self.btn_armut = self._create_tool_button(
            sidebar_inner, "🍐", "Armut Verisi (Yeşil)",
            "Eklemek için seç + tıkla",
            COLORS['armut'], 'armut'
        )

        # Adım 2 Başlığı
        ttk.Separator(sidebar_inner).pack(fill='x', pady=12)

        tk.Label(
            sidebar_inner, text="2️⃣  Öğrenmeyi Test Et",
            font=self.font_large, fg=COLORS['text'], bg=COLORS['panel'],
            anchor='w'
        ).pack(fill='x', pady=(0, 8))

        # Test Butonu
        self.btn_test = self._create_tool_button(
            sidebar_inner, "🎯", "Gizemli Meyve Ver",
            "YZ öğrendiğini tahmin etsin",
            COLORS['test'], 'test'
        )

        # Temizle
        clear_btn = tk.Button(
            sidebar_inner, text="🗑  Hafızayı Sıfırla (Bebek AI)",
            font=self.font_small,
            fg=COLORS['danger'], bg=COLORS['panel'],
            activeforeground=COLORS['danger'],
            activebackground=COLORS['panel_dark'],
            bd=1, relief='solid',
            highlightbackground=COLORS['danger'],
            cursor='hand2',
            command=self._clear_data
        )
        clear_btn.pack(fill='x', pady=(12, 0), ipady=6)

        # Durum Paneli
        ttk.Separator(sidebar_inner).pack(fill='x', pady=12)

        status_frame = tk.Frame(sidebar_inner, bg=COLORS['panel_dark'], relief='flat')
        status_frame.pack(fill='x', pady=(0, 5))

        tk.Label(
            status_frame, text="🤖  Yapay Zeka Beyni",
            font=self.font_button, fg=COLORS['success'], bg=COLORS['panel_dark'],
            anchor='w'
        ).pack(fill='x', padx=12, pady=(12, 6))

        # İstatistik Kutuları
        stat_row = tk.Frame(status_frame, bg=COLORS['panel_dark'])
        stat_row.pack(fill='x', padx=12, pady=(0, 4))

        self.elma_count_label = self._create_stat_card(stat_row, "🍎 Elma", "0", COLORS['elma'], 'left')
        self.armut_count_label = self._create_stat_card(stat_row, "🍐 Armut", "0", COLORS['armut'], 'right')

        # Doğruluk oranı
        self.accuracy_frame = tk.Frame(status_frame, bg=COLORS['panel_dark'])
        self.accuracy_frame.pack(fill='x', padx=12, pady=(4, 4))

        tk.Label(
            self.accuracy_frame, text="📊 Toplam Veri:", font=self.font_small,
            fg=COLORS['text_sub'], bg=COLORS['panel_dark'], anchor='w'
        ).pack(side='left')
        self.total_label = tk.Label(
            self.accuracy_frame, text="0", font=self.font_button,
            fg=COLORS['warning'], bg=COLORS['panel_dark'], anchor='e'
        )
        self.total_label.pack(side='right')

        # Yapay Zeka sözü
        ttk.Separator(status_frame).pack(fill='x', padx=12, pady=4)
        self.ai_log = tk.Label(
            status_frame,
            text="\"Ben daha bir bebeğim.\nÖğrenmek için bana veri lazım!\"",
            font=self.font_status, fg=COLORS['warning'], bg=COLORS['panel_dark'],
            anchor='w', justify='left', wraplength=260
        )
        self.ai_log.pack(fill='x', padx=12, pady=(5, 12))

        # --- CANVAS ALANI ---
        canvas_frame = tk.Frame(main, bg=COLORS['canvas_bg'], relief='flat', bd=2)
        canvas_frame.pack(side='left', fill='both', expand=True)

        # Eksen Etiketleri
        self.canvas = tk.Canvas(
            canvas_frame, bg=COLORS['canvas_bg'],
            highlightthickness=0, cursor='crosshair'
        )
        self.canvas.pack(fill='both', expand=True)
        self.canvas.bind('<Button-1>', self._canvas_click)
        self.canvas.bind('<Configure>', self._canvas_resize)
        self.canvas.bind('<Motion>', self._canvas_motion)

        # Tooltip
        self.tooltip_id = None
        self.tooltip_text = None

        # İlk mod ayarla
        self._set_mode('elma')

    def _create_stat_card(self, parent, label, value, color, side):
        """İstatistik kart bileşeni oluşturur."""
        card = tk.Frame(parent, bg=COLORS['panel_dark'])
        card.pack(side=side, fill='x', expand=True, padx=2)

        tk.Label(
            card, text=label, font=self.font_small,
            fg=COLORS['text_dim'], bg=COLORS['panel_dark']
        ).pack()

        val_label = tk.Label(
            card, text=value, font=self.font_stat_big,
            fg=color, bg=COLORS['panel_dark']
        )
        val_label.pack()
        return val_label

    def _create_tool_button(self, parent, icon, title, subtitle, color, mode):
        """Sol paneldeki araç butonlarını oluşturur."""
        btn_frame = tk.Frame(
            parent, bg=COLORS['panel_dark'],
            highlightbackground=color if mode == self.mode else COLORS['border'],
            highlightthickness=2,
            cursor='hand2'
        )
        btn_frame.pack(fill='x', pady=4, ipady=8)

        # Sol renk çizgisi
        tk.Frame(btn_frame, bg=color, width=5).pack(side='left', fill='y')

        content = tk.Frame(btn_frame, bg=COLORS['panel_dark'])
        content.pack(side='left', fill='both', expand=True, padx=12, pady=4)

        icon_label = tk.Label(
            content, text=icon, font=tkfont.Font(size=24),
            bg=COLORS['panel_dark']
        )
        icon_label.pack(side='left', padx=(0, 10))

        text_frame = tk.Frame(content, bg=COLORS['panel_dark'])
        text_frame.pack(side='left', fill='x')

        tk.Label(
            text_frame, text=title, font=self.font_button,
            fg=COLORS['text'], bg=COLORS['panel_dark'], anchor='w'
        ).pack(fill='x')

        tk.Label(
            text_frame, text=subtitle, font=self.font_small,
            fg=COLORS['text_dim'], bg=COLORS['panel_dark'], anchor='w'
        ).pack(fill='x')

        # Tüm widget'lara tıklama bağla
        for widget in [btn_frame, content, icon_label, text_frame] + list(text_frame.winfo_children()):
            widget.bind('<Button-1>', lambda e, m=mode: self._set_mode(m))

        return btn_frame

    def _set_mode(self, mode):
        """Aktif modu değiştirir (elma/armut/test)."""
        self.mode = mode
        # Buton vurgularını güncelle
        modes_colors = {
            'elma': (self.btn_elma, COLORS['elma']),
            'armut': (self.btn_armut, COLORS['armut']),
            'test': (self.btn_test, COLORS['test']),
        }
        for m, (btn, color) in modes_colors.items():
            if m == mode:
                btn.configure(highlightbackground=color, highlightthickness=3)
            else:
                btn.configure(highlightbackground=COLORS['border'], highlightthickness=2)

        if mode == 'test':
            self._log_ai("Şimdi test zamanı! Herhangi bir yere tıkla,\nben karar çizgisine göre tahmin edeyim.", COLORS['accent'])
        elif mode == 'elma':
            self._log_ai("🍎 Elma modu seçildi.\nGrafik alanına tıklayarak elma verisi ekle!", COLORS['elma_light'])
        elif mode == 'armut':
            self._log_ai("🍐 Armut modu seçildi.\nGrafik alanına tıklayarak armut verisi ekle!", COLORS['armut_light'])

    def _canvas_click(self, event):
        """Canvas'a tıklanınca çağrılır — Veri noktası ekler."""
        x, y = event.x, event.y

        if self.mode == 'elma':
            self.elmalar.append({'x': x, 'y': y})
            self._log_ai(
                f"Elma #{len(self.elmalar)} eklendi ({x},{y}).\nMerkez hesaplanıyor...",
                COLORS['elma_light']
            )
        elif self.mode == 'armut':
            self.armutlar.append({'x': x, 'y': y})
            self._log_ai(
                f"Armut #{len(self.armutlar)} eklendi ({x},{y}).\nKarar sınırı güncelleniyor!",
                COLORS['armut_light']
            )
        elif self.mode == 'test':
            if not self.elmalar or not self.armutlar:
                self._log_ai(
                    "⚠️ Hata! Test için önce hem Elma\nhem Armut öğretmelisin!",
                    COLORS['danger']
                )
                return
            guess = self._predict(x, y)
            self.testler.append({'x': x, 'y': y, 'guess': guess})
            if guess == 'elma':
                self._log_ai(
                    "🎯 TAHMİNİM: Bu bir ELMA!\n(Nokta kırmızı bölgede kaldı)",
                    COLORS['elma']
                )
            else:
                self._log_ai(
                    "🎯 TAHMİNİM: Bu bir ARMUT!\n(Nokta yeşil bölgede kaldı)",
                    COLORS['armut']
                )

        self._update_stats()
        self._draw()

    def _canvas_motion(self, event):
        """Canvas üzerinde fare hareket ederken koordinatları gösterir."""
        # Eski tooltip'i sil
        if self.tooltip_id:
            self.canvas.delete(self.tooltip_id)
            self.tooltip_id = None
        if self.tooltip_text:
            self.canvas.delete(self.tooltip_text)
            self.tooltip_text = None

        x, y = event.x, event.y
        w = self.canvas.winfo_width()
        h = self.canvas.winfo_height()

        # Normalize (0-100 arası "boyut" ve "tatlılık")
        boyut = int(x / w * 100)
        tatlilik = int((1 - y / h) * 100)

        mode_text = {'elma': '🍎 Elma', 'armut': '🍐 Armut', 'test': '🎯 Test'}
        tip = f"Boyut: {boyut}  Tatlılık: {tatlilik}\nMod: {mode_text.get(self.mode, '')}"

        # Tooltip pozisyonu
        tx = x + 15
        ty = y - 35
        if tx > w - 140:
            tx = x - 150
        if ty < 10:
            ty = y + 20

        self.tooltip_id = self.canvas.create_rectangle(
            tx - 5, ty - 5, tx + 135, ty + 35,
            fill='#000000', stipple='gray75', outline=COLORS['border']
        )
        self.tooltip_text = self.canvas.create_text(
            tx + 5, ty + 2, text=tip,
            fill=COLORS['text'], font=self.font_small, anchor='nw'
        )

    def _canvas_resize(self, event):
        """Canvas boyutu değiştiğinde yeniden çiz."""
        self._draw()

    def _clear_data(self):
        """Tüm verileri sıfırlar."""
        self.elmalar.clear()
        self.armutlar.clear()
        self.testler.clear()
        self._update_stats()
        self._log_ai("Hafızam silindi! 🧹\nYeni verilere ihtiyacım var!", COLORS['warning'])
        self._draw()

    def _predict(self, px, py):
        """Centroid mesafesine göre sınıf tahmini yapar."""
        c_elma = self._get_centroid(self.elmalar)
        c_armut = self._get_centroid(self.armutlar)
        if not c_elma:
            return 'armut'
        if not c_armut:
            return 'elma'

        dist_elma = math.hypot(c_elma[0] - px, c_elma[1] - py)
        dist_armut = math.hypot(c_armut[0] - px, c_armut[1] - py)
        return 'elma' if dist_elma < dist_armut else 'armut'

    def _get_centroid(self, points):
        """Noktaların ağırlık merkezini hesaplar."""
        if not points:
            return None
        sx = sum(p['x'] for p in points)
        sy = sum(p['y'] for p in points)
        n = len(points)
        return (sx / n, sy / n)

    def _update_stats(self):
        """İstatistikleri günceller."""
        self.elma_count_label.configure(text=str(len(self.elmalar)))
        self.armut_count_label.configure(text=str(len(self.armutlar)))
        self.total_label.configure(text=str(len(self.elmalar) + len(self.armutlar)))

        total = len(self.elmalar) + len(self.armutlar)
        if total >= 6:
            self._log_ai(
                f"Veri sayısı: {total} 🎉\nKarar sınırı güçleniyor!",
                COLORS['success']
            )

    def _log_ai(self, msg, color):
        """Yapay Zeka durumu mesajını günceller."""
        self.ai_log.configure(text=f"\"{msg}\"", fg=color)

    def _draw(self):
        """Ana çizim fonksiyonu — Canvas'ı yeniden çizer."""
        self.canvas.delete('drawing')
        w = self.canvas.winfo_width()
        h = self.canvas.winfo_height()

        if w <= 1 or h <= 1:
            return

        c_elma = self._get_centroid(self.elmalar)
        c_armut = self._get_centroid(self.armutlar)

        # Eksen ızgarası (grid)
        self._draw_grid(w, h)

        # Karar bölgeleri ve sınır çizgisi
        if c_elma and c_armut:
            self._draw_decision_regions(w, h, c_elma, c_armut)
            self._draw_decision_boundary(w, h, c_elma, c_armut)
            self._draw_center_line(c_elma, c_armut)
            self._draw_centroid(c_elma, COLORS['elma'], "🍎 Merkez")
            self._draw_centroid(c_armut, COLORS['armut'], "🍐 Merkez")

        # Veri noktaları
        for p in self.elmalar:
            self._draw_data_point(p['x'], p['y'], COLORS['elma'])
        for p in self.armutlar:
            self._draw_data_point(p['x'], p['y'], COLORS['armut'])

        # Test noktaları
        for t in self.testler:
            color = COLORS['elma'] if t['guess'] == 'elma' else COLORS['armut']
            self._draw_test_point(t['x'], t['y'], color, t['guess'])

        # Eksen etiketleri
        self.canvas.create_text(
            w // 2, h - 15,
            text="Daha Büyük ➡ Yüksek Boyut",
            fill='#64748b', font=self.font_small, tags='drawing'
        )
        self.canvas.create_text(
            20, h // 2,
            text="Daha Tatlı ➡\nYüksek Şeker",
            fill='#64748b', font=self.font_small, angle=90, tags='drawing'
        )

    def _draw_grid(self, w, h):
        """Arka plan ızgara çizgilerini çizer."""
        step = 50
        for x in range(0, w, step):
            self.canvas.create_line(
                x, 0, x, h, fill='#1e2a4a', width=1, tags='drawing'
            )
        for y in range(0, h, step):
            self.canvas.create_line(
                0, y, w, y, fill='#1e2a4a', width=1, tags='drawing'
            )

    def _draw_decision_regions(self, w, h, c_elma, c_armut):
        """Karar bölgelerini renkli bloklarla çizer (Voronoi)."""
        res = 25  # Blok boyutu
        mx = (c_elma[0] + c_armut[0]) / 2
        my = (c_elma[1] + c_armut[1]) / 2
        dx = c_armut[0] - c_elma[0]
        dy = c_armut[1] - c_elma[1]

        for x in range(0, w, res):
            for y in range(0, h, res):
                val = (x + res // 2 - mx) * dx + (y + res // 2 - my) * dy
                if val < 0:
                    color = '#2a1520'  # Elma bölgesi (çok hafif kırmızı)
                else:
                    color = '#152a20'  # Armut bölgesi (çok hafif yeşil)
                self.canvas.create_rectangle(
                    x, y, x + res, y + res,
                    fill=color, outline='', tags='drawing'
                )

    def _draw_decision_boundary(self, w, h, c_elma, c_armut):
        """Karar sınırı çizgisini çizer (ortadik)."""
        mx = (c_elma[0] + c_armut[0]) / 2
        my = (c_elma[1] + c_armut[1]) / 2
        dx = c_armut[0] - c_elma[0]
        dy = c_armut[1] - c_elma[1]

        # Dikme vektörü (-dy, dx) — 90 derece döndürülmüş
        length = 2000
        nx = -dy
        ny = dx

        # Normalize et
        mag = math.hypot(nx, ny)
        if mag == 0:
            return
        nx = nx / mag * length
        ny = ny / mag * length

        self.canvas.create_line(
            mx - nx, my - ny, mx + nx, my + ny,
            fill='#ffffff', width=3, dash=(12, 8),
            stipple='gray50', tags='drawing'
        )

        # Sınır etiketi
        self.canvas.create_text(
            mx + 10, my - 15,
            text="⚡ Karar Sınırı",
            fill='#fde047', font=self.font_button, tags='drawing'
        )

    def _draw_center_line(self, c_elma, c_armut):
        """İki merkezi birleştiren çizgiyi çizer."""
        self.canvas.create_line(
            c_elma[0], c_elma[1], c_armut[0], c_armut[1],
            fill='#334155', width=2, dash=(4, 4), tags='drawing'
        )

    def _draw_centroid(self, center, color, label):
        """Merkez noktasını (centroid) hale efekti ile çizer."""
        cx, cy = center

        # Dış hale
        self.canvas.create_oval(
            cx - 25, cy - 25, cx + 25, cy + 25,
            fill='', outline=color, width=2, dash=(3, 3), tags='drawing'
        )

        # İç hale (yarı saydam efekti)
        self.canvas.create_oval(
            cx - 15, cy - 15, cx + 15, cy + 15,
            fill=color, outline='', stipple='gray25', tags='drawing'
        )

        # Merkez nokta
        self.canvas.create_oval(
            cx - 5, cy - 5, cx + 5, cy + 5,
            fill='white', outline=color, width=2, tags='drawing'
        )

        # Etiket
        self.canvas.create_text(
            cx + 30, cy - 8,
            text=label, fill=color, font=self.font_button,
            anchor='w', tags='drawing'
        )

    def _draw_data_point(self, x, y, color):
        """Veri noktasını çizer (eğitim verisi)."""
        r = 8
        # Dış çember
        self.canvas.create_oval(
            x - r, y - r, x + r, y + r,
            fill=color, outline='white', width=2, tags='drawing'
        )

    def _draw_test_point(self, x, y, color, guess):
        """Test tahmin noktasını çizer."""
        # Parlayan soru işareti
        self.canvas.create_text(
            x, y, text="❓", font=tkfont.Font(size=18),
            fill=color, tags='drawing'
        )
        # Alt etiket
        label = "(Elma)" if guess == 'elma' else "(Armut)"
        self.canvas.create_text(
            x, y + 20, text=label, font=self.font_small,
            fill='white', tags='drawing'
        )

    def _animate_pulse(self):
        """Sürekli animasyon döngüsü — Aktif butonun pulse efekti."""
        self.pulse_phase = (self.pulse_phase + 1) % 60
        # Her 50ms'de çalışır
        self.root.after(80, self._animate_pulse)


# ============================================
# UYGULAMA BAŞLATICI
# ============================================
if __name__ == "__main__":
    root = tk.Tk()

    # Windows DPI farkındalığı
    try:
        from ctypes import windll
        windll.shcore.SetProcessDpiAwareness(1)
    except Exception:
        pass

    app = MakineOgrenimiSimulator(root)

    # Pencereyi ekranın ortasına konumla
    root.update_idletasks()
    sw = root.winfo_screenwidth()
    sh = root.winfo_screenheight()
    w = root.winfo_width()
    h = root.winfo_height()
    x = (sw - w) // 2
    y = (sh - h) // 2
    root.geometry(f"+{x}+{y}")

    root.mainloop()
