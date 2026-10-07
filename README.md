# Rezervolt — преміальний лендінг для компанії з монтажу сонячних панелей

Сучасний, «дорогий» лендінг повного циклу: проєктування → монтаж → запуск → сервіс.
Побудований як фундамент, що розширюватиметься (месенджер, калькулятор вартості тощо).

**Фаза 1 (готово):** загальна структура, анімації (GSAP), інтерактивна 3D-сцена (Three.js / R3F),
світла/темна теми, двомовність (UA/EN), адаптив, SEO-база.

## Стек

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (CSS-first токени) + **next-themes** (light/dark, `class`)
- **next-intl** — i18n з сегментом `/[locale]` (`uk` за замовч., `en`)
- **GSAP** + **ScrollTrigger** + `@gsap/react`, **Lenis** (плавний скрол)
- **three** + **@react-three/fiber** + **@react-three/drei**
- Шрифти: **Unbounded** (дисплей, з кирилицею) + **Inter** (текст)

## Вимоги

- **Node.js ≥ 20** (рекомендовано 20 LTS або 22). У проєкті використовується Node 22 через `nvm`:
  ```bash
  nvm use 22   # або: nvm install 20 && nvm use 20
  ```

## Команди

```bash
npm install        # встановити залежності
npm run dev        # дев-сервер (http://localhost:3000 → /uk)
npm run build      # продакшн-білд (типи + статична генерація /uk, /en)
npm run start      # запуск продакшн-білду
npm run lint       # ESLint
npm run dam:snapshot  # оновити запасний знімок цін РДН (lib/dam-snapshot.json)
```

## Структура

```
app/[locale]/        layout (html, провайдери, метадані), page (композиція), not-found
app/globals.css      Tailwind v4 @theme токени, dark-variant, утиліти, Lenis, reduced-motion
i18n/                routing, navigation, request (next-intl)
proxy.ts             locale-роутинг (Next 16: middleware → proxy)
messages/            uk.json, en.json — увесь текст
components/
  layout/            navbar, footer, scroll-progress, back-to-top
  providers/         theme-provider (next-themes), smooth-scroll (Lenis+GSAP)
  ui/                button, container, reveal, magnetic, theme-toggle, locale-switcher, …
  three/             solar-panel (процедурна), hero-scene, hero-canvas, hero-3d, panel-poster
  illustrations/     SVG-ілюстрації обладнання: solar-array, inverter, battery-stack, switchgear
  calculator/        калькулятор окупності: режими СЕС / накопичувач, графік цін РДН, кошторис
  sections/          hero, stats, services, process, why-us, equipment, projects, calculator,
                     testimonials, faq, contact
hooks/               use-prefers-reduced-motion, use-media-query, use-mounted
lib/                 gsap (реєстрація плагінів), utils (cn), site (бренд/контакти/нав),
                     equipment (бренди обладнання за категоріями),
                     calculator (ціни обладнання/робіт, припущення, формули),
                     dam / dam-data / dam-snapshot.json (ціни РДН «Оператора ринку»)
scripts/             update-dam-snapshot.mjs
public/brands/       логотипи виробників (Deye, Dyness, Pylontech, LONGi, JA Solar, Risen, ABB, ETI, Hager)
```

## Ключові рішення

- **Тема ↔ 3D:** освітлення сцени реагує на light/dark (`hero-canvas` читає `resolvedTheme`).
- **Process (повний цикл):** на десктопі — pin-секція зі scroll-синхронізованою «зборкою/зарядкою»
  панелі (комірки засвічуються за прогресом скролу); на мобільному / reduced-motion — звичайний
  вертикальний таймлайн.
- **Обладнання:** bento-картки за ролями в системі (генерація → перетворення → накопичення →
  захист) з SVG-ілюстраціями та логотипами брендів. Під час скролу картки «вмикаються»: оживають
  екран, LED, заряд АКБ, автомати, а логотипи переходять із силуетів у фірмові кольори; щойно
  картка виходить з екрана — «вимикається», тож анімація повторюється при кожному скролі. Додати
  бренд — файл у `public/brands/` + запис у `lib/equipment.ts`.
- **3D-продуктивність:** Canvas вантажиться лише на клієнті (`next/dynamic`, `ssr:false`); на
  малих екранах і при `prefers-reduced-motion` показується статичний CSS-постер панелі.
- **Калькулятор окупності** (два режими):
  - **Сонячна станція** — економія за тарифом (за замовч. **15 ₴/кВт·год** з ПДВ, редагується);
    станція підбирається на ~60% річного споживання (виробіток 1 150 кВт·год/кВт).
  - **Накопичувач · РДН** — заряд від мережі в найдешевші години ринку на добу наперед і розряд у
    найдорожчі. Погодинні ціни беруться з сайту АТ «Оператор ринку» (`pricectr/data_view`, ОЕС
    України) за останні 30 днів / 12 місяців; для кожного дня оптимальний план заряду/розряду
    рахується динамічним програмуванням (`lib/dam.ts`).
  - Кошторис: обладнання + роботи, разом без ПДВ, ПДВ 20%, разом з ПДВ. **Усі ціни та припущення —
    в одному місці: `lib/calculator.ts`.**
  - Ціни РДН кешуються на 12 год (сторінка — ISR, `revalidate = 43200`). Якщо oree.com.ua
    недоступний, використовується знімок `lib/dam-snapshot.json` (оновлення: `npm run dam:snapshot`).
- **Хедер** непрозорий, висота — CSS-змінна `--header-h`; закріплення (pin) секції «Процес»
  починається під хедером і займає решту висоти екрана.
- **Приховані контакти:** `hiddenContacts` у `lib/site.ts` (зараз — адреса, графік роботи й соцмережі).
- **Приховані секції:** `hiddenSections` у `lib/site.ts` (зараз — `projects`): секція лишається в
  коді, але не рендериться й зникає з навігації. Щоб повернути — прибрати id з набору.
- **Бренд:** усе налаштовується в `lib/site.ts` (назва **Rezervolt**, контакти, соцмережі)
  та в `messages/*.json` (увесь текст).

## Доступність / якість

- Повага до `prefers-reduced-motion` (важкі анімації та 3D вимикаються) — через `useSyncExternalStore`.
- Повага до `prefers-color-scheme` (через next-themes `enableSystem`).
- Семантична розмітка, `aria-*`, фокус-стани, кросбраузерність (Chrome/Safari/Firefox).
- SEO: `generateMetadata`, OpenGraph/Twitter, `lang`, `alternates.languages`, JSON-LD `LocalBusiness`.

## Дорожня карта (наступні фази)

- Месенджер / онлайн-чат (плейсхолдер у секції контактів).
- Відправлення форми заявки (API-роут + нотифікації).
- CMS для кейсів/блогу, аналітика.

Архітектура (Next API-роути, i18n, секції-плейсхолдери) уже це передбачає.

---

> Примітка: це Next.js 16 — API відрізняється від попередніх версій; перед змінами звіряйтеся з
> локальними доками у `node_modules/next/dist/docs/`.
