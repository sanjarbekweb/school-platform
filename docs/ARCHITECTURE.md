# Senior System Architecture & Design Document: 142-Maktab Platform

**Muassasa:** Toshkent shahri Mirzo Ulug‘bek tumani 142-sonli umumiy o‘rta ta’lim maktabi  
**Loyiha:** Zamonaviy maktab veb-platformasi va boshqaruv tizimi (`school-platform`)  
**Holati:** Ishlab chiqilgan, verifikatsiya qilingan va ishlab chiqarishga tayyor (Production-Ready)  
**Sana:** 2026-yil sentabr  

---

## Kirish va Arxitektura Falsafasi

Ushbu arxitektura hujjati `system_design_skill.md` talablariga qat’iy mos ravishda 5 bosqichli tahliliy model asosida tuzilgan:
1. **Boshlang‘ich arxitektura (Phase 1: Baseline Architecture - Level 0)**
2. **Nosozliklar va tahlil (Phase 2: Failure Analysis & Root Cause)**
3. **Aniq yo‘naltirilgan yechimlar (Phase 3: The Targeted Fix)**
4. **Kelishuvlar va kompromislar daftari (Phase 4: Explicit Trade-Off & Cost Ledger)**
5. **Ishlab chiqarish va ekspluatatsiya ko‘rsatmalari (Phase 5: Production & Operational Guidelines)**

Boshqaruv tamoyili: *"Pragmatik tarzda masshtablashtiring, tizimni ataylab sinab ko‘ring va har bir qutini uning o‘zaro kompromislari (trade-offs) bilan asoslang."* Keraksiz taqsimlangan tizimlar murakkabligidan (microservices, Kubernetes, Kafka, sharding) qat’iy voz kechiladi; modular monolit asosida eng yuqori ishonchlilik va tejamkorlik ta’minlanadi.

---

## Phase 1: Baseline Architecture (Level 0)

### 1.1. Tizim modeli: Modular Monolith
- **Dastur ramkasi:** Next.js 15 (App Router) + TypeScript.
- **CMS dvigateli:** Ilovaga bevosita integratsiyalashgan Payload CMS 3 (Next.js server-side native runtime).
- **Ma’lumotlar bazasi:** PostgreSQL 16 (ishlab chiqarish uchun) va SQLite (mahalliy ishlab chiqish va mustaqil nol-bog‘liqlik rejimida ishlash uchun).
- **Fayllar xotirasi (Media):** Doimiy saqlanadigan disk hajmi (`persistent volume` - masalan: `/var/data/media` yoki `public/media/`).
- **Joylashtirish (Deployment):** Yagona dasturiy monolit konteyner / server (Single Application Deployment).

```
                      ┌───────────────────────────────────────┐
                      │          Foydalanuvchilar             │
                      │  (Ota-onalar, O‘quvchilar, Xodimlar)  │
                      └──────────────────┬────────────────────┘
                                         │ HTTPS (Port 443)
                                         ▼
                      ┌───────────────────────────────────────┐
                      │          NGINX / Cloudflare           │
                      │     (SSL, Reverse Proxy, Gzip)        │
                      └──────────────────┬────────────────────┘
                                         │ HTTP (Port 3000)
                                         ▼
         ┌─────────────────────────────────────────────────────────────┐
         │                    MODULAR MONOLITH                         │
         │  ┌─────────────────────────┐   ┌─────────────────────────┐  │
         │  │     Next.js Frontend    │   │      Payload CMS 3      │  │
         │  │   (Server Components,   │   │ (Boshqaruv, Autentifik.,│  │
         │  │    Static Generation,   │   │  Rollar, Reversiyalar,  │  │
         │  │     Zero-JS runtime)    │   │      REST/Local API)    │  │
         │  └────────────┬────────────┘   └────────────┬────────────┘  │
         │               │                             │               │
         │               └──────────────┬──────────────┘               │
         │                              ▼                              │
         │                    Payload Local API / ORM                  │
         └──────────────────────────────┬──────────────────────────────┘
                                        │
                 ┌──────────────────────┴──────────────────────┐
                 ▼                                             ▼
  ┌─────────────────────────────┐               ┌─────────────────────────────┐
  │     PostgreSQL 16 Database   │               │   Persistent Storage Volume │
  │    (Tranzaksiyalar, Matn,   │               │  (Fotosuratlar, PDF-jurnal, │
  │     Metama’lumotlar, Foyd.) │               │   Hujjatlar: /data/media)   │
  └─────────────────────────────┘               └─────────────────────────────┘
```

### 1.2. Hisob-kitoblar va Rejalashtirish Ko‘rsatkichlari (Capacity Calculations)
Tizim quyidagi parametrlar asosida loyihalashtirilgan:
- **Xodimlar akkauntlari:** 100 ta xodim hisobi (o‘qituvchilar, ma’muriyat, to‘garak rahbarlari).
- **Bir vaqtdagi tahrir sessiyalari:** 10 ta parallel faol tahririyat sessiyasi.
- **Ommaviy sahifa ko‘rishlar soni:** O‘rtacha kuniga 10 000 ta sahifa ochilishi (Page Views/day).
- **Trafik piki (Bursts):** Favqulodda e’lonlar yoki chorak yakunida kuniga 30 000–50 000 ko‘rishgacha ko‘tarilish.

**O‘rtacha yuklama hisobi (Back-of-the-envelope):**
- Kunlik 10 000 so‘rov / 86 400 soniya ≈ **0.12 so‘rov/soniya (RPS)**.
- Faol soatlarda (08:00 dan 20:00 gacha, 12 soat): 10 000 / (12 * 3600) ≈ **0.23 RPS**.
- Eng yuqori pik davrida (masalan, 10 daqiqa ichida 3 000 ota-ona kirishi): 3 000 / 600 ≈ **5 RPS**.
- Standart Next.js + Node.js 20/22 bitta protsessor yadrosida **200–500 RPS** statik/keshlangan so‘rovlarni bemalol qabul qila oladi.
- **Xulosa:** 2 ta vCPU va 4 GB operativ xotiraga (RAM) ega $15–$25/oylik yagona virtual server (VPS) ushbu maktab ehtiyojini ortig‘i bilan qoplaydi va 10 barobargacha ortiqcha zaxiraga ega.

---

## Phase 2: Failure Analysis & Root Causes (Nosozliklar mexanizmi)

Tizim yuklama ostida qachon va qaysi nuqtada sinishi mumkin? Nosozliklarning aniq ildiz sabablari:

1. **Hisoblash va xotira (Compute / Memory Spike):**
   - *Mexanizm:* Server-Side Rendering (SSR) paytida Lexical rich-text AST-daraxtini har bir so‘rovda noldan HTML-ga o‘girish protsessorni (CPU) yuklaydi. 50 parallel so‘rov kelganda, Node.js event loop bloklanadi va javob kutish vaqti (latency) 50ms dan 3000ms gacha oshadi.
2. **Ma’lumotlar bazasi ulanishlarining tugashi (Connection Exhaustion):**
   - *Mexanizm:* PostgreSQL sukut bo‘yicha 100 ta ulanishni qo‘llab-quvvatlaydi. Har bir Next.js worker ulanish ochsa va ular uzoq davom etuvchi so‘rovlar tufayli yopilmasa, `FATAL: remaining connection slots are reserved for non-replication superuser connections` xatosi kelib chiqadi.
3. **O‘qish va Yozish nisbatining keskinligi (Read Saturation 99:1):**
   - *Mexanizm:* Maktab saytida yozish amallari (yangi maqola qo‘shish) kuniga 2–5 martani tashkil etsa, o‘qish amallari 10 000+ martani tashkil qiladi. O‘zgarmas sahifalar (Maktab haqida, Nizom, O‘qituvchilar ro‘yxati) uchun har safar diskdan SQL SELECT bajarish xotira va I/O resursini behuda sarflaydi.
4. **Katta fayllarni sinxron yuklash (Blocking Media I/O):**
   - *Mexanizm:* O‘qituvchi 20 MB hajmdagi maktab jurnalining PDF faylini yuklaganda, server xotirasida faylni qabul qilish va diskka yozish jarayoni boshqa engil so‘rovlarni to‘xtatib qo‘ymasligi kerak.
5. **Parallel tahrirlashda ma’lumotlarning yo‘qolishi (Concurrent Overwrite):**
   - *Mexanizm:* Ikki muharrir bir vaqtda bitta maqolani ochib, o‘zgartirsa, ikkinchi saqlagan muharrir birinchisining tuzatishlarini bilmasdan o‘chirib yuboradi (Race condition).

---

## Phase 3: The Targeted Fix (Aniq maqsadli yechimlar)

Yuqorida aniqlangan har bir muammo uchun faqat zarur bo‘lgan minimal arxitektura qismlari joriy etildi:

1. **Next.js Full Route Cache va Incremental Static Regeneration (ISR):**
   - Ommaviy sahifalar (`/`, `/maktab-haqida`, `/talim`, `/oqituvchilar`, `/yutuqlar`, `/jurnallar`) build vaqtida statik HTML/JSON sifatida render qilinadi (SSG).
   - Node.js bu sahifalarni to‘g‘ridan-to‘g‘ri diskdan xotiraga (RAM) uzatadi (0 ms DB latency, 1000+ RPS o‘tkazuvchanlik).
   - Maqola nashr qilinganda yoki yangilanganda, Payload CMS hooklari orqali `revalidatePath('/yangiliklar')` va `revalidatePath('/')` chaqirilib, faqat kerakli sahifalar keshdan chiqariladi (On-demand cache invalidation).
2. **PostgreSQL ulanishlar havzasi (Connection Pooling):**
   - `pg.Pool` orqali maksimal ulanishlar soni 10–20 oralig‘ida qat’iy cheklandi. Ortiqcha so‘rovlar navbatda (queue) ushlab turiladi va baza yiqilishi oldi olinadi.
3. **Avtonom Media saqlash moduli:**
   - Standart holatda mustaqil saqlash uchun serverdagi `public/media/` jildi doimiy disk sifatida biriktiriladi.
   - Bulutli / Serverless muhitga o‘tilganda esa S3/MinIO plaginiga bir qator konfiguratsiya orqali o‘tish mumkin (`@payloadcms/storage-s3`).
4. **Reversiyalar va Qoralama tizimi (Drafts & Versions):**
   - `News` va `Staff` to‘plamlarida `versions: { drafts: true, maxPerDoc: 20 }` faollashtirildi.
   - Har bir tahrir yangi versiya sifatida saqlanadi, kim qachon o‘zgartirgani (audit log) qayd etiladi va har qanday paytda oldingi holatga qaytarish (Restore) imkoniyati ta’minlandi.

---

## Phase 4: Explicit Trade-Off & Cost Ledger (Kelishuvlar va Narx)

Har bir qo‘shilgan arxitektura yechimining narxi va kompromislari:

| Qo‘shilgan komponent | Maqsadi | Salbiy tomoni / Xarajati | SPOF va Monitoring |
|---|---|---|---|
| **Next.js Static Generation / Kesh** | Sayt tezligini 10 barobarga oshirish, TTFB < 50ms | *Cache Invalidation lag:* Agar webhook yoki revalidation uzilsa, foydalanuvchi eski kontentni ko‘rishi mumkin. | Past. Kesh xotirada yoki diskda saqlanadi. |
| **Integratsiyalashgan Payload CMS** | Alohida CMS serveri xarajatini 0 ga tushirish, yagona monolit | Dastur xotirasi (RAM) CMS va Frontend o‘rtasida bo‘linadi (kamida 1 GB RAM kerak). | Yagona dastur jarayoni (Node.js). Restart bo‘lsa, admin ham, frontend ham 3-5 soniya to‘xtaydi. |
| **PostgreSQL (va SQLite fallback)** | Qat’iy relyatsion struktura, ACID tranzaksiyalar, JSONB indekslar | Alohida Postgres servisini sozlash va xavfsizlik yangilanishlarini kuzatish talab etiladi. | Bazaning to‘xtashi butun saytni to‘xtatadi. Kundalik avtomatik `pg_dump` zarur. |
| **Local Persistent Volume** | Fayllarni mahalliy serverda nol xarajat bilan saqlash | Agar server to‘liq yonib ketsa, disk zaxira nusxasi (backup) bo‘lmasa tiklab bo‘lmaydi. | Zaxira nusxalarini masofaviy xotiraga (masalan, S3 yoki boshqa serverga) sinxronlash shart. |

---

## Phase 5: Production & Operational Guidelines

### 5.1. Ishlab chiqarish steki (Recommended Production Stack)
1. **Server:** Ubuntu 22.04 LTS yoki 24.04 LTS (2 vCPU, 4 GB RAM, 40 GB NVMe SSD). Narxi: ~$12–$24/oy (Hetzner, DigitalOcean, Vultr yoki Uzinfocom milliy buluti).
2. **Reverse Proxy & SSL:** NGINX + Certbot (Let's Encrypt avtomatik SSL sertifikatlari) yoki Cloudflare Free Tier (DDoS himoyasi va CDN).
3. **Jarayon boshqaruvi:** Docker Compose yoki PM2 (Node.js jarayoni to‘xtab qolganda avtomatik qayta ishga tushirish uchun).
4. **Baza:** PostgreSQL 16 (yoki SQLite 3.45+).

### 5.2. Zaxiralash va Falokatdan tiklash (Backup & Disaster Recovery)
- **Baza zaxirasi:** Har kecha soat 03:00 da `cron` orqali `scripts/backup.mjs` ishga tushiriladi.
- **Saqlash muddati (Retention):** 30 kunlik kundalik nusxalar, 12 oylik oylik arxivlar.
- **Tiklash mashqi (Rehearsed Restore):** `npm run restore` buyrug‘i yordamida zaxira fayli sinov muhitida ochiladi va `npm run verify` bilan yaxlitligi avtomatik tekshiriladi.
- **RTO (Recovery Time Objective):** 15 daqiqa (server noldan ko‘tarilganda).
- **RPO (Recovery Point Objective):** Maksimal 24 soat (eng oxirgi kechki zaxira).

---

## 6. Xulosa va Rivojlanish Bosqichlari (Next Scaling Triggers)

Hozirgi modular monolit arxitekturasi maktab talablarini (kunlik 10 000 tashrif, 100 nafar xodim) to‘liq qoplaydi.
Kelajakda quyidagi holatlar yuz bersagina keyingi bosqichga o‘tiladi:
1. **Agar kunlik tashrif 200 000+ ga yetsa:** Oldinga NGINX/Cloudflare to‘liq sahifa keshini qo‘yish (Read Replicas yoki Redis hali ham shart emas).
2. **Agar media hajmi 100 GB dan oshsa:** Mahalliy diskdan AWS S3 / Cloudflare R2 / MinIO ob’ekt xotirasiga o‘tish (`@payloadcms/storage-s3`).
3. **Agar o‘qituvchilar soni 10 000+ bo‘lsa (Butun tuman maktablari birlashsa):** PgBouncer va alohida ajratilgan PostgreSQL klasterini ulash.
