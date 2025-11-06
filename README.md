# Seesaw Simulation

Basit bir tahterevalli simülasyonu. Canvas kullanarak yapıldı. Fizik kurallarına göre çalışıyor, tork hesaplaması yapıyor.

## Nasıl Kullanılır

1. `index.html` dosyasını tarayıcıda açın
2. Tahterevallinin tahtasına tıklayın
3. Rastgele ağırlıklarda (1-10 kg) nesneler düşecek
4. Sol ve sağ taraftaki toplam ağırlıkları üstte görebilirsiniz
5. Reset butonuna tıklayarak tüm nesneleri temizleyebilirsiniz

## Nasıl Çalışıyor

Her nesne tıklanan konuma yerleştirilir ve ağırlığına göre tork hesaplanır. Tork farkına göre tahterevalli açısı değişir. Sol taraf daha ağırsa sola, sağ taraf daha ağırsa sağa eğilir.

Nesnelerin boyutu ağırlığına göre değişir. Daha ağır nesneler daha büyük görünür.

## Özellikler

- Canvas ile çizim
- Tıklama ile nesne ekleme
- Tork ve ağırlık hesaplama
- Otomatik denge mekanizması
- LocalStorage ile durum kaydı (sayfa yenilense bile kalır)
- Yumuşak animasyon geçişleri
- Grid çizgileri ile görsel referans

## Teknik Detaylar

- Vanilla JavaScript kullanıldı, framework yok
- Canvas 2D API ile çizim yapılıyor
- Matematiksel hesaplamalar için trigonometri kullanılıyor
- LocalStorage ile veri saklanıyor

## Dosya Yapısı

- `index.html` - Ana HTML dosyası
- `script.js` - Tüm JavaScript kodu
- `style.css` - Stil dosyası

## Teknolojiler

HTML5, CSS3, Vanilla JavaScript

