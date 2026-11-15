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

## Mac'te Capacitor kurulumu (Apple geliştirici hesabı açılınca)

1. Bir klasöre oyunun dosyalarını `www/` olarak koy: index.html, privacy.html, manifest.webmanifest, icons, fonts, scene3d.js, people3d.js, mahalle3d.js, vendor.
2. Kurulum:
   ```bash
   npm init -y
   npm i @capacitor/core @capacitor/cli @capacitor/ios @capacitor/preferences @capacitor/status-bar @capacitor/splash-screen
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
7. Gerçek iPhone'da şunları dene:
   - açılış ekranı;
   - ilk gün;
   - uygulamayı kapatıp açınca kaydın durması;
   - Ayarlar'da "bu telefonda" yazısının çıkması.
