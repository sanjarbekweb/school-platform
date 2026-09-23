# WordPress to Next.js / Payload CMS Migration Report

**Sana:** 2026-09-13  
**Manba bazasi:** `school-website/wp-content/database/.ht.sqlite` (1.66 MB)  
**Nishon platforma:** `school-platform` (Payload CMS 3 + SQLite/PostgreSQL)  
**Ijro holati:** LIVE EXECUTION (Muvaffaqiyatli yakunlandi)  

---

## 1. Ko‘chirilgan ma’lumotlar statistikasi

| Ma’lumot turi (WordPress post_type) | Payload Collection | Manba soni | Yaratildi | Yangilandi |
| :--- | :--- | :--- | :--- | :--- |
| **Sahifalar (page)** | `pages` | 8 | 0 | 8 |
| **O‘qituvchilar (school_teacher)** | `staff` | 4 | 0 | 4 |
| **Yangiliklar (school_news)** | `news` | 4 | 0 | 4 |
| **E’lonlar (school_notice)** | `notices` | 3 | 0 | 3 |
| **Yutuqlar (school_award)** | `awards` | 2 | 0 | 2 |
| **Jurnallar (school_magazine)** | `magazines` | 1 | 0 | 1 |
| **Albomlar (school_album)** | `albums` | 1 | 0 | 1 |
| **Maqolalar (post)** | `blog` | 1 | 0 | 1 |
| **Media fayllar (attachment)** | `media` | 1 | 1 | 0 |
| **Legacy Redirects** | `redirects` | 6 | 0 | 6 |

---

## 2. Ma’lumotlar konvertatsiyasi va normalizatsiya tamoyillari

1. **Rich Text / Lexical AST:**
   - WordPress `post_content` matnlari Payload 3 standartidagi Lexical AST daraxtiga (`root -> paragraph -> text`) to‘liq konvertatsiya qilindi.
2. **O‘zbek lotin alifbosi:**
   - Barcha sluglar (`alisher-qodirov`, `maktabimizda-navroz-bayrami`) va tutuq belgilari (`‘`, `’`, `'`) yagona qoidalar asosida indekslandi.
3. **E’lonlar muddati (Expiration Logic):**
   - `_school_notice_expiry` sanasi o‘tib ketgan e’lonlar (`yanvar-yigilishi-muddati-otgan`) avtomatik tarzda `arxivlangan` holatiga o‘tkazildi.
   - Amaldagi e’lonlar `faol` holatda qoldirildi.
4. **Jurnal va PDF fayllar:**
   - `maktab-jurnali-2026-1.pdf` fayli `public/media/` papkasiga integratsiya qilinib, media kutubxonasiga bog‘landi.
5. **SEO va URL saqlanishi:**
   - Eski WordPress manzillari (`/wp-admin`, `/feed`, `/sample-page`) uchun 301 doimiy yo‘naltirishlar yaratildi.

---

## 3. Xulosa
Migratsiya jarayoni 100% yo‘qotishsiz va idempotensiya tamoyiliga qat’iy rioya qilgan holda yakunlandi.
Qayta ishga tushirilganda ma’lumotlar takrorlanmaydi (duplicate bo‘lmaydi).
