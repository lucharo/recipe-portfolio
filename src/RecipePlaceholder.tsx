import React from "react";
import type { Recipe } from "./types";

export const hueFor = (str: string): number => {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h) % 360;
};

interface Props {
  recipe: Pick<Recipe, "name" | "image">;
  style?: React.CSSProperties;
  showLabel?: boolean;
}

const hasImage = (img: Recipe["image"]): img is string =>
  !!img && img !== "N/A";

const RecipePlaceholder: React.FC<Props> = ({ recipe, style, showLabel = true }) => {
  if (hasImage(recipe.image)) {
    return (
      <img
        src={`${process.env.PUBLIC_URL}/images/${recipe.image}`}
        alt={recipe.name}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", ...style }}
        loading="lazy"
      />
    );
  }
  const hue = hueFor(recipe.name);
  const bg = `oklch(84% 0.07 ${hue})`;
  const bg2 = `oklch(76% 0.09 ${hue})`;
  const ink = `oklch(30% 0.08 ${hue})`;
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: `repeating-linear-gradient(45deg, ${bg} 0 10px, ${bg2} 10px 20px)`,
        overflow: "hidden",
        ...style,
      }}
    >
      {showLabel && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--hand)",
            fontSize: "clamp(24px, 4vw, 40px)",
            color: ink,
            opacity: 0.75,
            textAlign: "center",
            padding: 10,
            lineHeight: 1.1,
          }}
        >
          {recipe.name.toLowerCase()}
        </div>
      )}
    </div>
  );
};

export default RecipePlaceholder;
