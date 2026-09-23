# Media Sources & Asset Licensing

This document details the provenance, licensing, technical specifications, and usage policies for all static visual assets, SVG illustrations, and document media in the **142-sonli umumta'lim maktabi** web platform.

---

## 1. Custom Vector Assets (`public/images/`)

All vector illustrations in `public/images/` were created specifically for the Maktab 142 platform. They are licensed under the **Creative Commons Attribution 4.0 International (CC BY 4.0)** license.

| File Name | Description | Dimensions / Aspect Ratio | Theme Adaptability | License |
| :--- | :--- | :--- | :--- | :--- |
| `hero-school.svg` | Architectural representation of the modern school building with entrance pillars, flag, clock tower, and landscaping. | 1200x600 (2:1) | Supports Light/Dark (CSS-aware fills) | CC BY 4.0 |
| `teacher-default.svg` | Professional educator avatar portrait for teachers without an uploaded photograph. | 400x400 (1:1) | Neutral background, WCAG compliant contrast | CC BY 4.0 |
| `award-trophy.svg` | Gold trophy and laurel wreath representing student and faculty academic/sports Olympiad achievements. | 800x600 (4:3) | High-contrast gold & navy tones | CC BY 4.0 |
| `gallery-library.svg` | School library and STEM robotics laboratory illustration for gallery placeholders. | 800x600 (4:3) | Multi-color balanced palette | CC BY 4.0 |
| `magazine-cover-2026.svg`| Official cover art for the quarterly school publication "Yosh Olimlar" (Young Scientists). | 600x800 (3:4) | Print/Digital hybrid vector | CC BY 4.0 |
| `news-academic.svg` | Educational banner featuring open books, graduation cap, and learning symbols. | 800x500 (16:10) | Royal blue & gold tones | CC BY 4.0 |
| `news-robotics.svg` | STEM innovation banner with microchips, robotics arm, and circuitry. | 800x500 (16:10) | Tech teal & slate navy tones | CC BY 4.0 |
| `news-sports.svg` | Sports competitions and physical education banner featuring football, basketball, and track. | 800x500 (16:10) | Emerald green & vibrant accents | CC BY 4.0 |
| `news-event.svg` | School celebration and cultural festivities banner (Navro'z, Constitution Day, Knowledge Day). | 800x500 (16:10) | Festive amber & crimson palette | CC BY 4.0 |

### Technical Specifications for SVGs:
- **Optimization:** Cleaned of XML metadata, editor artifacts, and extraneous inkscape/illustrator namespaces.
- **Accessibility:** Contain `<title>` and `<desc>` attributes, along with appropriate `aria-hidden` attributes when used as decorative backgrounds.
- **Responsiveness:** Standardized `viewBox` coordinates without fixed CSS width/height constraints, ensuring crisp rendering on 4K/retina displays.

---

## 2. Institutional Media Documents (`public/media/`)

Documents hosted in `public/media/` represent official school publications released by the editorial board of **142-sonli umumta'lim maktabi**.

| File Name | Title | Purpose | Copyright Notice |
| :--- | :--- | :--- | :--- |
| `maktab-jurnali-2026-1.pdf` | *Yosh Olimlar* 2026-yil 1-son | Q1 School science & literature magazine | © 2026 Maktab 142 Tahririyati. All rights reserved. |
| `maktab-jurnali-2026-2.pdf` | *Yosh Olimlar* 2026-yil 2-son | Q2 Special edition: Robotics & AI Olympiad | © 2026 Maktab 142 Tahririyati. All rights reserved. |
| `maktab-jurnali-2026-3.pdf` | *Yosh Olimlar* 2026-yil 3-son | Q3 Spring arts and cultural projects | © 2026 Maktab 142 Tahririyati. All rights reserved. |
| `maktab-jurnali-2026-4.pdf` | *Yosh Olimlar* 2026-yil 4-son | Q4 Academic year recap & alumni successes | © 2026 Maktab 142 Tahririyati. All rights reserved. |

---

## 3. Image Optimization & Serving Policy

All uploaded and static images on the public frontend must follow strict performance guidelines:
1. **Next.js `<Image />` Component:** Raw `<img>` tags are strictly prohibited on the public frontend. All images must be rendered via `next/image` with explicit `width`/`height` or `fill` with responsive `sizes` definitions.
2. **Modern Formats:** Next.js automatically negotiates WebP and AVIF formats based on client browser capability.
3. **Upload Constraints (Enforced via Custom Admin Dropzone):**
   - Maximum upload file size: **5 MB** for photos, **20 MB** for PDF documents.
   - Permitted MIME types: `image/jpeg`, `image/png`, `image/webp`, `image/svg+xml`, `application/pdf`.
   - Automatic alt text requirement: Media uploads must include descriptive alt text in Uzbek Latin for accessibility (WCAG 2.2 AA).
