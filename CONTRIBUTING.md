# Contributing

## Adding a recipe

### The automated way (preferred)

1. Open an issue with the source URL (Instagram, YouTube, blog, whatever) in the body and add the `recipe` label so it shows up in the queue.
2. When you're ready to import it, trigger the workflow manually: Actions tab → `recipe-import` → **Run workflow** → enter the issue number. (Labeling alone does not auto-run — this is intentional, so a pile of labeled issues doesn't fire off every agent at once.)
3. GitHub Actions reads the issue, fetches the source, drafts `src/recipes/<slug>.yaml`, generates 3 candidate dish photos, and comments back with the options.
4. Reply `/use 1`, `/use 2`, or `/use 3` to pick your favourite photo.
5. The action opens a PR against `main` closing the issue.

### The manual way

1. Copy `src/recipes/_template.yaml` to `src/recipes/<slug>.yaml`.
2. Fill in the fields. Pay special attention to the `steps:` array on each ingredient — it's 1-indexed and drives the Cooking Mode spotlight in [src/Recipe.tsx](src/Recipe.tsx).
3. Drop a 4:3 JPEG at `public/images/<slug>.jpg`.
4. `npm install && npm start` to verify the recipe renders.
5. Open a PR.

## Recipe schema

See [src/recipes/_template.yaml](src/recipes/_template.yaml) for the full schema with comments. The shape:

```yaml
name: Recipe Name
source: https://...
image: <slug>.jpg
servings: 4
ingredients:
  - name: chickpeas
    quantity: 1.0
    unit: can          # '' when unitless
    steps: [1, 2]
methods:
  - Step one.
  - Step two.
```

`generate-recipes-json.ts` rolls every `src/recipes/*.yaml` (excluding `_*.yaml`) into `src/recipes.json` during `prestart` / `prebuild`.

## Repo secrets

The `recipe-import` workflow needs these configured in Settings → Secrets and variables → Actions:

| Name | Required | Notes |
|---|---|---|
| `CLAUDE_CODE_OAUTH_TOKEN` | yes | Generate locally via `claude setup-token` (Pro/Max subscriber token). |
| `GEMINI_API_KEY` | yes | From https://aistudio.google.com/apikey. Used for Nano Banana 2 image generation. |
| `INSTAGRAM_SESSIONID` | optional | Instagram `sessionid` cookie. Attached when scraping `instagram.com` URLs; without it some reels may be unreachable and the action will ask you to paste the caption into the issue. |

## Local dev

```sh
npm install
npm start             # serves on http://localhost:3000
npm run build
```

Bun works too if you'd rather (`bun install && bun run start`). The `prestart` / `prebuild` hook regenerates `src/recipes.json` from the YAML files.
