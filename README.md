# 🍵 Çay Ocağı Tycoon

Telefonda ve tarayıcıda oynanan bir dükkân işletme oyunu. Küçük bir mahalle çay ocağını devralıp onu şehrin en ünlü mekânına dönüştürüyorsun.

## Nasıl oynanır?

`index.html` dosyasını tarayıcıda açman yeterli; kurulum gerekmez.
(Telefona uygulama olarak eklemek ve internetsiz oynamak için oyunun bir web adresinden açılması gerekir; bkz. [YAYIN-REHBERI.md](YAYIN-REHBERI.md).)

1. **Dükkânı Aç**: Müşteriler kapıdan girip masalara oturur, siparişleri balonda görünür.
2. **🔥 Mutfak**'ta ürüne dokun (bilgisayarda 1-6 tuşları). Ürün ocakta hazırlanıp tepsiye düşer.
3. Yeşil balonlu **müşteriye dokun**; tepsideki uygun ürünler servis edilir.
4. **🛒 Mağaza**'dan dükkânını geliştir, **📋 Menü**'ye yeni ürün ekle, **🎒 Eşyalarım**'da sahip olduklarını ve başarımlarını gör.

## Özellikler

- **Ayrı bölümler:** Mutfak, Mağaza, Menü, Eşyalarım. Telefonda alt menü, bilgisayarda iki sütun.
- **Mobil uyumlu:** Dikey ve yatay ekran, çentikli ekran desteği, büyük dokunma alanları, titreşim.
- **Canlı dükkân sahnesi:** Mini insanlar yürür, oturur, sipariş verir. Mutlu müşteri bahşiş bırakır, sabrı tükenen kızıp gider.
- **Dükkân sahibi:** Adını, dükkânının adını ve karakterinin görünümünü seçebilirsin.
- **Dükkânı büyüt:** Mahalle Çay Ocağı → Kıraathane → Nostaljik Kafe → Ünlü Mekân.
- **Geliştirmeler:** Masa, tepsi, semaver, dekorasyon, neon tabela, çırak ve garson.
- **Özel olaylar:** Maç günü, yağmurlu gün, bayram, VIP müşteri, influencer, turist kafilesi, elektrik kesintisi, mutlu saat.
- **Günlük ödül ve başarımlar:** 7 günlük giriş serisi, 13 ödüllü başarım, gün sonu yıldız karnesi.
- **Öğretici:** İlk iki gün ne yapılacağını adım adım gösterir.
- **Duraklatma ve ayarlar:** Ses, titreşim, sahip düzenleme. Uygulama arka plana geçince otomatik duraklar ve kaydeder.
- **Uygulama olarak yüklenebilir (PWA):** Ana ekrana eklenir, internetsiz çalışır.
- **Sesler:** Hepsi Web Audio ile üretilir, ses dosyası gerekmez.
- İlerleme cihazda (localStorage) otomatik kaydedilir; hiçbir veri toplanmaz.

## Dosyalar

| Dosya | Açıklama |
|---|---|
| `index.html` | Oyunun tamamı (HTML, CSS, JavaScript/Canvas) |
| `manifest.webmanifest`, `sw.js` | Uygulama olarak yükleme ve çevrimdışı çalışma |
| `icons/` | Uygulama ikonları |
| `privacy.html` | Gizlilik politikası (mağazalar için zorunlu) |
| `store/` | Mağaza ekran görüntüleri, tanıtım görseli ve [mağaza metinleri](store/MAGAZA-METNI.md) |
| `YAYIN-REHBERI.md` | İnternette, Google Play'de ve App Store'da yayınlama rehberi |
