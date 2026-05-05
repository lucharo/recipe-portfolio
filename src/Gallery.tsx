import React from "react";
import type { Recipe, ViewMode } from "./types";
import RecipePlaceholder from "./RecipePlaceholder";
import Icon from "./Icon";

interface GalleryProps {
  recipes: Recipe[];
  onOpen: (r: Recipe) => void;
  viewMode: ViewMode;
  setViewMode: (m: ViewMode) => void;
}

const Gallery: React.FC<GalleryProps> = ({ recipes, onOpen, viewMode, setViewMode }) => {
  return (
    <main style={{ maxWidth: 1240, margin: "0 auto", padding: "40px 24px 80px", width: "100%" }}>
      <section style={{ marginBottom: 36 }}>
        <h1
          style={{
            fontFamily: "var(--mono)",
            fontWeight: 700,
            fontSize: "clamp(28px, 4vw, 40px)",
            lineHeight: 1.15,
            margin: 0,
            marginBottom: 12,
            letterSpacing: "-0.01em",
          }}
        >
          <span style={{ color: "var(--accent)" }}>#</span> recipe portfolio
        </h1>
        <p
          style={{
            fontFamily: "var(--mono)",
            fontSize: 14,
            color: "var(--fg-2)",
            maxWidth: 680,
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          this is my personal recipe collection — recipes I've gathered from
          instagram, youtube and the web more broadly, all tested and cooked on a
          recurrent basis. built to make it easier to keep cooking them and to
          share them with others.
        </p>
      </section>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 20,
          paddingBottom: 10,
          borderBottom: "1px dashed var(--rule)",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--mono)",
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: "0.04em",
            textTransform: "lowercase",
            margin: 0,
          }}
        >
          recipes
        </h2>
        <span style={{ color: "var(--fg-3)", fontFamily: "var(--mono)", fontSize: 12 }}>
          ({recipes.length})
        </span>
        <div style={{ flex: 1 }} />
        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
      </div>

      {viewMode === "grid" ? (
        <div
          className="rp-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 18,
          }}
        >
          {recipes.map((r) => (
            <RecipeCard key={r.name} recipe={r} onOpen={onOpen} />
          ))}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {recipes.map((r) => (
            <RecipeRow key={r.name} recipe={r} onOpen={onOpen} />
          ))}
        </div>
      )}

      <footer
        style={{
          marginTop: 64,
          paddingTop: 24,
          borderTop: "1px dashed var(--rule)",
          fontFamily: "var(--mono)",
          fontSize: 12,
          color: "var(--fg-3)",
        }}
      >
        by{" "}
        <a href="https://github.com/lucharo" className="link-underline">
          @lucharo
        </a>
        , 2023
      </footer>
    </main>
  );
};

interface CardProps {
  recipe: Recipe;
  onOpen: (r: Recipe) => void;
}

const RecipeCard: React.FC<CardProps> = ({ recipe, onOpen }) => (
  <article
    onClick={() => onOpen(recipe)}
    style={{ cursor: "pointer", display: "flex", flexDirection: "column" }}
    onMouseEnter={(e) => {
      const w = e.currentTarget.querySelector<HTMLDivElement>(".img-wrap");
      const t = e.currentTarget.querySelector<HTMLHeadingElement>(".card-title");
      if (w) w.style.transform = "translateY(-2px)";
      if (t) t.style.color = "var(--accent)";
    }}
    onMouseLeave={(e) => {
      const w = e.currentTarget.querySelector<HTMLDivElement>(".img-wrap");
      const t = e.currentTarget.querySelector<HTMLHeadingElement>(".card-title");
      if (w) w.style.transform = "translateY(0)";
      if (t) t.style.color = "var(--fg)";
    }}
  >
    <div
      className="img-wrap"
      style={{
        aspectRatio: "1/1",
        overflow: "hidden",
        borderRadius: 4,
        border: "1px solid var(--rule-soft)",
        marginBottom: 8,
        transition: "transform 0.25s ease",
      }}
    >
      <RecipePlaceholder recipe={recipe} />
    </div>
    <h3
      className="card-title"
      style={{
        fontFamily: "var(--mono)",
        fontSize: 13,
        fontWeight: 700,
        margin: 0,
        lineHeight: 1.25,
        transition: "color 0.15s ease",
      }}
    >
      {recipe.name.toLowerCase()}
    </h3>
    <div
      style={{
        fontFamily: "var(--mono)",
        fontSize: 10,
        color: "var(--fg-3)",
        marginTop: 3,
      }}
    >
      {recipe.methods.length} steps · {recipe.ingredients.length} ingredients
    </div>
  </article>
);

interface ViewToggleProps {
  viewMode: ViewMode;
  setViewMode: (m: ViewMode) => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, setViewMode }) => {
  const btn = (mode: ViewMode, icon: "grid" | "list", label: string) => {
    const active = viewMode === mode;
    return (
      <button
        onClick={() => setViewMode(mode)}
        title={label}
        aria-label={label}
        aria-pressed={active}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 28,
          height: 28,
          borderRadius: 3,
          border: "1px solid",
          borderColor: active ? "var(--rule)" : "transparent",
          background: active ? "var(--rule-soft)" : "transparent",
          color: active ? "var(--fg)" : "var(--fg-3)",
        }}
      >
        <Icon name={icon} size={14} />
      </button>
    );
  };
  return (
    <div style={{ display: "inline-flex", gap: 4 }}>
      {btn("grid", "grid", "grid view")}
      {btn("list", "list", "list view")}
    </div>
  );
};

const RecipeRow: React.FC<CardProps> = ({ recipe, onOpen }) => (
  <article
    onClick={() => onOpen(recipe)}
    style={{
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "10px 4px",
      borderBottom: "1px dashed var(--rule-soft)",
    }}
    onMouseEnter={(e) => {
      const t = e.currentTarget.querySelector<HTMLHeadingElement>(".row-title");
      if (t) t.style.color = "var(--accent)";
    }}
    onMouseLeave={(e) => {
      const t = e.currentTarget.querySelector<HTMLHeadingElement>(".row-title");
      if (t) t.style.color = "var(--fg)";
    }}
  >
    <div
      style={{
        width: 56,
        height: 56,
        flexShrink: 0,
        overflow: "hidden",
        borderRadius: 4,
        border: "1px solid var(--rule-soft)",
      }}
    >
      <RecipePlaceholder recipe={recipe} />
    </div>
    <div style={{ display: "flex", flexDirection: "column", minWidth: 0, flex: 1 }}>
      <h3
        className="row-title"
        style={{
          fontFamily: "var(--mono)",
          fontSize: 14,
          fontWeight: 700,
          margin: 0,
          lineHeight: 1.25,
          transition: "color 0.15s ease",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {recipe.name.toLowerCase()}
      </h3>
      <div
        style={{
          fontFamily: "var(--mono)",
          fontSize: 11,
          color: "var(--fg-3)",
          marginTop: 3,
        }}
      >
        {recipe.methods.length} steps · {recipe.ingredients.length} ingredients
        {recipe.creator ? ` · ${recipe.creator.toLowerCase()}` : ""}
      </div>
    </div>
  </article>
);

export default Gallery;
