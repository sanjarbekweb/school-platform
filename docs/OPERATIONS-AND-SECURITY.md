# Operations, Infrastructure & Security Runbook: 142-Maktab Platform

**Tizim:** `school-platform` (Next.js 15 + Payload CMS 3 + PostgreSQL / SQLite)  
**Sana:** 2026-yil sentabr  
**Mas’ul:** Bosh tizim arxitektori va DevOps ma’muri  

---

## 1. Infratuzilma Komponentlari va Tahliliy Xarajatlar (Infrastructure Matrix)

`system_design_skill.md` talablariga muvofiq, tizimdagi har bir quti uchun aniq tahlil:

| Infratuzilma qismi | Asosiy maqsadi | Muqobil variantlar va trade-off | Operatsion yuklama | Nosozlikdagi xatti-harakati (Failure Mode) | Taxminiy oylik xarajat | Tiklash strategiyasi (Recovery) |
|---|---|---|---|---|---|---|
| **Yagona Dastur Serveri (Next.js + Payload)** | Ommaviy sahifalarni render qilish va CMS boshqaruvini yuritish | *Muqobil:* Alohida frontend (Next.js) + Alohida headless CMS (Strapi/WordPress).<br>*Trade-off:* Monolit tarmoq kechikishini yo‘qotadi va 2 barobar kam xotira talab qiladi. | Kam. Yagona jarayonni monitoring qilish va yangilash kifoya. | Server to‘xtasa, butun sayt vaqtincha ochilmaydi (502 Bad Gateway). | ~$12 – $24/oy (2 vCPU, 4GB RAM VPS). | PM2 / Docker avtomatik restart (5 soniyada tiklanadi). |
| **Ma’lumotlar bazasi (PostgreSQL 16)** | ACID tranzaksiyalari, foydalanuvchilar, versiyalar tarixi va kontent xotirasi | *Muqobil:* SQLite (nol-konfiguratsiya) yoki MySQL.<br>*Trade-off:* Postgres murakkabroq, lekin yuqori parallel yozish va JSONB indeksatsiyasiga ega. | O‘rtacha. Indekslar, disk hajmi va ulanishlar havzasini nazorat qilish. | Baza to‘xtasa, sayt statik sahifalari keshdan ishlashda davom etadi, ammo tahririyat va dinamik qidiruv to‘xtaydi. | Server narxi ichida (o‘z serverida) yoki $15/oy (Managed RDS). | Kundalik `pg_dump` zaxira nusxasidan `psql < backup.sql` orqali 10 daqiqada tiklanadi. |
| **Media Saqlash Xotirasi (Persistent Volume)** | O‘qituvchilar rasmlari, yangiliklar fotosuratlari va maktab jurnali PDF fayllari | *Muqobil:* AWS S3 / Cloudflare R2 / MinIO.<br>*Trade-off:* Mahalliy diskda saqlash bepul va sodda, lekin server diskiga bog‘liq. | Kam. Disk to‘lib qolmasligini kuzatish (Alert > 80%). | Disk to‘lsa, yangi rasm yuklab bo‘lmaydi (HTTP 500). Mavjud fayllar ko‘rinib turadi. | Bepul (server diski hisobidan) yoki $5/oy (S3 zaxira). | `scripts/backup.mjs` zaxirasidan `scripts/restore.mjs` bilan 2 daqiqada tiklanadi. |
| **Teskari Proksi (NGINX / Cloudflare)** | SSL/TLS shifrlash, Gzip/Brotli siqish, port yo‘naltirish, DDoS filtrlash | *Muqobil:* Node.js-ni to‘g‘ridan-to‘g‘ri 80/443-portga chiqarish.<br>*Trade-off:* NGINX xavfsizroq va statik fayllarni Node.js-dan 5 barobar tez uzatadi. | Juda kam. Bir marta sozlanadi, SSL avtomatik yangilanadi (Certbot). | NGINX to‘xtasa, saytga ulanish rad etiladi (Connection Refused). | $0 (Open-source NGINX + Let's Encrypt). | `systemctl restart nginx` (1 soniya). |

---

## 2. Yagona Serverning To‘xtab Qolish Xatari va Yechimi (Single-Server Risk & Mitigation)

Yagona serverli arxitektura (Single-Server Deployment) eng tejamkor va boshqarish oson model bo‘lsa-da, apparat nosozligida xizmat to‘xtashi (downtime) xavfi mavjud.

**Ushbu xavfni boshqarish bo‘yicha qat’iy chora-tadbirlar:**
1. **Avtomatik jarayon nazoratchisi (Supervisor):**
   - PM2 yoki Docker Compose `--restart unless-stopped` bayrog‘i bilan ishga tushiriladi. Agar Node.js xotira oshib ketishi yoki kutilmagan istisno (uncaught exception) tufayli yiqilsa, 3 soniyada avtomatik qayta ko‘tariladi.
2. **Konteynerlashtirish (Docker):**
   - Tizim to‘liq `compose.yaml` va `Dockerfile` orqali o‘ralgan. Agar mavjud server to‘liq ishdan chiqsa, istalgan yangi VPS-da buyruq berilgach, 5 daqiqada butun stek qayta ishga tushadi.
3. **Offsite (Masofaviy) zaxira:**
   - Zaxira nusxalari faqat o‘sha serverning o‘zida qolmaydi; `rclone` yoki SCP orqali har kecha maktabning tashqi Google Drive yoki masofaviy xavfsiz serveriga sinxronlanadi.

---

## 3. Zaxira Nusxalarini Olish va Qayta Tiklash Runbooki

### 3.1. Avtomatik Zaxira olish (`npm run backup`)
Tizimda `scripts/backup.mjs` vositasi yaratilgan. U bir vaqtning o‘zida ham ma’lumotlar bazasini, ham barcha yuklangan media fayllarni nusxalaydi:
```bash
npm run backup
```
Natija:
- `backups/db-backup-YYYY-MM-DDTHH-MM-SS.sqlite` (yoki `.sql`)
- `backups/media-backup-YYYY-MM-DDTHH-MM-SS/` (barcha PDF va fotosuratlar)
- `backups/manifest-YYYY-MM-DDTHH-MM-SS.json` (tekshiruv metama’lumotlari)

### 3.2. Falokatdan Tiklash Mashqi (`npm run restore`)
Agar ma’lumotlar tasodifan buzilsa yoki o‘chirib yuborilsa:
```bash
npm run restore
```
Buyruq eng so‘nggi to‘liq zaxirani tanlaydi, bazani va media fayllarni asliga qaytaradi. So‘ngra tizim yaxlitligi `npm run verify` orqali 100% avtomatik tekshiriladi.

---

## 4. Xizmat Sog‘lomligini Nazorat Qilish (Health Check & Monitoring)

Saytda avtomatlashtirilgan salomatlik monitoringi uchun maxsus endpoint mavjud:  
👉 **`GET /api/health`**

Javob formati (HTTP 200 OK):
```json
{
  "status": "healthy",
  "database": "connected",
  "uptime": 86420,
  "timestamp": "2026-09-14T02:47:00.000Z",
  "version": "1.0.0",
  "service": "142-school-platform"
}
```

Ushbu endpointni UptimeRobot, BetterUptime yoki Cron-job orqali har 60 soniyada tekshirib turish tavsiya etiladi. Agar ketma-ket 2 marta xatolik qaytsa, ma’muriyat Telegramiga xabar yuboriladi.

---

## 5. Xavfsizlik Choralarining Amalga Oshirilishi (Security Hardening)

1. **Rollar va Ruxsatlar Izolyatsiyasi:**
   - API va Server Actions darajasida ruxsatlar tekshiriladi. Tugmani yashirish xavfsizlik hisoblanmaydi; serverda `canMutateStaff`, `canMutateNews` va `canSetPublicationStatus` funksiyalari har bir so‘rovni qat’iy tekshiradi.
2. **Qoralamalar va Maxfiy Fayllar Maxfiyligi:**
   - Tizimga kirmagan tashrif buyuruvchilar hech qachon qoralama (`qoralama`, `korib_chiqilmoqda`) holatidagi maqolalarni o‘qiy olmaydi.
   - `Media` to‘plamida `isPrivate: true` bo‘lgan ichki fayllar va o‘quvchilarning shaxsiy hujjatlari ommaviy API va qidiruvdan qat’iy himoyalangan.
3. **Parollar va Seanslar:**
   - Payload CMS o‘rnatilgan xavfsiz PBKDF2 / Bcrypt parollash algoritmlari va HTTP-only, SameSite=Strict cookie seanslaridan foydalanadi.
4. **Rate Limiting:**
   - Login urinishlari va qidiruv so‘rovlari uchun cheklovlar o‘rnatilgan.
5. **Eski havolalarni 301 Redirect orqali xavfsiz boshqarish:**
   - Eski WordPress manzillari (`/wp-admin`, `/feed`, `/maktab-profili/`) yangi rasmiy manzillarga xavfsiz yo‘naltiriladi.

---

## 6. Serverga O‘rnatish Bo‘yicha Qisqa Ko‘rsatma (Deployment Steps)

1. Serverga Node.js 20/22 va Git o‘rnating.
2. Loyihani yuklab oling:
   ```bash
   git clone <repo-url> school-platform
   cd school-platform
   ```
3. Bog‘liqliklarni o‘rnating:
   ```bash
   npm install --frozen-lockfile
   ```
4. `.env` faylini sozlang (`.env.example` namunasida).
5. Ishlab chiqarish versiyasini quring:
   ```bash
   npm run build
   ```
6. Standart ma’lumotlarni yuklang va tizimni tekshiring:
   ```bash
   npm run verify
   ```
7. Jarayonni PM2 orqali fonda ishga tushiring:
   ```bash
   pm2 start npm --name "maktab142" -- start
   pm2 save
   pm2 startup
   ```
8. NGINX konfiguratsiyasini ulab, SSL sertifikatini yoqing. Sayt to‘liq ishga tushadi!
