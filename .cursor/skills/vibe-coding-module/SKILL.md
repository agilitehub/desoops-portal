---
name: vibe-coding-module
description: >-
  Feature module folder layout, thin UI vs controllers/model/hooks, Ant Design,
  Tailwind-only styling with theme tokens, Font Awesome icons, Agilit-e / GraphQL /
  Firebase touch points, and when to add shared components under src/core. Use with
  the vibe-coding index skill when building or refactoring feature code in
  desoops-portal.
---

# Vibe coding — feature modules, UI, and `src/core`

Use this when creating or extending **feature areas** (pages, data flow, styling, shared components).

## Target layout (post-restructure)

### Base directories

| Area | Base directory |
|------|----------------|
| All feature modules | `src/modules/<FeatureName>/` — flat siblings (`DistributionDashboard`, `Login`, `CoreApp`, `WalletDashboard`, `OptOut`, …) |
| Toolbar / shell navigation | **`src/core/components/layout/AppToolbar/`** (configured via `src/core/config/navigation.js`) |

### Per-feature structure

Under `src/modules/<FeatureName>/` use:

| Folder | Purpose |
|--------|---------|
| **`components/`** | React screens, modals, forms, and presentational pieces for this feature. |
| **`controllers/`** | Remote/session access: Agilit-e API usage, Firebase helpers, GraphQL operations composed for the UI, error mapping. Primary surface `controllers/index.js`; split files when large (e.g. `controllers/distribution.js`). |
| **`model/`** | Pure logic: transforms, validators, defaults (`model/index.js`). No network I/O. |
| **`hooks/`** | `use*` hooks for state, effects, and glue between controllers/model and UI. |

**Entry point:** feature root **`index.js`** re-exports route-facing components; **`src/routes.js`** imports from `src/modules/<Feature>` (default + named exports), not deep `components/` paths.

**Shared clients:** app-wide adapters live in **`src/core/infra/`** (`agilite-controller`, `deso-controller-graphql`, `firebase-controller`, `enums.js`, …). Typical imports: `import X from 'core/infra/...'` (Webpack alias `core` → `src/core` in `craco.config.js`).

**Naming:** keep route segments, path helpers, and folder names aligned (see **vibe-coding-navigation**).

### Thin components; logic in `controllers`, `model`, `hooks`

- **Components:** layout, Ant Design usage, **Font Awesome** icons, Tailwind `className`, local UI state (modals, selection), callbacks.
- **`controllers/`:** Agilit-e / Firebase / GraphQL orchestration and error shaping for the UI.
- **`model/`:** validation, transforms, enums/helpers without I/O.
- **`hooks/`:** shared feature state/effects (e.g. `{ data, loading, error, refetch }`).
- When a component file grows business logic, extract to `controllers`, `model`, or `hooks` and import back.

### `src/core` — default: hands off

**Avoid changing** for routine feature work: unrelated layout internals, auth wiring, Redux store slices you do not own, and infra you are not promoting.

**Exceptions:**

1. **`src/core/config/navigation.js`** — toolbar config (see **vibe-coding-navigation**).
2. **`src/core/components/layout/AppToolbar/`** — shell toolbar layout only when necessary.
3. **`src/core/components/`** — when promoting **reused** widgets (see below).
4. **`src/core/theme/`** — design tokens, Ant token map, `ThemeProvider` when extending the theme system.

### Ant Design (AntD)

- Prefer Ant Design for interactive primitives: `Button`, `Table`, `Form`, `Modal`, `Input`, `Select`, `Card`, `Tabs`, `Typography`, `message` / `notification`, etc.
- Use existing project wrappers under `src/core/components` once they exist post-migration; until then match the file’s existing import style.
- Wrap app in **`ThemeProvider`** from `src/core/theme/ThemeProvider.js` for Ant token sync.

### Icons

- Use **Font Awesome** (`@fortawesome/react-fontawesome` + `@fortawesome/free-solid-svg-icons` etc.) consistently. Avoid Ant Design’s icon package for **new** UI unless touching a file already committed to Ant icons.

### Styling: Tailwind + Ant Design + theme tokens

- **Tailwind only** — all component styling via `className` utilities.
- **Semantic tokens:** `bg-background`, `text-foreground`, `text-muted`, `border-border`, `bg-surface-muted` (from `src/core/theme/tokens.css` via `tailwind.config.js`).
- **Brand/status colors:** `text-deso-blue`, `text-deso-orange`, `text-success`, `text-error`, etc. (defined in `tailwind.config.js`).
- **Global Ant overrides:** `src/index.css` `@layer components` for `.ant-*` selectors shared app-wide.
- **Per-component Ant tuning:** Ant `classNames` / `styles` props, or Tailwind arbitrary selectors (`[&_.ant-btn]:rounded-lg`).
- **No** `.sass`, `.module.sass`, or module `styles/` folders — do not add them.
- Avoid `style={{}}` unless the value is dynamic (computed at runtime).

### Redux and global state

- App store: **`src/store.js`** imports **`src/core/store/slices/custom/`** (`reducer.js`, `state.js`). Redux mount key **`custom`**; selectors stay `state.custom.*` until renamed.

### Reusable building blocks → `src/core/components`

When a piece is **reused across unrelated features**:

- Add it under **`src/core/components/`** (with barrels if the repo uses them).
- Keep it presentation-focused; domain logic stays in module `controllers` / `model` / `hooks`.

**Promotion flow:** implement inside a feature `components/` first → extract to `core/components` when a second consumer appears.

### Domain libraries

| Concern | Placement |
|---------|-----------|
| Agilit-e session and API | feature `controllers/` calling shared helpers (`core/infra` target) |
| GraphQL documents and parsers | module `controllers/` + `model/`; shared fragments in `core/infra` or `src/constants` as appropriate |
| Firebase / messaging | controllers + thin hooks; reuse `firebase-controller` patterns |

---

## Practical layout (repo today)

| Role | Path |
|------|------|
| Feature modules | `src/modules/<Feature>/` with `components/`, `controllers/`, `model/`, `hooks/` as each feature adopts them |
| Example | `DistributionDashboard/components/`, `controllers/`, `model/` |
| Shared UI | `src/core/components/` (e.g. `Spinner`, `CoinSwapModal`, …) |
| Theme / tokens | `src/core/theme/tokens.css`, `antd-tokens.js`, `ThemeProvider.js` |
| Global styles | `src/index.css`, `tailwind.config.js`, `postcss.config.js` |
| Infra | `src/core/infra/` |
| Static assets | `src/assets/` |

Mirror a **neighbor feature** (`DistributionDashboard`, `Login`, `PWAManager`) when adding folders.

---

## Quick reference

| Task | Where |
|------|--------|
| Feature UI + logic split | `src/modules/<Feature>/{components,controllers,model,hooks}/` |
| Shared cross-feature widgets | `src/core/components/` |
| App-wide infra | `src/core/infra/` |
| Theme tokens + Tailwind config | `src/core/theme/`, `tailwind.config.js` |
| Toolbar + routes | **vibe-coding-navigation** (`navigation.js`, `routes.js`, `AppToolbar`) |

When unsure, open **DistributionDashboard**, **Login**, or **Notifications** and mirror layout, naming, and import style.
