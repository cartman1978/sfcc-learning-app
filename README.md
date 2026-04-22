# ☁️ SFCC Learning App

An interactive learning app to master **Salesforce Commerce Cloud B2C and B2B** — no build step, no dependencies, no server required. Just open `index.html` in your browser.

![SFCC Learning App](https://img.shields.io/badge/SFCC-B2C%20%26%20B2B-0070d2?style=flat-square&logo=salesforce)
![HTML CSS JS](https://img.shields.io/badge/stack-HTML%20%2F%20CSS%20%2F%20JS-f7df1e?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

---

## 🚀 Quick Start

```bash
git clone https://github.com/cartman1978/sfcc-learning-app.git
cd sfcc-learning-app
open index.html   # macOS
# or double-click index.html on Windows/Linux
```

No `npm install`. No build. It works offline.

---

## 📚 Curriculum

7 modules · 14 lessons · 50+ quiz questions

| # | Module | Topics | Type |
|---|--------|--------|------|
| 1 | **Platform Overview** | Architecture, sandboxes, Business Manager, B2C vs B2B | B2C + B2B |
| 2 | **Cartridge System** | Cartridge path, folder structure, override pattern | B2C |
| 3 | **SFRA Controllers & Templates** | server.get/post, middleware, ISML, pdict | B2C |
| 4 | **REST APIs (OCAPI / SCAPI)** | Shop API, Data API, Commerce SDK, OAuth 2.0 | B2C |
| 5 | **Catalogs & Products** | Product types, catalog XML, price books, B2B Product2 | B2C + B2B |
| 6 | **Customers & Orders** | Baskets, transactions, order placement, OMS | B2C + B2B |
| 7 | **B2B Commerce** | Account hierarchies, entitlements, approval flows, LWC | B2B |
| 8 | **Jobs & Customization** | Scheduled jobs, site preferences, custom attributes | B2C |

---

## ✨ Features

- **3-tab lesson format** — Concept, Code Examples, Quiz
- **Syntax-highlighted code** for JavaScript, ISML, XML, JSON, Bash — with one-click copy
- **Interactive quizzes** — multiple choice with answer explanations, 70% pass threshold
- **Progress tracking** — persisted in `localStorage`, visible in sidebar and topbar
- **B2C / B2B filter** — filter lessons by product type
- **Dark mode** — toggle in the topbar, preference saved across sessions
- **Prev / Next navigation** — move through lessons in order
- **No dependencies** — pure HTML, CSS, and vanilla JavaScript

---

## 🗂️ Project Structure

```
sfcc-learning-app/
├── index.html       # App shell, layout markup
├── styles.css       # All styles (CSS custom properties, dark mode, responsive)
├── curriculum.js    # All lesson content — concepts, code examples, quiz questions
└── app.js           # App logic — routing, rendering, quiz engine, progress tracking
```

---

## 🧩 How It Works

| File | Responsibility |
|------|---------------|
| `curriculum.js` | Static data: modules, lessons, code examples, quiz questions. Edit this to add or update content. |
| `app.js` | Renders the UI, handles navigation, quiz state machine, and `localStorage` progress. |
| `styles.css` | CSS custom properties for theming; grid layout; component styles. |

Progress is stored in `localStorage` under the key `sfcc_progress_v1` as a JSON object mapping lesson IDs to completion status and quiz scores.

---

## 🛠️ Adding Content

To add a new lesson, open `curriculum.js` and append a lesson object to a module's `lessons` array:

```javascript
{
  id: "my-new-lesson",          // unique kebab-case id
  title: "My New Lesson",
  duration: "5 min",
  type: "b2c",                  // "b2c" | "b2b" | "both"
  concept: [
    { type: "p", text: "Paragraph text here. Use <code>inline code</code>." },
    { type: "heading", text: "A Section Heading" },
    { type: "callout", callout: "tip", title: "Pro Tip", text: "Callout body." }
  ],
  code: [
    {
      title: "Example filename.js",
      lang: "javascript",       // javascript | xml | isml | json | bash | text
      code: `// your code here`,
      explanation: "One-line note shown below the block."
    }
  ],
  quiz: [
    {
      q: "Your question?",
      options: ["Option A", "Option B", "Option C", "Option D"],
      correct: 0,               // zero-based index of correct option
      explanation: "Shown after answering."
    }
  ]
}
```

---

## 📖 SFCC Resources

- [Salesforce Commerce Cloud Documentation](https://developer.salesforce.com/docs/commerce)
- [SFRA GitHub Repository](https://github.com/SalesforceCommerceCloud/storefront-reference-architecture)
- [Commerce SDK (SCAPI)](https://github.com/SalesforceCommerceCloud/commerce-sdk-isomorphic)
- [SFCC Developer Community](https://trailhead.salesforce.com/en/career-paths/merchandiser)
- [OCAPI Documentation](https://documentation.b2c.commercecloud.salesforce.com/DOC2/topic/com.demandware.dochelp/OCAPI/current/usage/OpenCommerceAPI.html)

---

## 📄 License

MIT — free to use, modify, and share.
