---
name: vibe-coding-navigation
description: >-
  How to add authenticated app toolbar items, route wiring, and path helpers in
  desoops-portal. Use with the vibe-coding index skill when working on navigation
  or routes.
---

# Vibe coding — navigation and routes

Use this when adding or changing the **primary navigation** (top `AppToolbar`) or **app routes**.

## Toolbar config

**File:** `src/core/config/navigation.js`

- **Main toolbar items:** `MAIN_TOOLBAR_ITEMS` — each entry includes:
  - `segment` (for `NavLink`) consistent with `src/routes.js`, **or** `deposits: true` for the Deposits handler
  - `icon` — Font Awesome solid from `@fortawesome/free-solid-svg-icons`
  - `label` — string shown in the UI

### Paths: `buildAppPath`

**File:** `src/constants/paths.js` (barrel `src/constants/index.js`)

Use `buildAppPath('segment')` for consistent paths (e.g. `/distribute`, `/wallet`). Import in `navigation.js` via `'../../constants/paths'` from `src/core/config/`.

The URL **segment** must match the nested route under `/` in `src/routes.js`.

### Toolbar UI

**Directory:** `src/core/components/layout/AppToolbar/` (`index.js`, `Logo/`, `ToolbarDropDown/`).

Reads `MAIN_TOOLBAR_ITEMS`; uses `NavLink` for route items and `onNotificationsClick?.()` for Deposits.

## Routes

**File:** `src/routes.js` — exports `appRouter` (`createBrowserRouter`):

- `/` → `CoreApp` with children: index `Navigate` → `distribute`, `DistributionDashboard`, `WalletDashboard`
- `/optout/:publicKey?` → `OptOut` + `loader`

**Bootstrap:** `src/index.js` wraps with `RouterProvider router={appRouter}` after Firebase / Agilit-e init.

## Auth shell vs URL

| Concern | Location |
|---------|-----------|
| Route tree | `src/routes.js` |
| Login / spinners vs main app | `src/modules/CoreApp/index.js` — `renderState` (`INIT`, `LOGIN`, `SIGNING_IN`, `LAUNCH`) |
| Logged-in feature area | **`LAUNCH`** → `<Outlet />` + `Notifications` |
| Toolbar | `src/core/components/layout/AppToolbar/` |

Global phase enums: `src/core/infra/enums.js` → `appRenderState` (not the same as URL segments).

## Checklist: new toolbar + screen

1. `MAIN_TOOLBAR_ITEMS` in `src/core/config/navigation.js` (and `ROUTE_SEGMENTS` / `buildAppPath` in `src/constants/paths.js` if new segment).
2. Child route in `src/routes.js` under `/`.
3. Module under `src/modules/<Feature>/` (see **vibe-coding-module**).

### `src/core` policy

Minimal edits for nav: **`src/core/config/navigation.js`** and **`src/core/components/layout/AppToolbar/`** styling/layout only when necessary. Broader `src/core` rules: **vibe-coding-module**.

## Quick reference

| What | Where |
|------|--------|
| Toolbar config | `src/core/config/navigation.js` |
| Path helper | `src/constants/paths.js` |
| Toolbar UI | `src/core/components/layout/AppToolbar/` |
| Routes | `src/routes.js` |
| Router mount | `src/index.js` |
