# Ata Ortaokulu Eğitim Asistanı

Ata Ortaokulu öğrencileri için özel olarak geliştirilmiş, güvenli ve yapay zeka (Gemini & Imagen) destekli interaktif bir eğitim asistanıdır. Öğrencilerin akademik başarılarını artırmayı hedeflerken, oyunlarla öğrenmeyi destekler ve zihinsel molalar verdirir.

## Özellikler

- **Çoklu Öğrenme Modları:** Normal, Ders, Quiz ve Yaratıcı modları ile amaca yönelik rehberlik sağlar.
- **Akıllı Quiz Motoru (Ata Sınav):** LGS ve YKS müfredatlarına uygun olarak seçilen konuya, yaş grubuna ve zorluk derecesine göre interaktif anlık sınavlar öğretir.
- **Sektörel İyileştirmeler:** Yanlış yapılan sorulara göre yapay zeka özel konu özetleri önerir. Sınav geçmişi localStorage üzerinde saklanır.
- **Oyun ve Etkinlik Merkezi:** Zihinsel zindeliği sağlamak için `Düello Arenası`, `Hafıza Oyunu`, `Sudoku`, `Uzay Macerası` gibi onlarca oyun barındırır.
- **XP ve Rozet Sistemi:** Düzenli olarak quiz çözen ve platformu kullanan öğrencilere motivasyon verici rozetler ve günlük seriler dağıtır.
- **Metin Seslendirme (TTS):** Gelen yanıtların tamamı tek tıklamayla Türkçe sesli okunabilir.
- **Veliler İçin Rapor:** Öğrencinin harcadığı mesaj ve çözdüğü sorular analiz edilerek veli rapor ekranında puan durumu gösterilir.

## Kurulum ve Çalıştırma

Proje istemci (istemci kod dosyaları) ve sunucu (Cloudflare Worker Proxy API anahtarı) içerir.

1. **Bağımlılıkları Yükleyin:**
   ```bash
   npm install
   ```

2. **Cloudflare Worker Deploy (İsteğe Bağlı):**
   Uygulamanın ana API istekleri Cloudflare Worker üzerinden geçer.
   Eğer kendi Worker'ınızı oluşturmak istiyorsanız:
   ```bash
   cd cloudflare-worker
   # API anahtarınızı ekleyin
   npx wrangler secret put GEMINI_API_KEY
   # Uygulamayı Cloudflare altyapısına yükleyin
   npx wrangler deploy
   ```

3. **Geliştirme Ortamını Çalıştırın:**
   ```bash
   npm run dev
   ```

## Güvenlik
Arama filtreleri ve *DOMPurify* sayesinde zararlı HTML çıktıları engellenmiştir. Öğrencilerin küfür ve uygunsuz içerikler barındıran talepleri *isAllowedOrigin* ile doğrulanarak sadece güvenli adresiyle hizmet verilmektedir.
