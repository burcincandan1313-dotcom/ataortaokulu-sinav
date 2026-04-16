/**
 * curriculum.js
 * Bu dosya projenin ayrılmaz bir parçasıdır.
 */
// Türkiye Yüzyılı Maarif Modeli (MEB) müfredatına göre 1-12 sınıf HİBRİT detaylı yapı.
// Resmi Tema ve Öğrenme Alanları, içindeki detay konular (üniteler) ile birleştirilmiştir.

export const curriculumData = {
    1: {
      "Türkçe": ["Okuma (Harf, Hece, Kelime)", "Okuma (Akıcı Okuma Kuralları)", "Dinleme ve İzleme (Sözlü İletişim)", "Yazılı Üretim (Harf ve Satır Çizgisi)"],
      "Matematik": ["Sayılar ve İşlemler (Ritmik Sayma ve Doğal Sayılar)", "Sayılar ve İşlemler (Toplama ve Çıkarma)", "Cebirsel Düşünme (Örüntüler)", "Geometri (Uzamsal İlişkiler)", "Ölçme (Zaman ve Uzunluk)", "Veri Analizi (Veri Toplama)"],
      "Hayat Bilgisi": ["Okulumuzda Hayat (Sınıf Kuralları)", "Evimizde Hayat (Aile İçi İletişim)", "Sağlıklı Hayat (Kişisel Bakım)", "Güvenli Hayat (Trafik ve Ev Güvenliği)", "Ülkemizde Hayat (Bayrağımız)", "Doğada Hayat (Çevreyi Koruma)"],
      "Görsel Sanatlar ve Müzik": ["Sanatsal İfade (Renkler ve Çizim)", "Müzik (Ritim ve Melodi)"],
      "Beden Eğitimi": ["Sağlıklı Yaşam (Hareket Yetkinliği)", "Oyun Becerileri"]
    },
    2: {
      "Türkçe": ["Okuma (Farklı Metin Türleri ve Şiir)", "Dinleme (Hazırlıklı Dinleme)", "Konuşma Becerileri (Kendini İfade)", "Yazılı Üretim (Büyük Harf ve Noktalama)"],
      "Matematik": ["Sayılar ve İşlemler (Basamak Değerleri)", "Sayılar ve İşlemler (İleri Toplama-Çıkarma)", "Geometri (Şekillerin Yüzeyleri, Prizma)", "Ölçme (Kütle ve Sıvı Ölçme)", "Veri (Çetele ve Sıklık Tablosu)"],
      "Hayat Bilgisi": ["Okulumuzda Hayat", "Evimizde Hayat (Akrabalık)", "Sağlıklı Hayat (Dengeli Beslenme)", "Güvenli Hayat", "Ülkemizde Hayat (Atatürk'ün Hayatı)", "Doğada Hayat (Yönler)"],
      "İngilizce": ["Theme 1: School Life (Words)", "Theme 2: Classroom Life (Friends)", "Theme 3: Personal Life (In the Classroom)", "Theme 4: Family Life (Numbers)", "Theme 5: Homes and Neighbourhoods (Colors)", "Theme 6: Life in the City (Animals)"],
      "Görsel Sanatlar ve Müzik": ["Sanatsal İfade (Üç Boyutlu Çalışmalar)", "Müzik (Çalgılarla Ritim)"],
      "Beden Eğitimi": ["Fiziksel Etkinlik (Koordinasyon)", "Oyun Becerileri (Takım Oyunları)"]
    },
    3: {
      "Türkçe": ["Okuma (Karşılaştırmalı Metin Analizi)", "Dinleme (Ana Fikir ve Çıkarım)", "Dil Yapısı (Kurallı Cümle Çözümlemesi)", "Yazılı Üretim (Kısa Paragraf Yazma)"],
      "Matematik": ["Sayılar ve İşlemler (Üç Basamaklılar)", "Sayılar ve İşlemler (Çarpma ve Bölme Becerisi)", "Kesirler (Birim Kesirler)", "Geometri (Nokta, Doğru, Açı)", "Ölçme (Çevre Hesabı)", "Veri Olasılığı (Şekil Grafiği)"],
      "Fen Bilimleri": ["Dünya ve Evren (Gezegenimiz)", "Canlılar ve Yaşam (Beş Duyumuz)", "Fiziksel Olaylar (Kuvveti Tanıyalım)", "Madde ve Doğası (Maddenin Halleri)", "Fiziksel Olaylar (Işık ve Ses)", "Canlılar ve Yaşam (Çevremizdeki Canlılar)"],
      "Hayat Bilgisi": ["Okulumuzda Hayat (Meslekler)", "Evimizde Hayat (Bütçe)", "Sağlıklı Hayat (Kişisel Temizlik)", "Güvenli Hayat (Trafik İşaretleri)", "Ülkemizde Hayat (Yönetim Birimleri)", "Doğada Hayat (Geri Dönüşüm)"],
      "İngilizce": ["Theme 1: School Life (Greeting)", "Theme 2: Classroom Life (My Family)", "Theme 3: Personal Life (Feelings)", "Theme 4: Family Life (Toys and Games)", "Theme 5: Homes and Neighbourhoods (House Parts)", "Theme 6: Life in the City (Places)"],
      "Görsel Sanatlar ve Müzik": ["Sanatsal İfade (Görsel Tasarım)", "Müzik (Ses Renkleri)"],
      "Beden Eğitimi": ["Fiziksel Etkinlik (Esneklik ve Denge)", "Oyun Becerileri"]
    },
    4: {
      "Türkçe": ["Okuma (Derin Anlam ve Yorumlama)", "Sözlü İletişim (Münazara ve Sunum)", "Söz Varlığı (Mecaz/Gerçek Anlam, Atasözleri)", "Yazılı Üretim (Giriş-Gelişme-Sonuç Formu)"],
      "Matematik": ["Sayılar ve İşlemler (Dört Basamaklılar)", "Sayılar ve İşlemler (Dört İşlem Problemleri)", "Nicelik Eğitimleri (Kesirlerde Toplama Çıkarma)", "Geometri (Simetri, Geometrik Cisimler)", "Ölçme (Alan, Çevre, Tartma)"],
      "Fen Bilimleri": ["Dünya ve Evren (Yer Kabuğu ve Fosiller)", "Canlılar ve Yaşam (Besinlerimiz)", "Fiziksel Olaylar (Gündelik Yaşamda Kuvvet)", "Madde ve Doğası (Maddenin Özellikleri ve Karışımlar)", "Fiziksel Olaylar (Basit Elektrik Devreleri)"],
      "Sosyal Bilgiler": ["Birlikte Yaşamak (Birey ve Kimlik)", "Ortak Mirasımız (Kültür ve Tarih)", "Evimiz Dünya (Yaşadığımız Yer)", "Bilim ve Teknoloji Yolu (Teknolojik Ürünler)", "Üretimi Keşfediyorum (Üretim-Tüketim)", "Küresel Bağlantılar (Farklı Kültürler)"],
      "İngilizce": ["Theme 1: School Life (Classroom Rules)", "Theme 2: Classroom Life (Nationalities)", "Theme 3: Personal Life (Cartoon Characters)", "Theme 4: Family Life (Free Time)", "Theme 5: Homes and Neighbourhoods (Jobs)", "Theme 6: Life in the City (Clothes)"],
      "Din Kültürü ve Ahlak Bilgisi": ["İnanç (Dinî İfadeler)", "Hz. Muhammed'in Hayatı (Çocukluğu ve Gençliği)", "Ahlak (Din ve Temizlik)"]
    },
    5: {
      "Türkçe": ["Sözlü İletişim (Söz Alarak Konuşma)", "Okuma (Sözcük, Cümle ve Paragrafta Anlam)", "Dil Yapısı (Kök ve Ek Yapısı)", "Yazılı Üretim (Metin Türleri)"],
      "Matematik": ["Sayılar ve İşlemler (Milyonlarca Sayılar)", "Sayılar ve İşlemler (Kesirlerde Genişletme/Sadeleştirme)", "Ölçme (Ondalık Gösterim ve Yüzüzdeler)", "Geometri (Doğru, Işın, Çokgenler)", "Ölçme (Uzunluk ve Zaman Ölçme)", "Veri Analizi (Sütun Grafiği)"],
      "Fen Bilimleri": ["Dünya ve Evren (Güneş, Dünya ve Ay)", "Canlılar ve Yaşam (Canlıların Dünyası)", "Fiziksel Olaylar (Kuvvetin Ölçülmesi, Sürtünme)", "Madde ve Doğası (Maddenin Hal Değişimi)", "Fiziksel Olaylar (Işığın Yayılması)", "Madde ve Doğası (İnsan ve Çevre)"],
      "Sosyal Bilgiler": ["Birlikte Yaşamak (Toplum Bireyi Olarak Ben)", "Ortak Mirasımız (Anadolu ve Mezopotamya Uygarlıkları)", "Evimiz Dünya (Haritalar ve İklim)", "Bilim ve Teknoloji Yolu (Bilim İnsanları)", "Üretimi Keşfediyorum (Ekonomik Faaliyetler)", "Küresel Bağlantılar (Küresel İletişim)"],
      "İngilizce": ["Theme 1: School Life (Hello!)", "Theme 2: Classroom Life (My Town)", "Theme 3: Personal Life (Games and Hobbies)", "Theme 4: Family Life (My Daily Routine)", "Theme 5: Homes and Neighbourhoods (Health)", "Theme 6: Life in the City (Movies and Festivals)"],
      "Bilişim Teknolojileri": ["Bilişim Okuryazarlığı (Bilgiye Erişim)", "Siber Güvenlik (Dijital Yurttaşlık)", "Algoritma ve Problem Çözme"],
      "Din Kültürü ve Ahlak Bilgisi": ["İnanç (Allah İnancı)", "İbadet (Ramazan ve Oruç)", "Ahlak (Nezaket Kuralları)", "Hz. Muhammed'in Hayatı"]
    },
    6: {
      "Türkçe": ["Okuma (Paragraf Mimarisi ve Ana Düşünce)", "Dil Yapısı (İsim, Sıfat, Zamir)", "Dil Yapısı (Edat, Bağlaç, Ünlem)", "Yazılı Üretim (Kompozisyon ve Dilekçe)"],
      "Matematik": ["Sayılar ve İşlemler (Çarpanlar, Katlar, Kümeler)", "Sayılar ve İşlemler (Tam Sayılar ve Rasyonel Sayılar)", "Geometri (Açılar, Çember)", "Cebir (Cebirsel İfadelere Giriş)", "Veri Analizi (Aritmetik Ortalama)", "Ölçme (Alan Ölçme)"],
      "Fen Bilimleri": ["Dünya ve Evren (Güneş Sistemi)", "Canlılar ve Yaşam (Vücudumuzdaki Sistemler)", "Fiziksel Olaylar (Kuvvet ve Hareket)", "Madde ve Doğası (Madde ve Isı)", "Fiziksel Olaylar (Ses)", "Dünya ve Evren (Vücudumuz (Üreme/Gelişim))"],
      "Sosyal Bilgiler": ["Birlikte Yaşamak (Sosyal Roller)", "Ortak Mirasımız (Türklerin Anayurdu, İslam'ın Doğuşu)", "Evimiz Dünya (Fiziki Harita ve İklim Bölgeleri)", "Bilim ve Teknoloji Yolu (Bilimsel Araştırma)", "Üretimi Keşfediyorum (Kaynaklarımız ve Vergi)", "Küresel Bağlantılar (Türkiye'nin Konumu)"],
      "İngilizce": ["Theme 1: School Life (Life)", "Theme 2: Classroom Life (Yummy Breakfast)", "Theme 3: Personal Life (Downtown)", "Theme 4: Family Life (Weather and Emotions)", "Theme 5: Homes and Neighbourhoods (Occupations)", "Theme 6: Life in the City (Holidays)"],
      "Bilişim Teknolojileri": ["Bilişim Okuryazarlığı (Tablolama Yazılımları)", "Algoritma ve Programlama (Blok Kodlama)", "Tasarım Üretimi (3D Tasarım)"],
      "Din Kültürü ve Ahlak Bilgisi": ["İnanç (Peygamberlere İman)", "İbadet (Namaz)", "Ahlak (Zararlı Alışkanlıklar)", "Hz. Muhammed'in Hayatı (Mekke ve Medine Yılları)"]
    },
    7: {
      "Türkçe": ["Okuma (Metin Analizi ve Yorumlama)", "Dil Yapısı (Fiiller, Anlam Kayması)", "Dil Yapısı (Zarflar)", "Yazılı Üretim (Düşünceyi İfade)", "Uygulamalı Yazım ve Noktalama"],
      "Matematik": ["Sayılar ve İşlemler (Tam Sayılarla Rasyonel İşlemler)", "Cebir (Eşitlik ve Birinci Dereceden Denklemler)", "Sayılar ve İşlemler (Oran ve Orantı, Yüzdeler)", "Geometri (Doğrular ve Açılar)", "Geometri (Çokgenler, Çember)", "Veri Analizi (Çizgi Grafik)"],
      "Fen Bilimleri": ["Dünya ve Evren (Uzay Araştırmaları)", "Canlılar ve Yaşam (Hücre ve Mitoz/Mayoz)", "Fiziksel Olaylar (Kuvvet, İş ve Enerji)", "Madde ve Doğası (Saf Madde, Karışımlar)", "Fiziksel Olaylar (Işığın Kırılması)", "Canlılar ve Yaşam (Üreme, Büyüme)"],
      "Sosyal Bilgiler": ["Birlikte Yaşamak (Etkili İletişim)", "Ortak Mirasımız (Osmanlı Devleti'nin Doğuşu)", "Evimiz Dünya (Nüfus ve Yerleşme)", "Bilim ve Teknoloji Yolu (Tarihte Bilim)", "Üretimi Keşfediyorum (Ekonomi, Vakıflar)", "Küresel Bağlantılar (Küresel Kuruluşlar)"],
      "İngilizce": ["Theme 1: School Life (Appearance and Personality)", "Theme 2: Classroom Life (Sports)", "Theme 3: Personal Life (Biographies)", "Theme 4: Family Life (Wild Animals)", "Theme 5: Homes and Neighbourhoods (Television)", "Theme 6: Life in the City (Environment/Dreams)"],
      "Bilişim Teknolojileri": ["Bilgi İşlemsel Düşünme (Veri Tabanı Mantığı)", "Algoritma ve Programlama (Blok, Metin Tabanlı Kodlama)", "Siber Güvenlik"],
      "Din Kültürü ve Ahlak Bilgisi": ["İnanç (Melek ve Ahiret İnancı)", "İbadet (Hac ve Kurban)", "Ahlak (İslam Düşüncesi, Değerler)", "Hz. Muhammed'in Hayatı"]
    },
    8: {
      "Türkçe": ["Okuma (Sözcükte ve Cümlede Anlam)", "Okuma (Parçada Anlam ve LGS Soru Analizi)", "Dil Yapısı (Fiilimsiler, Cümlenin Ögeleri)", "Dil Yapısı (Cümle Türleri, Anlatım Bozukluğu)", "Söz Sanatları ve Yazılı Üretim"],
      "Matematik": ["Sayılar ve İşlemler (Çarpanlar, Katlar, EBOB-EKOK)", "Sayılar ve İşlemler (Üslü ve Kareköklü İfadeler)", "Veri Analizi ve İstatistik", "Olasılık (Basit Olayların Olma Olasılığı)", "Cebir (Cebirsel İfadeler, Özdeşlikler, Denklemler, Eşitsizlikler)", "Geometri (Üçgenler, Eşlik ve Benzerlik, Dönüşüm)"],
      "Fen Bilimleri": ["Dünya ve Evren (Mevsimler ve İklim)", "Canlılar ve Yaşam (DNA, Genetik Kod, Mutasyon)", "Fiziksel Olaylar (Katı, Sıvı, Gaz Basıncı)", "Madde ve Doğası (Periyodik Sistem, Asit ve Baz)", "Fiziksel Olaylar (Basit Makineler)", "Canlılar ve Yaşam (Enerji Dönüşümleri, Besin Zinciri)", "Madde ve Doğası (Elektrik Yükleri)"],
      "T.C. İnkılap Tarihi ve Atatürkçülük": ["Millî Bağımsızlık Yolunda (Mustafa Kemal'in Hayatı)", "Millî Uyanış (I. Dünya Savaşı ve Cemiyetler)", "Millî Bağımsızlık (Kurtuluş Savaşı Cepheleri)", "Çağdaşlaşan Türkiye (Atatürk İlke ve İnkılapları)", "Demokrasi Serüveni (Çok Partili Hayat)" ,"Küresel İlkeler (Atatürk Dönemi Dış Politika)"],
      "İngilizce": ["Theme 1: School Life (Friendship & Teen Life)", "Theme 2: Classroom Life (In the Kitchen)", "Theme 3: Personal Life (On the Phone)", "Theme 4: Family Life (The Internet & Adventures)", "Theme 5: Homes and Neighbourhoods (Tourism & Chores)", "Theme 6: Life in the City (Science & Natural Forces)"],
      "Din Kültürü ve Ahlak Bilgisi": ["İnanç (Kader İnancı)", "İbadet (Zekat ve Sadaka)", "Ahlak (Din ve Hayat)", "Hz. Muhammed'in Hayatı (Örnekliği)", "Vahiy ve Akıl (Kur'an-ı Kerim Özellikleri)"]
    },
    9: {
      "Matematik": ["Sayılar ve İşlemler (Kümeler, Mantık)", "Cebir (Denklem ve Eşitsizlikler)", "Geometri (Üçgenler)", "Veri Analizi (Veri Grafikleri)"],
      "Fizik": ["Fiziksel Olaylar (Hareket ve Kuvvet)", "Elektrik ve Manyetizma", "Enerji, Isı ve Sıcaklık"],
      "Kimya": ["Madde ve Doğası (Atom ve Tablo)", "Kimyasal Türler Arası Etkileşim", "Doğa ve Kimya"],
      "Biyoloji": ["Canlılar ve Yaşam (Hücre)", "Canlıların Çeşitliliği", "Temel Bileşenler"],
      "Türk Dili ve Edebiyatı": ["Edebiyata Giriş ve Şiir", "Hikaye ve Masal", "Sözlü İletişim, Tiyatro"],
      "Tarih": ["Ortak Mirasımız (İlk Kurulan Çağlar)", "Tarihin Kaynakları", "İslam Medeniyeti Doğuşu"],
      "Coğrafya": ["Evimiz Dünya (Harita Bilimi)", "İnsan ve Doğa (İklim Sistemleri)"]
    },
    10: {
       "Matematik": ["Sayma, Olasılık (Sayma Yöntemleri)", "Cebir (Fonksiyonlar, İkinci Derece Denklemler)", "Geometri (Dörtgenler ve Çokgenler)", "Geometri (Katı Cisimler)"],
       "Fizik": ["Elektrik (Statik)", "Basınç ve Kaldırma Kuvvetleri", "Dalgalar", "Optik Göstergeleri"],
       "Kimya": ["Madde (Kimyanın Temel Kanunları)", "Karışımlar Serisi", "Asitler, Bazlar ve Tuzlar"],
       "Biyoloji": ["Canlılar (Hücre Bölünmeleri)", "Kalıtım Kuralları", "Ekosistem Ekolojisi"],
       "Türk Dili ve Edebiyatı": ["Halk Edebiyatı", "Divan Edebiyatı", "Tiyatro ve Roman"],
       "Tarih": ["Devletleşme (Osmanlı Doğuş)", "Dünya Gücü Süreçleri"],
       "Coğrafya": ["Nüfus Sistemleri (Göçler)", "Yerel Ekonomik Yollar (Üretim)"]
    },
    11: {
       "Matematik": ["Trigonometri ve Uzay Geometrisi", "Olasılık Kuramları (İleri)", "Geometri (Analitik)"],
       "Fizik": ["Hareket, Tork ve Analiz (İtme/Momentum)", "Alternatif Akım"],
       "Kimya": ["Modern Atom Teorisi (Gazlar, Çözeltiler)", "Tepkime Hızları ve Denge"],
       "Biyoloji": ["İnsan Fizyolojisi (Denetleyici Temsil)", "Komünite ve Popülasyon Ekolojisi"],
       "Türk Dili ve Edebiyatı": ["Makale/Rapor Üretimi", "Tanzimat ve Servet-i Fünun Dönemi", "Cumhuriyet Dönemi Romanı"],
       "Tarih": ["Uluslararası İlişkiler (Avrupa Dönüşümleri)", "Değişen Dünya Dengesinde Osmanlı"],
       "Coğrafya": ["Ekosistem Analiz Becerisi (Madde Döngüleri)", "Şehir Modelleri ve Doğal Kaynaklar"]
    },
    12: {
       "Matematik": ["Analitik Düşünce (Diziler)", "Karmaşık Cebir (Türev ve İntegral)", "İleri Trigonometri, Logaritma"],
       "Fizik": ["Düzgün Çembersel Hareket, Harmonik", "Radyoaktivite ve Modern Fizik"],
       "Kimya": ["Karbon Kimyası (Organik)", "Elektrokimya ve Pil", "Enerji Bağları"],
       "Biyoloji": ["Genden Proteine", "Bitki Biyolojisi (Fotosentez, Solunum)", "Canlılar ve Çevre"],
       "Türk Dili ve Edebiyatı": ["1960 Sonrası Edebiyat", "Dünya Edebiyatı İncelemesi", "Nutuk-Söylev"],
       "T.C. İnkılap Tarihi ve Atatürkçülük": ["Çağdaş Türkiye (Milli Mücadele Dönemi)", "Atatürk Dönemi Demokrasi Çerçevesi"],
       "Coğrafya": ["Küresel Sorunlar (Çevre Yönetimi)", "Ekstrem Doğa Olayları"]
    }
};