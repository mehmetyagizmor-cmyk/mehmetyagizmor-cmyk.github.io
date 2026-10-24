# 🗺️ Yol Haritası: Çay Ocağı Tycoon

Son güncelleme: 17 Ekim 2026

## ✅ Tamamlananlar
| Faz | İçerik |
|---|---|
| 1 | Ayrı bölümler (Mutfak / Mağaza / Menü / Eşyalarım), mobil düzen |
| 2 | Duraklatma, ayarlar, titreşim, öğretici |
| 3 | Günlük ödül, başarımlar, gün sonu karnesi |
| 4 | PWA, gizlilik politikası, mağaza görselleri, yayın rehberi |
| 5 | Tarifler + 4 yeni ürün, kombo, günlük görevler (sürüm 1.1.0) |
| 6a | Şube altyapısı, Türkiye'de 5 şehir, müdür geliri, şehir ürünleri (sürüm 1.2.0) |
| 6b | Ünlülük basamakları, röportajlar, paylaşılabilir kapak (sürüm 1.3.0) |
| 6c | Dünya haritası, 5 yurt dışı şubesi ve yerel ürünleri (sürüm 1.4.0) |
| 6d | Yumuşak batma: şube sorunları, kriz, kurtarma (sürüm 1.5.0) |
| Denge | Simülasyonla şube, ünlülük ve batma ayarları (sürüm 1.5.1) |
| Mutfak | Müşteri sabrı günlere göre azalır (sürüm 1.5.2) |
| 7a | Müdavimler ve yemek eleştirmeni (sürüm 1.6.0) |
| 7b | "Sen yokken" kasası (sürüm 1.7.0) |
| 7a+ | İlk gün ve eleştirmen cilası (sürüm 1.7.1) |
| 7c | Gerçek takvime bağlı etkinlikler (sürüm 1.8.0) |
| 7d | Koleksiyon ve antikacı (sürüm 1.9.0) |
| 8a | Play Store hazırlığı: manifest ekran görüntüleri, bayram tarihleri kontrolü (sürüm 2.0.0) |
| 8b | Puan isteği ve arka plan müziği (sürüm 2.1.0) |
| 8c | Usta Mirası (prestij) (sürüm 2.2.0) |
| 9a | Mobilde içerik kendi içinde kayar (itch.io scrolling="no" çerçevesi) (sürüm 2.2.2) |
| 9b-1 | Dikey telefon yerleşimi: 3 sütun masa, aşağı doğru büyüyen dükkân (sürüm 2.3.0) |

---

## ✅ Faz 6 tamamlandı: Şubeler ve Ünlülük

### Kullanıcının istediği (16 Ekim 2026)
1. **İkinci, üçüncü… şube** açılabilsin.
2. Şubeler **dünyada istenen yere** açılabilsin.
3. **Seviye seviye:** Türkiye'de **5 şube** açmadan yurt dışına şube açılamasın.
4. Yurt dışına açıp işleri yoluna koyduktan sonra **batma riski** devreye girsin: Belli başlı şeyler yapılmazsa Türkiye'deki veya yurt dışındaki şubeler **batak versin**.
5. Zamanla **dükkân sahibinin tanınırlığı** artsın; insanlar onunla **röportaj yapmak istesin**, oyuncu isterse **kabul etsin**.
6. **Asıl amaç:** Oyuncunun karakterini zamanla ünlü yapıp **oyuncuya kendini ünlü hissettirmek.**

### 📊 Fikir puanları

| # | Fikir | Eğlence ve bağlılık | Yapım kolaylığı | Risk | **Genel** |
|---|---|:-:|:-:|:-:|:-:|
| 1 | Şube sistemi (2., 3. şube…) | 9 | 5 | Orta | **8.5** |
| 2 | Dünyada istenen yere şube | 8 | 6 | Düşük | **8** |
| 3 | Önce Türkiye'de 5 şube, sonra yurt dışı | 8 | 9 | Düşük | **8.5** |
| 4 | Batma / batak riski | 6 | 6 | **Yüksek** | **6.5** |
| 5 | Tanınırlık (ünlülük) sistemi | 9.5 | 7 | Düşük | **9** |
| 6 | Röportaj istekleri, kabul / ret | 9 | 7 | Düşük | **9** |
| 7 | Ana vizyon: "Oyuncuya ünlü hissettirmek" | 10 | — | — | **10** |

### Puanların gerekçeleri ve öneriler

**1. Şube sistemi (8.5):** Oyunun en güçlü uzun vadeli hedefi olur.
⚠️ Asıl tasarım sorunu şu: Oyuncu aynı anda yalnızca bir dükkânı oynayabilir.
💡 Öneri (karma model): Oyuncunun bulunduğu şube **aktif** oynanır. Diğerlerini bir **şube müdürü** yönetir ve **pasif gelir** getirir. Oyuncu istediği şubeye geçip orada bizzat oynayabilir.

**2. Dünyada istenen yere (8):** "Türk çayını dünyaya taşı" çok güçlü bir fantezi.
💡 Her şehrin bir karakteri olsun:
- Londra'da yağmur sık, sıcak içecekler daha değerli
- Tokyo'da müşteriler hızlı ama sabırsız
- New York'ta yoğun ve bahşişler yüksek
- Dubai'de VIP müşteri çok

Basit, stilize bir dünya haritası yeterli.

**3. Önce Türkiye'de 5 şube (8.5):** Net ve anlaşılır bir basamak; yapması kolay.
💡 Türkiye şehirlerinin her biri yerel bir ürün getirsin:
- **Rize/Trabzon:** taze çay
- **Gaziantep:** fıstıklı baklava
- **İzmir:** boyoz
- **Ankara** ve **İstanbul**

Bu, kültürel bağ kurar ve mağazada öne çıkar.

**4. Batma riski (6.5):** Gerilim katar ama **en riskli fikir.** Mobilde emeği bir anda kaybetmek oyunu sildirebilir.
💡 Öneri, "yumuşak batma":
- **Ana dükkân asla batmaz**, yalnızca şubeler batabilir.
- Önce **uyarı işaretleri** çıkar (📉 düşen gelir, 😠 şikâyetler), sonra **kriz olayı** ve **kurtarma şansı.** Batarsa bile paranın bir kısmı geri gelir.
- İhmal edilebilecek şeyler: hijyen denetimi, personel maaşı/mutluluğu, malzeme kalitesi, itibar, yeni açılan rakip dükkân.

**5. Tanınırlık (9):** Oyunu diğer işletme oyunlarından ayıracak duygusal kanca bu.
💡 Ünlülük basamakları: Mahallede bilinen → Şehirde tanınan → Ünlü girişimci → Türkiye'nin çaycısı → Dünyaca ünlü.
Her basamakta yeni bir şey açılır: daha fazla müşteri, VIP davetleri, özel tabelalar.

**6. Röportaj istekleri (9):** Oyuncuya seçim yaptırması çok değerli.
💡 Röportaj soruları seçmeli olsun; cevaplar ünlülüğü ve itibarı farklı etkilesin.
💡 **Batma sistemiyle bağlansın:** Çok röportaja gitmek ünlülüğü artırır ama şubeler ihmal edilir. Ünlü olmakla işini yürütmek arasında güzel bir denge kurulur.
💡 **🚀 Büyüme için altın fırsat:** Röportaj sonunda oyuncunun karakteriyle, adıyla ve dükkânının adıyla bir **gazete veya dergi kapağı** üretilsin ve **"Paylaş"** düğmesi olsun ("Hasan Usta: Çayı dünyaya taşıyan adam!"). Oyuncular bunu sosyal medyada paylaşır; bu da ücretsiz reklam demek.

**7. Ana vizyon (10):** Mağaza sayfasının ana mesajı olabilir: *"Mahalle çaycısından dünya yıldızına!"*

### 🧩 Önerilen sıralama (Faz 6)
| Alt faz | İçerik | Neden bu sırada? |
|---|---|---|
| 6a | Şube altyapısı + Türkiye'de 5 şehir | Diğer her şey çoklu dükkân yapısına dayanıyor |
| 6b | Tanınırlık + röportajlar + paylaşılabilir kapak | En yüksek puanlı fikir; oyuncunun hissini en çok değiştiren |
| 6c | Dünya haritası + yurt dışı şubeleri | 5 Türkiye şubesi şartı 6a'ya bağlı |
| 6d | Batma / kriz sistemi | Şubeler oturduktan sonra dengelemek daha güvenli |

### ✅ Verilen kararlar (16 Ekim 2026, hepsi önerilen)
1. Diğer şubeleri **müdür yönetir, pasif gelir** getirir; oyuncu istediği şubeye geçip oynayabilir.
2. **Yumuşak batma:** Ana dükkân korunur, şubeler uyarı verir ve kurtarılabilir, batan şube paranın bir kısmını geri verir.
3. Röportajı **reddetmenin faydası** var: o gün dükkâna odaklanma, ekstra gelir ve itibar.
4. Türkiye şehirleri: **İstanbul, Ankara, İzmir, Rize, Gaziantep.**

### ⚖️ Denge turu (16 Ekim 2026)
Oyunun kendi koduyla bir bot oyuncu 60 gün oynatıldı. Bot 0,5 ve 1 saniyede bir hamle yaptı; 4 farklı tohum denendi.

| Kilometre taşı | Önce | Sonra |
|---|---|---|
| İlk Türkiye şubesi | 6–7. gün | 7–8. gün |
| 5 Türkiye şubesi | 12–14 | 20–29 |
| İlk yurt dışı şubesi | 13–18 | 26–33 |
| 5 yurt dışı şubesi | 25–33 | 54–58 (iyi oyuncu) |
| En üst ünlülük | 29–33 | ~57 |

**Değişiklikler:**
- Türkiye şube fiyatları: ₺10.000 / 20.000 / 35.000 / 55.000 / 80.000.
- Yurt dışı şube fiyatları: ₺150.000 / 250.000 / 400.000 / 600.000 / 850.000.
- Müdür geliri artık açılış parasının ~%3'ü + seviyeler. Önceden ₺40.000'lık bir şube günde ₺360 getiriyordu.
- Sorun çözme bedeli açılış parasının %8'i, kurtarma 3 katı. Simülasyonda gelirin ~%18'i sorunlara gitti.
- Ünlülük basamakları: 0 / 150 / 600 / 2000 / 4000.

### 🔥 Mutfak zorluğu (sürüm 1.5.2)
Önceden 10. günde 4 ürünlük bir siparişte müşteri sabrı yaklaşık 67 saniyeydi (bir gün 120 saniye). Dalgın bir oyuncu bile hiç müşteri kaçırmıyordu.

Yeni formül: `PAT = {base:15, item:5, dekor:2, rep:5}`. 3. günden sonra sabır her gün %1,8 azalır, en fazla %38'e kadar.

Simülasyon sonucu (günde kaçan müşteri):

| Oyuncu | 1–3. gün | 4–10 | 11–20 | 21–35 |
|---|---|---|---|---|
| İyi (saniyede 1 hamle) | 0 | 0 | 0–0,2 | 0–0,4 |
| Dalgın (1,5 sn, %25 dikkatsiz) | 0,3–1 | 1–1,3 | 2,3–3,3 | 3–4,6 |
| 25. günden sonra boş bırakılan dükkân | | | | 11–23 (dükkân çöker) |

- Çalışanlar yardım eder ama oyuncunun yerini tutmaz.
- ⚠️ Gerçek insanlarla denenmeli; bot hamle seçiminde kusursuz.

### 6d'de yapılanlar
- Batma riski ilk yurt dışı şubesi açılınca başlar (S.riskOn). Ana dükkân asla batmaz.
- Her gün, oynanmayan her şubede %15 ihtimalle sorun çıkar; röportaj günü bu ihtimal %30 olur.
  - Sorunlar: 🧽 hijyen denetimi, 💸 personel zammı, 📦 tedarik sorunu, 🏪 rakip dükkân, 😠 şikâyetler.
- Sorun sürerken müdür geliri yarıya iner ve şube sağlığı günde 15 düşer.
  - Sağlık 30'un altına inince 🚨 kriz başlar ve gelir sıfırlanır.
  - Sağlık 0 olursa şube batar ve açılış parasının %30'u geri gelir.
  - Hiç ilgilenilmezse süreç yaklaşık 7 gün sürer.
- Çözüm yolları: parayla 🔧 Çöz (günlük gelirin 1,5 katı), krizde 🛟 Kurtar (3 katı) ya da şubeye gidip bir gün bizzat çalışmak.
- Batan şehir yeniden açılabilir. Türkiye şubeleri 5'in altına düşerse yeni yurt dışı şubesi açılamaz.
- Yeni başarım: Kriz Yöneticisi.
- ⚠️ Sorun sıklığı ve maliyetleri uzun oyunla dengelenmeli.

### 6c'de yapılanlar
- Türkiye'de 5 şube açılınca dünya kapısı açılır. Fiyatlar: ₺40.000 / 55.000 / 75.000 / 100.000 / 130.000. Yurt dışı müdürleri 1,5 kat gelir getirir.
- Şehirler ve yerel ürünler:
  - 🥨 Berlin: 🥙 Döner. Gurbetçi mahallesi, çay ve simit pahalı.
  - 💂 Londra: 🧁 Scone. Yağmur, sıcak içecekler pahalı.
  - 🗽 New York: 🍰 Cheesecake. Çok kalabalık, bahşiş %50 fazla.
  - 🗼 Tokyo: 🍡 Mochi. Hızlı ama sabırsız müşteriler.
  - 🏙️ Dubai: 🍫 Dubai Çikolatası. VIP müşteriler çok sık gelir.
- Şubeler panelinde stilize bir dünya haritası var. Türkiye'den açılan şubelere uçuş çizgileri gidiyor. İğneye dokununca o şehrin satırı parlıyor.
- 2 yeni başarım: Dünyaya Açıldın (₺20.000), Dünya Markası (₺100.000).

### 6b'de yapılanlar
- 5 ünlülük basamağı: 0 / 100 / 350 / 1000 / 2500 🌟. Her basamakta müşteri sıklığı %5, bahşiş %5 artar.
- Ünlülük kaynakları: mutlu müşteri (+0,25), gün sonu yıldızları, kusursuz gün, şube açma (+40), her gün şube başına +2, röportajlar.
- Ünlü oyuncudan bazı müşteriler imza ister (✍️) ve fazladan bahşiş bırakır.
- 3. günden sonra her gün %40 ihtimalle röportaj isteği gelir. 5 yayın var: Mahalle Postası → World Tea Times.
- Kabul edersen 3 seçmeli soru gelir (samimi / iddialı / esprili) ve kapak olursun; ama dükkân 10:00'da açılır.
- Reddedersen o gün satışlar %20 fazla olur ve +5⭐ itibar kazanırsın.
- Kapakta oyuncunun karakteri, adı ve sözü yer alır. Paylaş düğmesi telefonun paylaşım menüsünü açar, desteklenmiyorsa resmi indirir.
- ⚠️ Ünlülük hızı uzun oyunla dengelenmeli.

### 6a'da yapılanlar
- Para, gün, menü ve tarifler ortak. Eşyalar, çalışanlar, dükkân seviyesi ve itibar her şubeye ayrı.
- Şube açmak için ana dükkân Nostaljik Kafe olmalı. Fiyatlar: ₺5.000 / 9.000 / 14.000 / 20.000 / 28.000.
- Şehir ürünleri: 🐟 Balık Ekmek, 🍪 Beypazarı Kurusu, 🫓 Boyoz, 🫖 Rize Çayı, 🥜 Fıstıklı Baklava.
- Şehir karakterleri: İstanbul kalabalık ve acelecidir, Ankara sabırlıdır, İzmir'de bahşiş fazladır, Rize'de çay pahalıdır, Gaziantep'te baklava pahalıdır.
- ⚠️ Şube fiyatları ve müdür geliri uzun oyunla dengelenmeli (henüz test edilmedi).

---

## 🚧 Faz 7: Piyasadaki tycoon oyunlarından dersler (17 Ekim 2026)

Kullanıcı piyasadaki tycoon oyunlarının başarı unsurlarını oyuna taşımak istedi.

| Oyun | Başarısının sırrı |
|---|---|
| Good Pizza, Great Pizza | Müşterilerle arkadaşlık, eleştirmenler ve rakipler. Reklamsız, bir yılda günlük 3.000 oyuncudan 60.000'e çıktı (GDC 2018). |
| Cooking Fever | Bir sonraki restoran için mevcut olanın bölümlerini bitirmek gerekir; net ilerleme. |
| Idle Miner / AdVenture Capitalist | Oyuncu yokken para birikir; prestij (baştan başlayıp kalıcı bonus). Etkinlikler ilerlemenin merkezinde. |
| Kolibri Games | Önce 1. gün, sonra 7. ve 30. gün oyuncu tutma. |

| # | Fikir | Örnek aldığı oyun | Genel |
|---|---|---|:-:|
| 1 | Müdavimler ve eleştirmen | Good Pizza | **9.5** |
| 2 | "Sen yokken" geliri (en fazla 8 saat) | Idle Miner | **9** |
| 3 | Gerçek takvime bağlı etkinlikler (29 Ekim, Ramazan, bayramlar, yılbaşı) | Cooking Fever | **8.5** |
| 4 | Koleksiyon (bardak, çaydanlık, semaver) | Kairosoft | **7.5** |
| 5 | Mahalledeki rakip çaycı, haftalık yarışma | Good Pizza | **7.5** |
| 6 | Usta mirası (prestij) | AdVenture Capitalist | **6.5** |
| 7 | Müzik ve ses efektleri | Hepsi | **7** |

**Sıra (kullanıcı önerileni seçti):** 7a müdavimler ve eleştirmen → 7b "sen yokken" geliri → 7c etkinlik takvimi → 7d koleksiyon → sonra rakip çaycı, prestij, müzik.

### 7a'da yapılanlar (sürüm 1.6.0, sw v9)
- 8 müdavim: Ali Amca (1. gün), Ayşe Teyze (2), Öğrenci Zeynep (3), Taksici Rıza (4), Muhtar Hüsnü (6), Ressam Defne (8), Berber Kemal (10), Postacı Selim (12).
- Yalnızca **ana dükkâna** gelirler. Her gün her biri %70 ihtimalle uğrar, günde en fazla 3 kişi. Sıradan bir müşterinin yerine gelirler.
- Sabit görünüm (kasket, gözlük vb.) ve "her zamanki" sipariş. Ürün açık değilse çay ister.
- Mutlu ayrılınca bağ puanı +1 (hızlı servis +2), kızarsa −3. Kalp eşikleri: 3 / 8 / 15 / 25 (4 kalp).
- Her kalp: +%10 bahşiş, +%8 sabır, yeni bir söz ve hediye (₺150 × kalp × ana dükkân çarpanı).
- 4 kalpli her müdavim her gün +1 ünlülük getirir.
- 🧐 Yemek eleştirmeni: 5. günden sonra canlı olay, günde en fazla bir kez. Puan = hız %55 + tarif yıldızları %45, 1–5 yıldız. Ünlülük +puan², itibar (puan−3)×4. Kızarsa 1 yıldız.
- Eşyalarım'da Müdavimler bölümü, gün sonu karnesinde gelen müdavimler ve eleştirmen puanı.
- 2 yeni başarım: Mahallenin Sevgilisi (₺2.500), Beş Yıldız (₺3.000).
- ⚠️ Kalp hızı ve hediye miktarı uzun oyunla dengelenmeli (yaklaşık 18 günde 4 kalp bekleniyor).

### 7b'de yapılanlar (sürüm 1.7.0, sw v10)
- Oyuncu en az 10 dakika uzak kalırsa dönüşte "Tekrar hoş geldin" kasası çıkar. Uygulama kapatılıp açılınca da, arka plandan dönünce de çalışır.
- Kasa en fazla **8 saat** dolar; dolunca "Sık uğra!" uyarısı çıkar (geri dönme sebebi).
- Saatlik gelir = (dükkân payı + şube müdürleri) × 0,5. 8 saat yaklaşık 4 günlük pasif gelire denk; birkaç dakikalık oyundan az.
  - Dükkân payı: en kârlı günün %15'i + her çırak/garson için %5 (en az ₺30). Çalışanı olmayana "Çırak tuttukça daha çok kazanırsın" ipucu çıkar.
  - Şube payı: krizdeki şube 0, sorunlu şube yarım (managedIncome).
- Önce kasa, sonra günlük ödül gösterilir. Oyun sırasında dönülürse kasadan sonra duraklatma ekranı gelir.
- 2. günden önce (öğretici) gösterilmez. Uzaktayken şube sorunu çıkmaz, yalnızca gelir birikir.
- ⚠️ Gerçek telefonda arka plana alıp dönme denenmeli. Saat ileri alınarak hile yapılabilir (kabul edildi, tek oyunculu oyun).

### 7a+ cila (sürüm 1.7.1, sw v11)
Bot oyun testi (35 gün, 3 oyuncu tipi) sonrası:
- **Yeni müdavim garantisi:** Henüz tanışılmamış en erken müdavim o gün 3. müşteriden sonra kesin gelir. Ali Amca artık 1. gün hep geliyor; sonraki günlerde sırayla diğerleri.
- **İlk 2 gün** müşteriler %30 daha sık gelir. 1. günde boş salon süresi %40'tan %6–27'ye indi; servis 16'dan 19–26'ya çıktı.
- **Eleştirmen artık rastgele gelmez:** 5. günden sonra %30 ihtimalle gün sonu karnesinde "Yarın eleştirmen gelecek!" uyarısı çıkar; ertesi gün 25–70. saniye arasında gelir.
  - En pahalı 5 üründen 3 parça ister (15. günden sonra 4). Sabrı ×0,8.
  - Puan = 1 + ⌊4,4 × (0,35 hız + 0,45 tarif + 0,2 salonun huzuru)⌋. Huzur: o gün kızan yoksa 1, 1–2 kişi 0,5, fazlası 0.
  - Simülasyon: hızlı oyuncu çoğunlukla 4, 20. günden sonra ara sıra 5; yavaş 3–4; dalgın ~3; kızdırırsa 1.
- Gün sonu karnesinde **"🛒 Şimdi alabilirsin"** satırı: alınabilecek en ucuz şey. "Sıradaki hedef" alınamayanları göstermeye devam eder.

### 7c'de yapılanlar (sürüm 1.8.0, sw v12)
- 8 etkinlik telefonun gerçek tarihine bağlı:
  - 🎆 Cumhuriyet Bayramı (27–31 Ekim)
  - 🎄 Yeni Yıl (26 Aralık–2 Ocak)
  - 💕 Sevgililer Günü (12–15 Şubat)
  - 🌙 Ramazan
  - 🍬 Ramazan Bayramı
  - 🎈 23 Nisan (21–24 Nisan)
  - 🐑 Kurban Bayramı
  - ☀️ Yaz Festivali (15 Temmuz–15 Ağustos)
- Hicri bayramlar için 2026–2030 tablosu (HIJRI) var. ⚠️ Tarihler yaklaşık (±1 gün); yayından önce Diyanet takvimiyle kontrol edilmeli, 2030 sonrası eklenmeli.
- Her etkinlikte:
  - Dükkân süslemesi (bayraklar, kar, fener ve mahya, balon, şeker renkleri, güneş)
  - Yalnızca etkinlikte menüde olan ürün (EV_PRODUCTS). Fiyatı ana dükkân seviyesiyle büyür, tarifi yoktur.
  - Bahşiş, kalabalık veya fiyat bonusu
- Ramazan: gündüz müşteri %30 seyrek, 17:00 sonrası (iftar) 2 kat sık.
- Görev: etkinlik boyunca N müşteri (50–150). Ödül: para (600 × ana dükkân çarpanı) ve koleksiyon parçası (S.col; 7d'de raf). Ertesi yıl tekrar yapılabilir (anahtar: etkinlik-yıl), parça zaten varsa yalnızca para verilir.
- Mutfakta etkinlik şeridi (kalan gün ve görev ilerlemesi). Etkinlik yoksa 14 gün içindekinin haberi. İlk açılışta "Etkinlik başladı" kartı.
- Yeni başarım: Bayram Coşkusu.
- Test için adres sonuna ?tarih=2026-10-29 eklenebilir.

### 7d'de yapılanlar (sürüm 1.9.0, sw v13)
- 5 set, 24 parça. Satın alınabilir 4 set:
  - 🫖 Çay Takımı: bahşiş (₺1.500–25.000)
  - 🎲 Kıraathane Köşesi: sabır (₺6.000–80.000)
  - 📻 Nostalji Rafı: ünlülük (₺20.000–250.000)
  - 🧿 Uğur Getirenler: sen yokken kasası (₺40.000–400.000)
- 🎉 Bayram Hatıraları (8 parça) yalnızca etkinlik görevlerinden kazanılır.
- Her parça küçük kalıcı bonus verir (%2–5); set tamamlanınca büyük bonus (%6–20).
- Antikacı Mağaza'da, 3. günden sonra açılır. Vitrin her gün yenilenir: alınmamış en ucuz 6 parçadan 3'ü.
- Sahip olunan parçalar dükkânda pencerelerin altındaki rafta görünür. Eşyalarım'da koleksiyon bölümü var.
- Yeni başarım: Koleksiyoncu.
- Bot (45 gün): 15. günde 10 parça ve 1 set; 40. günde satın alınabilir 16 parçanın hepsi alınmış.
- ⚠️ 35. günden sonra para yine birikiyor; ileride prestij veya rakip çaycı düşünülebilir.

---

## 📲 Faz 8: Play Store yayını (25 Ekim 2026)

Kullanıcı oyunu Google Play'de yayınlamaya karar verdi. Sıra: 8a yayın hazırlığı → 8b puan isteği + müzik → 8c prestij (usta mirası). Yayından sonra: rakip çaycı, İngilizce.

### 8a'da yapılanlar (sürüm 2.0.0, sw v14)
- Manifest'e 4 ekran görüntüsü eklendi (`screenshots`, form_factor narrow); PWABuilder ve Android kurulum ekranı için.
- `orientation` bilerek `any` bırakıldı: oyunun yatay telefon düzeni var (index.html'deki landscape medya sorgusu).
- Gizlilik linki Ayarlar'da zaten vardı.
- Bayram tarihleri: 2026–2027 Diyanet takvimiyle aynı. 2028–2030 Diyanet henüz açıklamadığı için tahmini; her yıl kontrol et. Aralık 2030'da başlayan ikinci Ramazan tabloda yok.
- ⚠️ `privacy.html` e-postası hâlâ örnek; kullanıcı adresi verince değiştirilecek.

### 8b'de yapılanlar (sürüm 2.1.0, sw v15)
- **Puan isteği:** 5. günden sonra 3 yıldızlı bir günün karnesinde "⭐ Puan ver / Sonra" kutusu. Yalnızca Android'de ve `PLAY_ID` doluyken; en fazla 3 kez, arada en az 7 gün (S.rateAsks, S.rateNext). "Puan ver" Play sayfasını açar ve bir daha sormaz (S.rated).
- ⚠️ `PLAY_ID` boş: PWABuilder'da Package ID belirlenince doldurulmalı (YAYIN-REHBERI 2a-5).
- **Müzik:** Web Audio ile kodla üretilen 32 vuruşluk Re hicaz melodisi (üçgen + oktav sinüs, kısa "saz" tınısı) ve 16 vuruşta bir alçak dem (Re-La). Yalnızca dükkân açıkken, pencere yokken ve sekme görünürken çalar; yumuşak açılıp kapanır.
- Ayarlar'da ayrı 🎵 Müzik düğmesi (`cayocagi-muzik`). Ses kapalıysa müzik de çalmaz.
- ⚠️ Müzik gerçek telefonda dinlenmeli: ses düzeyi ve uzun oyunda tekrar hissi.

### 8c'de yapılanlar (sürüm 2.2.0, sw v16)
- **Usta Mirası:** Ana dükkân Ünlü Mekân ve en az 15. gün olunca Mağaza'da (ana dükkândayken, dükkân kapalıyken) "Devret" düğmesi.
- Miras puanı = ⌊√(toplam kazanç / 5000)⌋ (₺80 bin → 4, ₺1 milyon → 14). Her puan kalıcı +%5 satış (basePrice × legacyMult; etkinlik ürünleri dahil). Puanlar devirler boyunca birikir (S.legacy = {n, pts}).
- Kalanlar (LEGACY_KEEP): sahip, ünlülük, röportajlar/kapak, başarımlar, koleksiyon, günlük seri, etkinlik görevleri, puan isteği durumu. Geri kalan her şey fresh().
- Unvan: Usta → Pir → Çay Efsanesi; profil satırında 🎖️ ile görünür.
- Yeni başarım: Usta Mirası (₺1.000, devirden hemen sonra verilir: yeni başlangıca küçük destek).
- ⚠️ Puan formülü uzun oyunla dengelenmeli: ikinci turun ne kadar hızlı geçtiği gerçek oyuncularla izlenmeli.

## 📝 Bekleyen diğer işler
- [x] `privacy.html` iletişim e-postası yazıldı
- [ ] Gerçek Android / iPhone'da test
- [x] Simülasyonla denge turu (şubeler, ünlülük, batma)
- [x] Mutfak zorluğu simülasyonla ayarlandı
- [ ] Mutfak zorluğu gerçek oyuncularla denenmeli
- [ ] Arka plan müziği
- [x] Müdavimler (7a, sürüm 1.6.0)
- [x] "Sen yokken" kasası (7b, sürüm 1.7.0)
- [x] 7a+ cila, 7c etkinlik takvimi, 7d koleksiyon
- [ ] Sonraki adaylar: rakip çaycı, prestij (usta mirası), müzik, İngilizce, gerçek telefonda test
- [ ] Çalışan eğitimi
- [ ] İngilizce dil desteği
