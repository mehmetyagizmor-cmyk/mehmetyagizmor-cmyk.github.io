# 📲 Yayın Rehberi: Çay Ocağı Tycoon

Bu rehber oyunu üç adımda yayına taşır:

1. **İnternette yayınla** (ücretsiz): Herkes linkten oynar, telefona "uygulama" olarak eklenebilir.
2. **Google Play'e koy** (tek seferlik 25$): Android uygulaması olarak indirilir.
3. **App Store'a koy** (yıllık 99$, Mac gerekir): İsteğe bağlı, sonraya bırakılabilir.

> ⚠️ Mağaza kuralları ve ücretler zaman zaman değişir. Buradaki bilgiler yazıldığı tarihteki (Ekim 2026) bilinen durumu yansıtır; başvururken Google ve Apple'ın güncel sayfalarına mutlaka bak.

---

## ✅ Yayından önce yapılacaklar

- [x] `privacy.html` içine iletişim e-postası yazıldı (Play Store bir iletişim adresi ister).
- [ ] Oyunu **gerçek telefonlarda** dene: en az bir Android ve mümkünse bir iPhone; özellikle eski/ucuz bir telefon.
- [ ] Bir gün baştan sona oyna; ses, titreşim, duraklatma ve günlük ödül çalışıyor mu bak.

---

## 1️⃣ İnternette yayınla (GitHub Pages — ücretsiz)

Oyun tamamen statik dosyalardan oluşur; sunucu gerekmez.

> 💡 **Önemli:** Google Play paketi için oyunun **alan adının kökünde** bir doğrulama dosyası (`/.well-known/assetlinks.json`) bulunmalı.
> Bu yüzden depoyu **`KULLANICIADIN.github.io`** adıyla oluştur. Böylece oyun `https://KULLANICIADIN.github.io/` adresinde, alan adının kökünde yayınlanır.
> (`github.io/oyun` gibi bir alt klasörde yayınlarsan Android uygulamasında üstte tarayıcı adres çubuğu görünür.)
> Kendi alan adın varsa (ör. `cayocagi.com`) onu da kullanabilirsin.

1. GitHub'da yeni bir **public** depo aç; adı tam olarak `KULLANICIADIN.github.io` olsun.
2. Bu klasörü o depoya gönder:
   ```bash
   git remote add origin https://github.com/KULLANICIADIN/KULLANICIADIN.github.io.git
   git push -u origin main
   ```
3. GitHub'da depo → **Settings → Pages** → Source: `Deploy from a branch`, Branch: `main` / `(root)` → **Save**.
4. 1–2 dakika sonra oyun `https://KULLANICIADIN.github.io/` adresinde açılır.
5. Telefondan aç:
   - **Android (Chrome):** Oyunda ⚙️ Ayarlar → **📲 Ana ekrana ekle**
   - **iPhone (Safari):** Paylaş → **Ana Ekrana Ekle**

Artık oyun telefonda ikonuyla, tam ekran ve **internetsiz** çalışır.

---

## 2️⃣ Google Play'e koy (PWABuilder ile — Android Studio gerekmez)

### a) Android paketini oluştur

1. **https://www.pwabuilder.com** adresine git, oyunun adresini (`https://KULLANICIADIN.github.io/`) yaz → **Start**.
2. Puan raporu çıkar; manifest, service worker ve ikonlar hazır olduğu için geçmesi gerekir.
3. **Package For Stores → Android → Generate Package**.
   - **Package ID:** ör. `io.github.KULLANICIADIN.cayocagi` (sonradan değiştirilemez!)
   - **App name:** `Çay Ocağı Tycoon`
   - **Signing key:** "Create new" (yeni anahtar oluştur)
4. İnen `.zip` dosyasının içinde şunlar olur:
   - `*.aab`: Play Store'a yükleyeceğin dosya
   - `signing.keystore` ve `signing-key-info.txt`: **🔐 ÇOK ÖNEMLİ!** Bunları güvenli bir yerde (bulut + harici disk) sakla. Kaybedersen oyunu bir daha **güncelleyemezsin**. Bu dosyaları asla GitHub'a yükleme.
   - `assetlinks.json`: alan adı doğrulama dosyası
5. `index.html` içindeki `const PLAY_ID = '';` satırına aynı **Package ID**'yi yaz (ör. `'io.github.KULLANICIADIN.cayocagi'`). Oyundaki "Puan ver" isteği bu kimlikle Play sayfasını açar; boşken istek hiç gösterilmez.

### b) Alan adını doğrula

`assetlinks.json` dosyasını oyun klasöründe `.well-known/assetlinks.json` yoluna koy ve GitHub'a gönder:

```bash
mkdir .well-known
# zip içindeki assetlinks.json dosyasını .well-known/ içine kopyala
touch .nojekyll            # GitHub Pages'in nokta ile başlayan klasörü yayınlaması için
git add .well-known .nojekyll && git commit -m "Android doğrulama dosyası" && git push
```

Kontrol: `https://KULLANICIADIN.github.io/.well-known/assetlinks.json` adresi açılmalı.

> Play Console uygulamayı kendi anahtarıyla yeniden imzalar ("Play App Signing"). Yükledikten sonra **Play Console → Uygulama bütünlüğü → Uygulama imzalama** sayfasındaki **SHA-256** parmak izini de `assetlinks.json` dosyasındaki listeye eklemen gerekir; yoksa uygulamada adres çubuğu görünür.

### c) Play Console

1. **https://play.google.com/console** → geliştirici hesabı aç (tek seferlik **25$**, kimlik doğrulaması istenir).
2. **Uygulama oluştur** → Ad: `Çay Ocağı Tycoon`, Tür: **Oyun**, Ücretsiz.
3. Doldurulacak zorunlu bölümler:
   - **Ana mağaza girişi:** metinler ve görseller → `store/MAGAZA-METNI.md` dosyasında hazır
   - **Gizlilik politikası:** `https://KULLANICIADIN.github.io/privacy.html`
   - **Veri güvenliği formu:** "Uygulama kullanıcı verisi toplamıyor veya paylaşmıyor" seçenekleri
   - **İçerik derecelendirmesi anketi:** şiddet, kumar vb. yok → genelde "Herkes / 3+" çıkar
   - **Hedef kitle:** 13 yaş altını seçersen Google'ın "Aileler" politikası devreye girer (ek kurallar). Başlangıç için **13+** seçmek daha az uğraştırır.
   - **Reklam içeriyor mu:** Hayır
4. **Test → Kapalı test** kanalına `.aab` dosyasını yükle.
   > ⚠️ Yeni **kişisel** geliştirici hesaplarında herkese açık yayından önce bir kapalı test şartı var (bilinen son kural: **en az 12 test kullanıcısı, 14 gün kesintisiz**). Arkadaşlarından ve ailenden 12+ kişiyi Gmail adresleriyle test listesine ekle. Güncel şartı Play Console'da kontrol et.
5. Test süresi dolunca **Üretim** (production) kanalına yükseltip incelemeye gönder. İnceleme genelde birkaç gün sürer.

### Güncelleme nasıl yapılır?

Oyun web üzerinden yüklendiği için **çoğu güncelleme mağazaya yeniden yükleme gerektirmez**:

1. Dosyaları değiştir.
2. `sw.js` içindeki `VERSION` değerini artır (`'v1'` → `'v2'`) ve `index.html` içindeki `APP_VERSION`'ı güncelle.
3. GitHub'a gönder. Oyuncular bir sonraki açılışta yeni sürümü alır.

Yalnızca ikon, uygulama adı veya paket ayarları değişirse PWABuilder'da **aynı imza anahtarıyla** yeni paket üretip Play'e yüklemen gerekir.

---

## 🎮 itch.io (ücretsiz, tarayıcıda oynanır)

1. Paket: `index.html`, `privacy.html`, `manifest.webmanifest` ve `icons/` tek zip'te; **`sw.js` koyma** (itch kendi sunucusundan dağıtır, önbellek eski sürümde takılabilir).
   Windows'ta zip'i `tar -a -c -f cay-ocagi-itch.zip index.html privacy.html manifest.webmanifest icons` ile yap (PowerShell'in Compress-Archive'ı klasör yollarını `\` ile yazar, itch tanımayabilir).
2. itch.io → **Upload new project** → Kind of project: **HTML** → zip'i yükle → **This file will be played in the browser**.
3. Embed: Viewport **1000 × 700**, ✅ Mobile friendly (Orientation: Portrait), ✅ Fullscreen button.
4. Güncelleme: eski zip'i sil, yenisini yükle. Kayıtlar korunur (aynı itch.io alan adı).
5. Not: itch.io'daki kayıt, github.io'daki kayıttan ayrıdır (farklı site).

---

## 3️⃣ App Store (iPhone) — isteğe bağlı

- **Apple Developer Program:** yıllık **99$**
- **Mac + Xcode** gerekir (Windows'tan doğrudan yüklenemez).
- PWABuilder'da **Package For Stores → iOS** ile bir Xcode projesi üretilir; Mac'te açılıp App Store'a gönderilir.
- ⚠️ Apple, "sadece bir web sitesini paketleyen" uygulamaları reddedebilir (Kılavuz 4.2). Oyunun internetsiz çalışması, titreşim ve tam ekran oyun deneyimi bu riski azaltır ama sıfırlamaz.
- Öneri: Önce Google Play'de çık, geri bildirim topla, sonra iOS'a geç. O arada iPhone kullanıcıları **Ana Ekrana Ekle** ile zaten oynayabilir.

---

## 📈 Daha çok indirilmek ve oynanmak için

### Mağaza sayfası (ASO)
- Mağazadaki ilk 2 ekran görüntüsü en çok bakılanlardır; en renkli sahneler başta olsun (hazır).
- Ekran görüntülerinin üstüne kısa, büyük yazılar eklemek ("Kendi çay ocağını işlet!", "Dükkânını büyüt!") dönüşümü genelde artırır.
- 15–30 saniyelik bir **tanıtım videosu** (YouTube linki) ekle.
- Puan ve yorumlara cevap ver; ilk yorumlar sıralamayı çok etkiler.

### Kitleyi büyüt
- **İngilizce dil desteği:** "Turkish Tea House Tycoon" gibi bir adla yurt dışında da kültürel ve özgün bir oyun olarak öne çıkar. Bu, en büyük büyüme kaldıracıdır.
- **TikTok / Instagram Reels / YouTube Shorts:** Kalabalık bir gün, VIP müşteri veya dükkânın büyüme anı gibi kısa kesitler çay ocağı nostaljisiyle iyi tutar.
- Türk oyun toplulukları (Reddit r/Turkey, Ekşi Sözlük, Discord sunucuları) ve oyun haber siteleri.

### Oyuncuyu tutmak
- **Oyun sonu içeriği:** Şu an dükkân yaklaşık 10. günde en üst seviyeye çıkıyor ve sonrasında harcanacak hedef kalmıyor. Yeni ürünler, ikinci şube veya prestij sistemi (her şeyi sıfırlayıp kalıcı bonusla baştan başlama) en çok etki edecek ekleme olur.
- **Arka plan müziği** (hafif, nostaljik bir bağlama/kanun tınısı).
- **Mevsimsel etkinlikler:** Ramazan'da iftar saati kalabalığı, kışın sahlep sezonu, yazın limonata gibi.
- **Değerlendirme isteği:** Oyuncu mutluyken (ör. 3 yıldızlı bir günün ardından) puan vermesini iste.

### Gelir (istersen)
- **Ödüllü reklam:** "Reklam izle, günün kazancını 2 katına çıkar." Oyuncular en az bu modelden rahatsız olur.
- **Tek seferlik satın alma:** "Reklamları kaldır" veya kozmetik paketler (özel tabela, kıyafet).
- ⚠️ Reklam veya satın alma eklenirse gizlilik politikası ve Play'deki "Veri güvenliği" formu güncellenmeli.

### Ölç
- Basit, gizlilik dostu bir analiz aracıyla oyuncuların hangi günde bıraktığını görmek, neyi iyileştireceğini gösterir. Eklenirse gizlilik politikası güncellenmeli.
