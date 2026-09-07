# NetPulse ⚡ - Internet Speed Test & Network Utility

> A modern, responsive, client-side Internet Speed Test and Network Utility Single Page Application (SPA) designed for zero-latency browser diagnostics and seamless hosting on **GitHub Pages**.

[![Deploy to GitHub Pages](https://github.com/ashraf-dev71/netpulse/actions/workflows/deploy.yml/badge.svg)](https://github.com/ashraf-dev71/netpulse/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-cyan.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-purple.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38bdf8.svg)](https://tailwindcss.com/)

---

## 🌟 Highlights & Features

- 🏎️ **Accurate Real-Time Speedometer**: Smooth physical needle response measuring Download speed, Upload throughput, Ping latency, and Jitter.
- 🌍 **Automated IP & ISP Detection**: Instant lookup of public IP, Autonomous System Number (ASN), ISP, and approximate city/country.
- 🗺️ **Interactive Leaflet.js Host Checker**: Query any domain or IPv4/IPv6 with dark-mode OpenStreetMap interactive pin and radius visualization.
- 📊 **Local Test History & Analysis**: Persisted test history stored locally in browser with JSON export and instant connection tier grading (Gaming, 4K Streaming, Video Conferences).
- 💻 **Dedicated Full Pages**: No clipping popups! Dedicated full page views for Creator Terminal, Privacy & Disclaimer, and GitHub Pages Deployment Guide.
- 🚀 **100% Client-Side & GitHub Pages Ready**: Zero backend requirements, relative base paths (`base: './'`), automated CI/CD workflow included, and zero mixed-content warnings.

---

## 👨‍💻 Creator Information

- **Developer**: Ashraf hossen jubaed
- **GitHub**: [@ashraf-dev71](https://github.com/ashraf-dev71)
- **Email**: [ashrafhossenjubayed71@gmail.com](mailto:ashrafhossenjubayed71@gmail.com)
- **Role**: Front-End Web Developer & UI/UX Designer

---

## 🚀 How to Host on GitHub Pages (3 Easy Methods)

### Method 1: Automated GitHub Actions (Recommended)
This repository already includes `.github/workflows/deploy.yml`.

1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "Deploy NetPulse to GitHub Pages"
   git push origin main
   ```
2. On GitHub, go to your repository **Settings** → **Pages**.
3. Under **Build and deployment** → **Source**, select **GitHub Actions**.
4. That's it! GitHub Actions will automatically build Vite and deploy the app to:
   ```
   https://<your-username>.github.io/<repo-name>/
   ```

---

### Method 2: One-Command CLI Deploy (`gh-pages`)
If you have local Node.js installed:

```bash
# 1. Install dependencies
npm install

# 2. Build and publish to gh-pages branch in 1 step
npm run deploy
```
Then in GitHub repository **Settings** → **Pages**, set branch to `gh-pages` / `/ (root)`.

---

### Method 3: Standalone Single-File (Zero-Build Vanilla)
If you don't want to use Node.js or npm at all:
1. Download or copy `public/standalone.html`.
2. Rename it to `index.html`.
3. Push or upload it directly to your GitHub repository root.
4. Set GitHub Pages Source to **Deploy from a branch** (`main` / `/ (root)`).

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Run local development server
npm run dev

# Typecheck and lint
npm run lint

# Compile production bundle
npm run build
```

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
