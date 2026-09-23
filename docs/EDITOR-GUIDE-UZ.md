# 142-Maktab Veb-Platformasi: Tahririyat va O‘qituvchilar uchun Amaliy Qo‘llanma

Ushbu qo‘llanma maktab o‘qituvchilari, tahririyat a’zolari (muharrirlar) va maktab ma’murlari uchun mo‘ljallangan. Tizimdan foydalanish uchun dasturlash yoki texnik bilimlarga ega bo‘lish talab etilmaydi.

---

## 1. Tizimga Kirish va Rollar Tizimi

Boshqaruv paneliga kirish manzili:  
👉 **`https://maktab142.uz/admin`** (mahalliy ishlab chiqishda: `http://localhost:3000/admin`)

Tizimda 3 ta aniq belgilangan rol mavjud:
1. **O‘qituvchi / Muallif (`teacher`):**
   - Faqat o‘zining shaxsiy biografik profilini tahrirlashi mumkin.
   - Yangi maqolalar yozib, qoralama sifatida saqlashi va muharrirga ko‘rib chiqish uchun yuborishi mumkin.
   - Boshqa o‘qituvchilarning ma’lumotlarini ko‘ra olmaydi va to‘g‘ridan-to‘g‘ri saytga nashr qila olmaydi.
2. **Muharrir (`editor`):**
   - Barcha o‘qituvchilarning profillarini boshqaradi va tasdiqlaydi.
   - Taqdim etilgan maqolalarni o‘qiydi, tahrir qiladi va saytga nashr etadi (`nashr_qilingan`).
   - Rasmiy e’lonlar, maktab jurnallari (PDF), yutuqlar va fotogalereyani to‘liq boshqaradi.
3. **Administrator (`admin`):**
   - Tizimga yangi o‘qituvchi va xodimlarni qo‘shadi, parollarni yangilaydi.
   - Maktabning rasmiy yuridik rekvizitlari, telefon raqamlari va ijtimoiy tarmoq havolalarini yangilaydi.

---

## 2. Boshqaruv Paneli Interfeysi va Tuzilishi

Kirgandan so‘ng sizni maktab ehtiyojlariga moslashtirilgan o‘zbek tilidagi qulay panel kutib oladi:

```
┌────────────────────────────────────────────────────────────────────────┐
│  🏫 142-maktab Boshqaruv Paneli             [👤 Alisher R.] [Chiqish] │
├──────────────────────────────┬─────────────────────────────────────────┤
│  MENYU                       │  BOSHQARUV PANELI (DASHBOARD)           │
│                              │                                         │
│  📊 Boshqaruv paneli        │  ⚡ TEZKOR AMALLAR                       │
│                              │  [+ Yangilik yozish]   [👤 Profilim]    │
│  KONTENT                     │  [+ E’lon qo‘shish]    [📚 Jurnal PDF]  │
│  📰 Yangiliklar              │                                         │
│  📢 E’lonlar va xabarlar    │  📝 KO‘RIB CHIQISH KUTILAYOTGANLAR (2)  │
│  🏆 Maktab yutuqlari         │  • Robototexnika to‘garagi faoliyati    │
│  📸 Fotogalereyalar          │  • Kimyo laboratoriyasida ochiq dars    │
│                              │                                         │
│  XODIMLAR                    │  📢 AMALDAGI E’LONLAR (Faol: 2 ta)      │
│  👥 O‘qituvchilar ro‘yxati   │  • 1-sinfga qabul (Tugaydi: 15-sentyabr)│
│                              │                                         │
│  NAS HRLAR                   │  💡 YORDAM VA MASLAHAT                  │
│  📚 Maktab jurnallari        │  Har bir rasm uchun alt-matn kiritishni │
│  ✍️ Blog va maqolalar        │  unutmang. Savollar: @maktab142_admin   │
│                              │                                         │
│  TIZIM                       │                                         │
│  ⚙️ Maktab sozlamalari       │                                         │
│  📖 Yordam va yo‘riqnoma    │                                         │
└──────────────────────────────┴─────────────────────────────────────────┘
```

---

## 3. O‘qituvchilar uchun Bosqichma-Bosqich Yo‘riqnoma

### 3.1. Yangi maqola yozish va tahririyatga yuborish
1. Chap menyudan **"Yangiliklar"** bo‘limiga kiring va **"Yangilik qo‘shish"** tugmasini bosing.
2. **Sarlavha (Title):** Maqolaning aniq sarlavhasini yozing (masalan: *Matematika fanidan ochiq dars tashkil etildi*). Veb-manzil (slug) avtomatik hosil bo‘ladi.
3. **Qisqa mazmuni (Anons):** Bosh sahifada ko‘rinadigan 1-2 jumlali qisqa tavsif kiriting.
4. **Rukn (Kategoriya):** Maqolaga mos ruknni tanlang (*Akademik jarayon*, *Tadbirlar*, *Sport*).
5. **Muqova rasmi:** **"Media kutubxonasi"** orqali gorizontal sifatli rasm tanlang yoki kompyuterdan yuklang (16:10 nisbatda). Majburiy **Alt-matn** (masalan: *10-A sinf o‘quvchilari parta ortida*) yozing.
6. **Maqola matni:** Qulay matn muharriri orqali matnni yozing. Matnda sarlavhalar, qora/qiyiq harflar, ro‘yxatlar va iqtiboslardan foydalanishingiz mumkin.
7. **Nashr holati (Status):**
   - Agar hali to‘liq yozib bo‘lmagan bo‘lsangiz: **"Qoralama"** holatida saqlang.
   - Agar maqola tayyor bo‘lsa: **"Ko‘rib chiqilmoqda"** holatiga o‘tkazing va **"Saqlash"** tugmasini bosing.
8. Muharrir maqolangizni tekshirib, xatolar bo‘lmasa uni saytga chiqaradi. Agar kamchilik bo‘lsa, **"Tahririyat izohlari"** maydonida ko‘rsatma qoldirib, maqolani qayta ishlashga qaytaradi.

### 3.2. O‘z shaxsiy biografik profilingizni yangilash
1. Chap menyudan **"O‘qituvchilar va xodimlar"** bo‘limiga o‘ting.
2. O‘zingizning profilingizni oching (Siz faqat o‘zingizga biriktirilgan profilni o‘zgartira olasiz).
3. Toifangiz, erishgan yutuqlaringiz, qisqa tarjimai holingiz yoki fotosuratingizni yangilang.
4. **"Saqlash"** tugmasini bosing. Tahririyat tekshiruvidan so‘ng o‘zgarishlar saytda aks etadi.

---

## 4. Muharrirlar uchun Amaliy Yo‘riqnoma

### 4.1. Taqdim etilgan maqolani tekshirish va nashr etish
1. Boshqaruv panelida **"Ko‘rib chiqilmoqda"** holatidagi yangiliklarni oching.
2. Maqolani o‘qib chiqing, imlo xatolarini to‘g‘rilang va fotosurat sifatini ko‘zdan kechiring.
3. Agar maqola talabga javob bersa:
   - **Holati:** **"Nashr qilingan" (Published)** holatiga o‘tkazing.
   - **"Saqlash"** tugmasini bosing. Maqola darhol maktab bosh sahifasida va yangiliklar ro‘yxatida paydo bo‘ladi.
4. Agar qayta ishlash talab etilsa:
   - **Tahririyat izohlari:** Nimalarni tuzatish kerakligini yozing (masalan: *Rasmni sifatlisiga almashtiring va 2-xatboshiga o‘quvchilar ismini qo‘shing*).
   - **Holati:** **"O‘zgartirish kerak"** ga o‘tkazib, saqlang.

### 4.2. Rasmiy e’lon joylashtirish va muddatini belgilash
1. **"E’lonlar"** bo‘limiga o‘ting va **"Yangi e’lon"** tugmasini bosing.
2. E’lon sarlavhasi va matnini kiriting.
3. **Muhimlik darajasi:** *Oddiy* (ko‘k), *Muhim* (sariq), *Shoshilinch* (qizil).
4. **Boshlanish va Tugash vaqti (Asia/Tashkent):**
   - Masalan: Boshlanishi bugun, tugashi 2026-yil 25-sentyabr 18:00.
5. **Holati:** **"Faol"** holatida saqlang.
6. ⚠️ **Avtomatik muddat nazorati:** Belgilangan tugash vaqti o‘tishi bilan e’lon bosh sahifadan o‘z-o‘zidan yo‘qoladi va arxivga o‘tadi. Muharrirning uni qo‘lda o‘chirishi shart emas!

### 4.3. Maktab jurnalining yangi sonini joylashtirish (PDF)
1. **"Maktab jurnallari"** bo‘limiga kiring.
2. Jurnal nomi, soni (masalan: *2026-yil 2-son*), chiqarilgan sanasini kiriting.
3. Muqova rasmini (3:4 nisbatda) yuklang.
4. Jurnalning to‘liq PDF faylini yuklang. Fayl hajmi (masalan: *3.2 MB*) va sahifalar sonini ko‘rsating.
5. Qisqa mundarijasini yozing va **"Nashr qilingan"** holatida saqlang.
6. Saytda jurnal muqovasi, annotatsiyasi va ikkita qulay tugma: **"PDFni ochish"** hamda **"Yuklab olish"** paydo bo‘ladi.

### 4.4. Tasodifiy xatolikda eski versiyani tiklash (Version History / Restore)
1. Agar siz yoki boshqa xodim maqoladagi kerakli matnni bilmasdan o‘chirib yuborsa, maqola sahifasining o‘ng tomonidagi **"Versiyalar tarixi" (Revisions)** havolasini bosing.
2. Oldingi tahrirlar ro‘yxatidan kerakli sana va muallifni tanlang.
3. Oldingi holatni ko‘rib chiqib, **"Ushbu versiyani tiklash" (Restore this version)** tugmasini bosing. Hujjat bir zumda oldingi holatiga qaytadi.

---

## 5. Administratorlar uchun Yo‘riqnoma

### 5.1. Yangi o‘qituvchiga tizimga kirish huquqini berish
1. **"Foydalanuvchilar"** bo‘limiga kiring -> **"Foydalanuvchi qo‘shish"**.
2. O‘qituvchining ismi, xizmat elektron pochtasi va vaqtinchalik parolini kiriting.
3. **Tizimdagi roli:** **"O‘qituvchi"** ni tanlang.
4. **Bog‘langan o‘qituvchi profili:** Ro‘yxatdan ushbu pedagogning maktab bazasidagi profilini tanlang.
5. Saqlang va o‘qituvchiga ma’lumotlarni taqdim eting.

### 5.2. Maktabning rasmiy yuridik rekvizitlarini yangilash
1. **"Maktab sozlamalari"** (Globals) bo‘limiga o‘ting.
2. Telefon, rasmiy e’lon qilingan qabul kunlari, xalqaro universitetlar uchun kollej maslahatchisi (Counselor) pochtasini yangilang.
3. Barcha ma’lumotlar butun saytning taglavhasi (Footer), aloqa sahifasi va maktab profilida avtomatik yangilanadi.
