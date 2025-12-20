# BeMobile – ComicVine Frontend Challenge

Frontend coding challenge built with **Next.js** and **TypeScript**, using the
**ComicVine API**.

The application displays a list of comic characters, allows searching,
viewing character details, and managing a favorites list, following the
provided Figma design.

---

## Tech Stack

- **Next.js (App Router)**
- **TypeScript**
- **React**
- **Vitest + Testing Library**
- **ComicVine API**
- **CSS Modules**

---

## Features

- Characters list with search
- Character detail page
- Favorites management
- Favorites page with search and results counter
- Global loading indicator
- Responsive layout aligned to Figma
- Unit tests for core logic

---

## Architecture & Decisions

- **Feature-based structure** with reusable UI components
- **Favorites state** managed via React Context
- **API layer isolated** from UI components
- **Global loading state** shared across the app
- **UI reuse** between Home and Favorites to avoid duplication
- Tests focus on **business logic**, not visual details

---

## Running Tests

```bash
npm run test
```

---

## Running the Project

```bash
npm install
npm run dev
```

The application will be available at:
http://localhost:3000

---

## Environment Variables

Create a .env.local file:

NEXT_PUBLIC_COMICVINE_API_KEY=your_api_key_here

---

## Workflow Notes

The project was developed using feature-based branches and pull requests to simulate a real-world team workflow.

---

## Notes

This project was built as part of a technical challenge.
Design fidelity, code clarity, and maintainability were prioritized.
