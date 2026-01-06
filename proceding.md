# Engineering Implementation Plan: AI-Themed Personal Website

This document outlines the step-by-step engineering plan to build the "Minimalist Tech" AI personal website.

## Phase 1: Project Initialization & Infrastructure
**Goal**: Set up the foundational Astro environment, install core dependencies, and configure the project structure.

- [x] **Initialize Astro Project**
    - [x] Run `npm create astro@latest` (template: empty or minimal).
    - [x] Configure `astro.config.mjs` with basic settings.
- [x] **Install Dependencies**
    - [x] Install Framework integrations: `@astrojs/react`, `@astrojs/tailwind`.
    - [x] Install UI libraries: `framer-motion`, `clsx`, `tailwind-merge`.
    - [x] Install Utilities: `@astrojs/sitemap`, `@astrojs/rss`.
- [x] **Configure Tailwind CSS**
    - [x] Initialize `tailwind.config.mjs`.
    - [x] Define color palette (Obsidian, Deep Space, Neon Cyan, Electric Purple) from Design Spec.
    - [x] Configure typography (Inter/Roboto, JetBrains Mono).
    - [x] Set up Dark Mode strategy (class-based).
- [x] **Directory Structure Setup**
    - [x] Create folder structure: `src/components`, `src/layouts`, `src/pages/[lang]`, `src/content`, `src/i18n`.
    - [x] Create public asset folders: `public/images`, `public/fonts`, `public/locales`.

## Phase 2: Core Architecture & Design System
**Goal**: Implement the base layouts, global styles, and essential UI components.

### i18n Routing Logic
```mermaid
graph TD
    A[User Request] --> B{URL has Lang Prefix?}
    B -- Yes e.g. /zh/ --> C[Render [lang]/index.astro]
    B -- No --> D[Redirect to Default /en/]
    C --> E{Page Type}
    E -- Blog List --> F[Fetch Collection 'blog']
    F --> G[Filter by Lang 'zh']
    G --> H[Render List]
    E -- Blog Post --> I[Fetch Entry by Slug]
    I --> J[Render Post Layout]
```

- [ ] **Global Styles & Fonts**
    - [ ] Download and place font files in `public/fonts`.
    - [x] Create `src/styles/global.css` for base styles and font-face definitions.
- [x] **i18n Configuration**
    - [x] Create `src/i18n/config.ts` to define locales (en, zh, etc.).
    - [x] Create utility functions in `src/i18n/utils.ts` (e.g., `getLangFromUrl`, `useTranslations`).
    - [x] Create UI translation files (e.g., `src/i18n/ui.ts`).
- [x] **Base Layouts**
    - [x] Create `BaseLayout.astro`: Includes `<head>`, SEO meta tags, ThemeProvider, and basic structure.
    - [x] Implement Dark/Light mode toggle logic.
- [x] **Core Components**
    - [x] **Header**: Logo, Navigation links, Language Switcher, Theme Toggle.
    - [x] **Footer**: Social links, Copyright.
    - [x] **LanguageSwitcher**: Component to toggle between `/en/`, `/zh/`, etc.

## Phase 3: Content Engine (Blog & Markdown)
**Goal**: Enable the creation and rendering of blog posts using Astro Content Collections.

- [x] **Content Collections Setup**
    - [x] Define schema in `src/content/config.ts` (zod validation for frontmatter).
    - [x] Create sample content in `src/content/blog/en/` and `src/content/blog/zh/`.
- [x] **Blog Listing Page**
    - [x] Create `src/pages/[lang]/blog/index.astro`.
    - [x] Implement logic to filter posts by current language.
    - [x] Design `PostCard` component for the list view.
- [x] **Blog Post Page**
    - [x] Create `src/pages/[lang]/blog/[...slug].astro`.
    - [x] Implement `BlogPostLayout.astro` for article rendering (Integrated into `[...slug].astro`).
    - [x] Style Markdown content (typography plugin or custom CSS).

## Phase 4: The "AI" Home Page (Hero Section)
**Goal**: Build the interactive Neural Network visualization and the main landing page.

- [x] **Neural Network Component (React)**
    - [x] Create `src/components/react/NeuralNetwork.tsx`.
    - [x] Implement Canvas/SVG rendering logic.
    - [x] Add mouse interaction (hover effects, parallax).
    - [x] Integrate `framer-motion` for entrance animations.
- [x] **Home Page Layout**
    - [x] Create `src/pages/[lang]/index.astro`.
    - [x] Assemble the Hero section.
    - [x] Build "Latest Articles" stream section.
    - [x] Ensure responsive design for mobile devices.

## Phase 5: Features & Integrations
**Goal**: Add interactivity, analytics, and external integrations.

- [ ] **Comments System (Giscus)**
    - [ ] Create `src/components/react/Giscus.tsx`.
    - [ ] Configure repo mapping and theme syncing (dark/light).
    - [ ] Integrate into `BlogPostLayout.astro`.
- [ ] **SEO & Analytics**
    - [ ] Configure `astro-seo` or manual meta tags.
    - [ ] Integrate Google Analytics 4 (GA4) script.
    - [ ] Generate `sitemap-index.xml` and `robots.txt`.
    - [ ] Generate RSS feeds for each language.

## Phase 6: Polish & Optimization
**Goal**: Refine animations, performance, and accessibility.

- [ ] **Animations**
    - [ ] Add page transition effects (View Transitions API or Framer Motion).
    - [ ] Add scroll-reveal animations for content elements.
- [ ] **Performance Tuning**
    - [ ] Optimize images using `<Image />` component.
    - [ ] Audit Lighthouse score.
    - [ ] Verify font loading strategies.
- [ ] **Final Review**
    - [ ] Cross-browser testing.
    - [ ] Mobile responsiveness check.

## Phase 7: Deployment
**Goal**: Automate deployment to GitHub Pages.

- [x] **GitHub Actions**
    - [x] Create `.github/workflows/deploy.yml`.
    - [x] Configure build and deploy steps using `withastro/action`.
- [ ] **Environment Variables**
    - [ ] Set up secrets in GitHub repository (if any).
