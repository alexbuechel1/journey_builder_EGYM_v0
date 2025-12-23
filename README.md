# Customer Journey Builder MVP

A React + TypeScript application for building and simulating customer journeys for EGYM products.

## Overview

This application allows operators to:
- Build customer journeys with configurable actions
- Set deadlines and reminders
- Simulate member experiences in a mobile app mockup

## Tech Stack

- **React 18+** with **TypeScript**
- **Vite** for fast development
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **Supabase** for backend and persistence
- **@dnd-kit** for drag & drop functionality

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase project (optional - app works in mock mode without it)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` with your Supabase credentials (optional).

4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Status

✅ **Phase 1: Foundation** - Complete
✅ **Phase 2: Builder Panel** - Complete
- JourneyContext implementation
- Journey selector component
- Action list with drag & drop
- Action card component
- Action form (configuration)
- Reminder management
- Time range selector
- Supabase integration

🚧 **Phase 3: Simulator Panel** - In Progress
⏳ **Phase 4: Core Logic** - Pending
⏳ **Phase 5: Polish & Testing** - Pending

## Development

See `TECHNICAL_ARCHITECTURE.md` for detailed architecture documentation.

## Deployment

This project is configured for deployment on Vercel. See `vercel.json` for configuration.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
