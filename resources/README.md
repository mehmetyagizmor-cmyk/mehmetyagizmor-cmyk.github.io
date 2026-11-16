# App Store görselleri ve iPhone kurulum notları

Bu klasör iPhone uygulamasının simge ve açılış ekranı kaynaklarını tutar. Oyun bu dosyaları kullanmaz.

| Dosya | Ne |
|---|---|
| `icon.png` | 1024×1024 App Store simgesi: köşesiz, şeffaflıksız (24 bit RGB) |
| `splash.png` | 2732×2732 açılış ekranı; önemli her şey ortadaki ~1200 pikselde |
| `icon.html`, `splash.html` | Kaynak çizimler. Değiştirirsen PNG'leri yeniden üret (aşağıda) |

## PNG'leri yeniden üretmek (Windows)

```bash
chrome --headless=new --hide-scrollbars --force-device-scale-factor=1 --window-size=1024,1024 --screenshot=resources/icon.png resources/icon.html
chrome --headless=new --hide-scrollbars --force-device-scale-factor=1 --allow-file-access-from-files --virtual-time-budget=3000 --window-size=2732,2732 --screenshot=resources/splash.png resources/splash.html
```

Chrome'un PNG'si şeffaflık kanalı içerir. App Store bunu kabul etmez, bu yüzden PowerShell'de System.Drawing ile `Format24bppRgb` olarak yeniden kaydet.

Mağaza sayfası metinleri (İngilizce ve Türkçe): [store/APP-STORE-EN.md](../store/APP-STORE-EN.md)

## Mac'te Capacitor kurulumu (Apple geliştirici hesabı açılınca)

1. Bir klasöre oyunun dosyalarını `www/` olarak koy: index.html, privacy.html, manifest.webmanifest, icons, fonts, scene3d.js, people3d.js, mahalle3d.js, vendor.
2. Kurulum:
   ```bash
   npm init -y
   npm i @capacitor/core @capacitor/cli @capacitor/ios @capacitor/preferences @capacitor/status-bar @capacitor/splash-screen \
     @capacitor/haptics @capacitor/local-notifications @capacitor-community/in-app-review @openforge/capacitor-game-connect
   npx cap init "Çay Ocağı" <paket-kimliği> --web-dir www
   npx cap add ios
   ```
   Paket kimliği örneği: `com.yagizmor.cayocagi`. Apple hesabında aynısını kullan; sonradan değiştirilemez.
3. **`@capacitor/preferences` şart.** Kayıt bu eklenti sayesinde telefonda silinmeye karşı korunur (oyundaki `nativeSave` ve `nativeRestore` bunu kullanır).
4. Simge ve açılış ekranı:
   ```bash
   npx @capacitor/assets generate --ios --assetPath resources
   ```
5. Durum çubuğu: üst şerit turuncu, bu yüzden saat ve pil simgesi koyu renk olmalı. `capacitor.config` içine şunu yaz:
   `plugins: { StatusBar: { style: 'LIGHT', overlaysWebView: true }, SplashScreen: { backgroundColor: '#fbecd3' } }`
6. Telefonun çentik ve alt çubuk boşlukları oyunda zaten ayarlı (`viewport-fit=cover` ve `env(safe-area-inset-*)`).
7. Xcode → Signing & Capabilities: **Game Center** yeteneğini ekle.
8. Game Center (App Store Connect → uygulama → Game Center). Kimlikler oyundakiyle birebir aynı olmalı:
   - Sıralama: `cayocagi.toplam`, adı "Toplam Kazanç", tamsayı, büyük olan iyi.
   - Başarımlar: aşağıdaki 34 kimlik, her biri tek seferlik (100%).

   | Kimlik | Ad |
   |---|---|
   | `cayocagi.ilk` | 🤝 İlk Müşteri |
   | `cayocagi.m50` | 🍵 Mahallenin Çaycısı |
   | `cayocagi.m250` | 🫖 Usta Çaycı |
   | `cayocagi.m1000` | 👑 Efsane Çaycı |
   | `cayocagi.k1000` | 💰 İlk Bin |
   | `cayocagi.k25000` | 💎 Sermayedar |
   | `cayocagi.menu` | 📋 Tam Menü |
   | `cayocagi.gorev` | 📋 Görev Adamı |
   | `cayocagi.kombo` | 🔥 Kombo Ustası |
   | `cayocagi.tarif` | 📈 Usta Tarif |
   | `cayocagi.kiraat` | 🏪 Kıraathane Sahibi |
   | `cayocagi.unlu` | 🏆 Ünlü Mekân |
   | `cayocagi.miras` | 🎖️ Usta Mirası |
   | `cayocagi.kusursuz` | ✨ Kusursuz Gün |
   | `cayocagi.yildiz` | ⭐ Mahallenin Gözdesi |
   | `cayocagi.ekip` | 👥 Kalabalık Ekip |
   | `cayocagi.sube1` | 🏙️ İlk Şube |
   | `cayocagi.dunya1` | 🌍 Dünyaya Açıldın |
   | `cayocagi.dunya5` | ✈️ Dünya Markası |
   | `cayocagi.kurtar` | 🛟 Kriz Yöneticisi |
   | `cayocagi.roportaj` | 🎤 Basın Sever |
   | `cayocagi.sohret` | 🌟 Ünlü Girişimci |
   | `cayocagi.mudavim` | 💛 Mahallenin Sevgilisi |
   | `cayocagi.elest` | 📰 Beş Yıldız |
   | `cayocagi.etkinlik` | 🎉 Bayram Coşkusu |
   | `cayocagi.koleksiyon` | 🏺 Koleksiyoncu |
   | `cayocagi.seri` | 📅 Sadık Esnaf |
   | `cayocagi.cay10k` | 🫖 Çay Fabrikası |
   | `cayocagi.m10000` | 🏟️ Mahallenin Efsanesi |
   | `cayocagi.vip100` | 👑 VIP Dostu |
   | `cayocagi.k250000` | 🏦 Büyük Sermaye |
   | `cayocagi.milyon` | 💸 Milyoner |
   | `cayocagi.kusursuz30` | 🌟 Kusursuz Usta |
   | `cayocagi.kombo30` | 🔥 Kombo Kralı |

9. Oyundaki iPhone özellikleri (eklenti yoksa sessizce hiçbir şey yapmaz):
   - **Titreşim:** Haptics; ayarlardaki titreşim düğmesiyle kapanır.
   - **"Kasan doldu" bildirimi:** Uygulama arka plana geçince 8 saat sonrasına kurulur, dönünce iptal olur. İzin, oyuncu çevrimdışı kasayı ilk gördüğünde bir kez sorulur.
   - **Puan penceresi:** 5. günden sonra, 3 yıldızlı günün sonunda, en az 10 gün arayla. Kaç kez gösterileceğine Apple karar verir.
   - **Game Center:** Açılışta giriş yapılır. Gün sonunda toplam kazanç gönderilir, başarım açılınca Game Center'a da işlenir. Ayarlar'da "🏆 Game Center → Sıralama" düğmesi var.
10. Gerçek iPhone'da şunları dene:
   - açılış ekranı;
   - ilk gün;
   - uygulamayı kapatıp açınca kaydın durması;
   - Ayarlar'da "bu telefonda" yazısının çıkması.
