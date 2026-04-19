import React from "react";
import type { CardStyle, Recipe } from "./types";
import RecipePlaceholder, { hueFor } from "./RecipePlaceholder";

interface GalleryProps {
  recipes: Recipe[];
  onOpen: (r: Recipe) => void;
  cardStyle: CardStyle;
}

const Gallery: React.FC<GalleryProps> = ({ recipes, onOpen, cardStyle }) => {
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
          alignItems: "baseline",
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
      </div>

      <div
        className={cardStyle === "list" ? undefined : "rp-grid-3"}
        style={{
          display: "grid",
          gridTemplateColumns: cardStyle === "list" ? "1fr" : "repeat(3, 1fr)",
          gap: cardStyle === "polaroid" ? 28 : 24,
        }}
      >
        {recipes.map((r) => (
          <RecipeCard key={r.name} recipe={r} onOpen={onOpen} cardStyle={cardStyle} />
        ))}
      </div>

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

const RecipeCard: React.FC<CardProps & { cardStyle: CardStyle }> = ({ recipe, onOpen, cardStyle }) => {
  if (cardStyle === "polaroid") return <PolaroidCard recipe={recipe} onOpen={onOpen} />;
  if (cardStyle === "list") return <ListCard recipe={recipe} onOpen={onOpen} />;
  return <SimpleCard recipe={recipe} onOpen={onOpen} />;
};

const SimpleCard: React.FC<CardProps> = ({ recipe, onOpen }) => (
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
        aspectRatio: "4/3",
        overflow: "hidden",
        borderRadius: 4,
        border: "1px solid var(--rule-soft)",
        marginBottom: 10,
        transition: "transform 0.25s ease",
      }}
    >
      <RecipePlaceholder recipe={recipe} />
    </div>
    <h3
      className="card-title"
      style={{
        fontFamily: "var(--mono)",
        fontSize: 15,
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
        fontSize: 11,
        color: "var(--fg-3)",
        marginTop: 4,
      }}
    >
      {recipe.methods.length} steps · {recipe.ingredients.length} ingredients
    </div>
  </article>
);

const PolaroidCard: React.FC<CardProps> = ({ recipe, onOpen }) => {
  const tilt = (hueFor(recipe.name) % 7) - 3;
  return (
    <article
      onClick={() => onOpen(recipe)}
      style={{
        cursor: "pointer",
        background: "var(--paper-2)",
        padding: 10,
        paddingBottom: 48,
        border: "1px solid var(--rule-soft)",
        boxShadow: "0 6px 14px -6px oklch(20% 0.02 60 / 0.18)",
        transform: `rotate(${tilt}deg)`,
        transition: "transform 0.25s ease",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "rotate(0deg) translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = `rotate(${tilt}deg)`;
      }}
    >
      <div style={{ aspectRatio: "1/1", overflow: "hidden" }}>
        <RecipePlaceholder recipe={recipe} />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 10,
          left: 12,
          right: 12,
          fontFamily: "var(--hand)",
          fontSize: 22,
          color: "var(--fg)",
          lineHeight: 1,
        }}
      >
        {recipe.name.toLowerCase()}
      </div>
    </article>
  );
};

const ListCard: React.FC<CardProps> = ({ recipe, onOpen }) => (
  <article
    onClick={() => onOpen(recipe)}
    style={{
      cursor: "pointer",
      display: "grid",
      gridTemplateColumns: "56px 1fr auto",
      gap: 14,
      alignItems: "center",
      padding: "10px 4px",
      borderBottom: "1px dashed var(--rule-soft)",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = "var(--paper-2)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "transparent";
    }}
  >
    <div style={{ width: 56, height: 56, borderRadius: 3, overflow: "hidden" }}>
      <RecipePlaceholder recipe={recipe} showLabel={false} />
    </div>
    <div style={{ fontFamily: "var(--mono)", fontSize: 14, fontWeight: 700 }}>
      {recipe.name.toLowerCase()}
    </div>
    <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--fg-3)" }}>
      {recipe.methods.length} steps
    </div>
  </article>
);

export default Gallery;
