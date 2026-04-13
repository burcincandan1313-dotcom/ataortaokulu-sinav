# 🚀 Cloudflare Worker — Deploy Rehberi (Gemini Edition)

## Ön Koşullar

- Node.js kurulu olmalı (https://nodejs.org)
- Gemini API key'in hazır olmalı (https://aistudio.google.com)
- Ücretsiz Cloudflare hesabı (https://cloudflare.com)

---

## 1. Wrangler CLI Kur

```bash
npm install -g wrangler
```

## 2. Cloudflare Hesabına Giriş Yap

```bash
wrangler login
```

Tarayıcı açılır → Cloudflare hesabınla giriş yap → İzin ver.

## 3. Bu Klasöre Gir

```bash
cd cloudflare-worker
```

## 4. Gemini API Key'i Secret Olarak Kaydet

```bash
wrangler secret put GEMINI_API_KEY
```

> Komut çalışınca terminal API anahtarını girmenizi ister.  
> `AIzaSy...` yapıştır ve Enter'a bas.  
> **Key asla wrangler.toml veya worker.js dosyasına yazılmaz!**

## 5. Deploy Et

```bash
wrangler deploy
```

Başarılı olunca şöyle bir URL görürsün:
```
✅ Deployed: https://mega-asistan-proxy.YOUR_USERNAME.workers.dev
```

## 6. app-bundle.js'i Güncelle

`app-bundle.js` içindeki `PROXY_ENDPOINT` değerini deploy URL'inle değiştir:

```javascript
// app-bundle.js içinde (en üstte, satır 11)
const PROXY_ENDPOINT = 'https://mega-asistan-proxy.GERCEK_ADIN.workers.dev';
```

## 7. HTML CSP'yi Güncelle

`Etkinlik4_KuralTabanli_Chatbot.html` içindeki `connect-src` satırını güncelle:

```html
<!-- YOUR_USERNAME yerine gerçek Cloudflare kullanıcı adını yaz -->
https://mega-asistan-proxy.GERCEK_ADIN.workers.dev
```

## 8. Canlılık Testi

```
https://mega-asistan-proxy.YOUR_USERNAME.workers.dev/api/health
```

Şu yanıtı döndürmeli:
```json
{ "status": "ok", "version": "2.0.0", "provider": "Google Gemini", "keySet": true }
```

---

## Ücretsiz Tier Limitleri

| Limit | Cloudflare Worker | Gemini Flash |
|---|---|---|
| Günlük istek | 100.000 | 1.500 |
| CPU süresi | 10ms/istek | - |
| Dakika limiti | - | 15 istek/dk |

Okul + kişisel kullanım için **tamamen yeterli**.

---

## Güvenlik Notları

- ✅ API key sadece Worker ortam değişkeninde yaşar
- ✅ Client kodu asla anahtarı görmez
- ✅ CORS herkese açık (okul/yerel kullanım için)
- ✅ Input 600 karakterle sınırlı (DoS koruması)
- ✅ Max token 800 ile sınırlı (kota koruması)
- ✅ Gemini güvenlik filtreleri aktif (okul için uygun içerik)
