# Jeman Kalita - Personal Site

A serif-first personal website with a portfolio photo, projects page, hover references, and contact links.

## Folder structure

```text
jeman-kalita-site/
├── index.html       ← all pages live here
├── style.css        ← all styles
├── script.js        ← page routing + nav
├── portfolio.png    ← portrait image
├── favicon.svg      ← site icon
└── README.md
```

## How to update your photo

Replace `portfolio.png` with a new image using the same filename, then refresh the site.

## How to update your links

Search `index.html` for these values and update them:

```text
jemankalita@gmail.com
github.com/jeman-arcanist
linkedin.com/in/jemankalita
@xerotwts
```

## How to run locally

Open `index.html` directly in any browser. No build step is needed.

Or serve it locally:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Fonts

Playfair Display is loaded from Google Fonts for headings, names, and page titles. Georgia is used for body text, labels, and navigation.
