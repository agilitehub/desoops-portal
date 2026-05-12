---
name: vibe-coding
description: >-
  Main entry for desoops-portal frontend conventions. Points to focused skills for
  toolbar navigation/routes and for feature module structure, Ant Design, Tailwind
  (preferred) with SASS where needed, Font Awesome icons, and src/core rules.
---

# Vibe coding (main)

Use this skill when adding **screens**, **toolbar destinations**, or **feature areas** under the authenticated app shell, or when refactoring module layout.

## Sub-skills (read these for detail)

| Topic | Skill | Path |
|-------|--------|------|
| Top toolbar, navigation config, `routes.js`, path helpers | **vibe-coding-navigation** | `.cursor/skills/vibe-coding-navigation/SKILL.md` |
| Module folders (`components` / `controllers` / `model` / `hooks`), thin UI, Ant Design, Tailwind/SASS, `src/core` and shared components | **vibe-coding-module** | `.cursor/skills/vibe-coding-module/SKILL.md` |

**When working on nav or route wiring:** read **vibe-coding-navigation** (and use **vibe-coding-module** for where the new screen lives).

**When working on feature code, styling, or shared UI:** read **vibe-coding-module** (and use **vibe-coding-navigation** if the feature needs a new toolbar item or URL).

## One-minute overview

- **New toolbar item:** config in `src/core/config/navigation.js` + child route in `src/routes.js` + module under `src/modules/<Feature>/` — see **vibe-coding-navigation**.
- **Feature structure (target):** `components/`, `styles/` (module-scoped CSS for Ant overrides when Tailwind is not enough), `controllers/`, `model/`, `hooks/`; feature root `index.js` barrels for routes; keep components mostly presentational; logic in `controllers` / `model` / `hooks` — full rules in **vibe-coding-module**.
- **UI stack:** Ant Design for components; **Tailwind** for `className` layout and styling where the build is configured; **SASS** only when Tailwind is impractical (existing patterns use `.sass` / CSS modules). **Icons:** Font Awesome project-wide.
- **`src/core`:** avoid changes except (a) small **navigation** edits in `core/config/navigation.js`, (b) **shared** pieces under `core/components` when a widget is reused across modules, and (c) **infra** / **store** only for app-wide infrastructure — see **vibe-coding-module**.

## Repository layout note

Shared infra lives in **`src/core/infra/`**; Redux slice in **`src/core/store/slices/custom/`**; cross-feature widgets in **`src/core/components/`**; assets in **`src/assets/`**.

## Quick map

| Task | Go to |
|------|--------|
| Add or change a toolbar item or URL | **vibe-coding-navigation** |
| New screen, data loading, modals, hooks, or styling | **vibe-coding-module** |
| Both (new screen + new nav) | Read **both**, then implement navigation first, then the module. |
