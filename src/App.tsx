import React from "react";
import type { AppState, Recipe, RecipeDB, Theme, ViewMode } from "./types";
import TopBar from "./TopBar";
import Gallery from "./Gallery";
import RecipeView from "./Recipe";
import recipeDB from "./recipes.json";

const LS_KEY = "recipe-portfolio-state-v3";
const ACCENT = "plum";

const DEFAULT_STATE: AppState = {
  route: "gallery",
  slug: null,
  theme: "light",
  viewMode: "grid",
};

const toSlug = (name: string): string =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const loadState = (): AppState => {
  try {
    const saved = JSON.parse(localStorage.getItem(LS_KEY) || "{}") as Partial<AppState> & {
      tweaks?: { theme?: Theme };
    };
    return {
      ...DEFAULT_STATE,
      route: saved.route ?? DEFAULT_STATE.route,
      slug: saved.slug ?? DEFAULT_STATE.slug,
      theme: saved.theme ?? saved.tweaks?.theme ?? DEFAULT_STATE.theme,
      viewMode: saved.viewMode ?? DEFAULT_STATE.viewMode,
    };
  } catch {
    return DEFAULT_STATE;
  }
};

const App: React.FC = () => {
  const recipes = (recipeDB as RecipeDB).recipes;
  const [state, setState] = React.useState<AppState>(loadState);

  React.useEffect(() => {
    localStorage.setItem(
      LS_KEY,
      JSON.stringify({
        route: state.route,
        slug: state.slug,
        theme: state.theme,
        viewMode: state.viewMode,
      })
    );
  }, [state]);

  React.useEffect(() => {
    document.documentElement.dataset.theme = state.theme;
    document.documentElement.dataset.accent = ACCENT;
  }, [state.theme]);

  const setTheme = (theme: Theme) => setState((s) => ({ ...s, theme }));
  const setViewMode = (viewMode: ViewMode) => setState((s) => ({ ...s, viewMode }));
  const openRecipe = (r: Recipe) =>
    setState((s) => ({ ...s, route: "recipe", slug: toSlug(r.name) }));
  const goHome = () => setState((s) => ({ ...s, route: "gallery", slug: null }));

  const currentRecipe = state.slug
    ? recipes.find((r) => toSlug(r.name) === state.slug) ?? null
    : null;

  return (
    <>
      <TopBar theme={state.theme} setTheme={setTheme} onHome={goHome} />

      {state.route === "gallery" && (
        <Gallery
          recipes={recipes}
          onOpen={openRecipe}
          viewMode={state.viewMode}
          setViewMode={setViewMode}
        />
      )}

      {state.route === "recipe" && currentRecipe && (
        <RecipeView recipe={currentRecipe} onBack={goHome} />
      )}

      {state.route === "recipe" && !currentRecipe && (
        <div
          style={{
            padding: 60,
            textAlign: "center",
            color: "var(--fg-3)",
            fontFamily: "var(--mono)",
          }}
        >
          recipe not found.{" "}
          <button onClick={goHome} className="link-underline" style={{ color: "var(--fg)" }}>
            back home.
          </button>
        </div>
      )}
    </>
  );
};

export default App;
