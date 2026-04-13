# 🐈 Scratch İle Kendi Sohbet Botunu (Chatbot) Yap!

Sevgili 6. Sınıflar,
Siri, Alexa veya ChatGPT gibi sistemler söylediklerimizi nasıl anlıyor ve bize cevap veriyor? Bu etkinlikte, Scratch kullanarak yazdığınız kelimeleri anlayan ve buna uygun cevap veren bir "Kural Tabanlı Sohbet Botu" geliştireceksiniz.

## 🎯 Hedef
Eğer (If) döngüleriyle bilgisayara kurallar öğretmek. Kullanıcının girdiği cümlenin içindeki kelimeleri yakalayarak uygun cevabı vermek.

---

## 🛠️ Adım Adım Yapılışı

### 1. Hazırlık Aşaması
1. Scratch (scratch.mit.edu) sayfasına gir.
2. Kendine bir karakter (Kukla) seç. (Bir robot veya hayvan olabilir).
3. Etkileyici bir arka plan ('Dekor') ekle.

### 2. Kodlama Aşaması

* Yeşil Bayrağa tıklandığında botumuz bizi karşılasın:
```text
[Yeşil Bayrağa Tıklandığında]
(Boyutunu %100 yap)
(Merhaba, ben senin asistanınım! Bana bir şeyler söyle. de, 3 saniye bekle)
```

* Sürekli Tekrarla bloğu ekleyerek botun sürekli bizi dinlemesini sağlayalım:
```text
[Sürekli Tekrarla]
  { (Sana nasıl yardımcı olabilirim?) diye sor ve bekle }
```

### 3. Anahtar Kelimeleri Yakalama Mantığı (Şart Bloğu)
Sürekli tekrarla bloğunun içine şartlar (`Eğer / İse`) ekleyeceğiz. "Cevap" operatörü içinde kullanıcının yazdıklarını kontrol edeceğiz.

**Kural 1: Selamlaşma**
```text
[Eğer] < (Cevap) (merhaba)'yı içeriyor mu? > [ise]
   (Sana da merhaba! Günün nasıl geçiyor? de, 2 saniye bekle)
```

**Kural 2: Hava Durumu**
```text
[Eğer] < (Cevap) (hava)'yı içeriyor mu? > [ise]
   (Pencereden dışarı bak, internete bağlı değilim! 😄 de, 3 saniye bekle)
```

**Kural 3: Şaka Yap**
```text
[Eğer] < (Cevap) (şaka)'yı içeriyor mu? > [ise]
   (Yapay zeka robotu neden sinirlenmiş?... Çünkü paslanmış! 🤖 de, 4 saniye bekle)
```

**Kural 4: Bilinmeyen Kelime (Her şeyin sonuna Değilse mantığı)**
Bu sadece belirli kurallara cevap veriyor. Eğer yukarıdakilerin hiçbiri yoksa:
* İpucu: Çoklu Eğer/Değilse kullanmalısın. Eğer hiçbir şarta uymazsa en sondaki `Değilse` bloğuna:
  `(Bunu henüz öğrenmedim. Bana yeni veriler öğretmelisin! de, 2 saniye bekle)`

---

## 🤔 Düşünme Zamanı
Senin botun "hava nasıl" cümlesini anlıyor. Peki kullanıcı "Dışarısı sıcak mı?" diye yazarsa botun anlayabilir mi?
*Cevap:* Hayır. Çünkü sadece "hava" kelimesine programladın. İşte gerçek Yapay Zeka ile (Makine Öğrenimi) "Kural Tabanlı" yazılım arasındaki fark budur! Gerçek yapay zekalar eşanlamlı kelimeleri anlamak için MİLYONLARCA veriyle eğitilir, tek tek kurallar yazılmaz.
