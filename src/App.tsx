import React from "react";
import type { AppState, Recipe, RecipeDB } from "./types";
import TopBar from "./TopBar";
import Gallery from "./Gallery";
import RecipeView from "./Recipe";
import TweaksPanel from "./TweaksPanel";
import recipeDB from "./recipes.json";

const LS_KEY = "recipe-portfolio-state-v3";

const DEFAULT_STATE: AppState = {
  route: "gallery",
  slug: null,
  cardStyle: "simple",
  accent: "persimmon",
  theme: "light",
};

const toSlug = (name: string): string =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const loadState = (): AppState => {
  try {
    const saved = JSON.parse(localStorage.getItem(LS_KEY) || "{}") as Partial<AppState> & {
      tweaks?: Partial<Pick<AppState, "cardStyle" | "accent" | "theme">>;
    };
    return {
      ...DEFAULT_STATE,
      route: saved.route ?? DEFAULT_STATE.route,
      slug: saved.slug ?? DEFAULT_STATE.slug,
      cardStyle: saved.tweaks?.cardStyle ?? DEFAULT_STATE.cardStyle,
      accent: saved.tweaks?.accent ?? DEFAULT_STATE.accent,
      theme: saved.tweaks?.theme ?? DEFAULT_STATE.theme,
    };
  } catch {
    return DEFAULT_STATE;
  }
};

const App: React.FC = () => {
  const recipes = (recipeDB as RecipeDB).recipes;

  const [state, setState] = React.useState<AppState>(loadState);
  const [tweaksOpen, setTweaksOpen] = React.useState(false);

  React.useEffect(() => {
    localStorage.setItem(
      LS_KEY,
      JSON.stringify({
        route: state.route,
        slug: state.slug,
        tweaks: { cardStyle: state.cardStyle, accent: state.accent, theme: state.theme },
      })
    );
  }, [state]);

  React.useEffect(() => {
    document.documentElement.dataset.theme = state.theme;
    document.documentElement.dataset.accent = state.accent;
  }, [state.theme, state.accent]);

  const setTweak = <K extends "cardStyle" | "accent" | "theme">(
    key: K,
    value: AppState[K]
  ) => setState((s) => ({ ...s, [key]: value }));

  const openRecipe = (r: Recipe) =>
    setState((s) => ({ ...s, route: "recipe", slug: toSlug(r.name) }));
  const goHome = () => setState((s) => ({ ...s, route: "gallery", slug: null }));

  const currentRecipe = state.slug
    ? recipes.find((r) => toSlug(r.name) === state.slug) ?? null
    : null;

  return (
    <>
      <TopBar
        theme={state.theme}
        setTheme={(t) => setTweak("theme", t)}
        onHome={goHome}
        onToggleTweaks={() => setTweaksOpen((o) => !o)}
      />

      {state.route === "gallery" && (
        <Gallery recipes={recipes} onOpen={openRecipe} cardStyle={state.cardStyle} />
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
          <button
            onClick={goHome}
            className="link-underline"
            style={{ color: "var(--fg)" }}
          >
            back home.
          </button>
        </div>
      )}

      <TweaksPanel
        open={tweaksOpen}
        onClose={() => setTweaksOpen(false)}
        tweaks={{ cardStyle: state.cardStyle, accent: state.accent, theme: state.theme }}
        setTweak={setTweak}
      />
    </>
  );
};

export default App;
