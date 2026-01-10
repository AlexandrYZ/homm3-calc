# Repository Guidelines

## Project Structure & Module Organization
- Source: `src/` with:
  - `services/` stateless calculators and helpers (e.g., `damageService.js`).
  - `models/` domain classes (e.g., `Hero.js`, `Unit.js`).
  - `views/` UI logic (e.g., `damageCalculator.js`).
  - `data/` game data (incl. `horn_of_the_abyss/`).
  - `styles/` SCSS (`index.scss`).
- Static assets: `img/`; build output: `dist/`.
- Tests: `tests/*.test.js` importing from `src/`.

## Build, Test, and Development Commands
- `npm install`: install dependencies (Node 16+ required).
- `npm start`: dev server on `http://localhost:8080` (webpack-dev-server).
- `npm run dev`: development build (once).
- `npm run build`: production bundle to `dist/`.
- `npm test`: run Jest tests (ESM via `--experimental-vm-modules`).

## Coding Style & Naming Conventions
- Language: ES2018, ESM (`"type": "module"`).
- Lint: ESLint + Airbnb Base; run `npx eslint .` before PRs.
- Indentation: tabs; trailing commas disabled.
- Filenames:
  - Models: PascalCase (`Hero.js`).
  - Services: camelCase suffixed `Service` (`damageService.js`).
  - Views/helpers: camelCase (`damageCalculator.js`, `randomInRange.js`).
  - Tests: `*.test.js` under `tests/`.

## Testing Guidelines
- Framework: Jest.
- Place tests in `tests/`; cover new logic and edge cases.
- Example: `tests/damageService.test.js` validates counter-attack damage.
- Run `npm test`; keep tests deterministic and fast.

## Commit & Pull Request Guidelines
- Prefer Conventional Commits: `feat:`, `fix:`, `chore:`.
  - Example: `feat: add counter-attack damage tests`.
- PRs must include:
  - Clear description and rationale; link issues when applicable.
  - Screenshots/GIFs for UI changes.
  - Verification: `npm test` passes; `npm run build` succeeds; `npx eslint .` clean.

## Security & Configuration Tips
- No secrets committed; app is static.
- Keep data file keys/units consistent with existing entries.

