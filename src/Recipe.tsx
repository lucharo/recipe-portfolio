import React from "react";
import type { Recipe as RecipeT } from "./types";
import Icon from "./Icon";
import RecipePlaceholder from "./RecipePlaceholder";

interface RecipeProps {
  recipe: RecipeT;
  onBack: () => void;
}

type WakeLockSentinel = { release: () => Promise<void> };

const fmtQty = (q: number): string => {
  if (q === 0) return "";
  if (Number.isInteger(q)) return String(q);
  const frac: Record<string, string> = {
    "0.25": "¼", "0.5": "½", "0.75": "¾", "0.33": "⅓", "0.67": "⅔",
  };
  const whole = Math.floor(q);
  const rest = +(q - whole).toFixed(2);
  const f = frac[rest.toString()];
  if (whole === 0 && f) return f;
  if (f) return `${whole}${f}`;
  return q.toString();
};

interface SourceLabel {
  text: string;
  link: string | null;
  deleted: boolean;
  platform: string;
}

const deriveSource = (recipe: RecipeT): SourceLabel => {
  let host = "";
  let platform = "source";
  let autoLabel = "source";
  try {
    const u = new URL(recipe.source);
    host = u.hostname.replace(/^www\./, "");
    if (host.includes("instagram.com")) {
      platform = "instagram";
      const parts = u.pathname.split("/").filter(Boolean);
      if (parts[0] === "p") autoLabel = "@instagram";
      else if (parts[0]) autoLabel = "@" + parts[0].replace(/^@/, "") + " on instagram";
      else autoLabel = "instagram";
    } else if (host.includes("youtube.com") || host.includes("youtu.be")) {
      platform = "youtube";
      autoLabel = "youtube";
    } else if (host.includes("tiktok.com")) {
      platform = "tiktok";
      const parts = u.pathname.split("/").filter(Boolean);
      autoLabel = parts[0] ? `${parts[0]} on tiktok` : "tiktok";
    } else {
      platform = host;
      autoLabel = host;
    }
  } catch {
    // keep fallbacks
  }

  const deleted = recipe.deleted === true;
  const creator = recipe.creator && recipe.creator.trim() ? recipe.creator.trim() : null;

  if (deleted) {
    const base = creator ? `${creator} on ${platform}` : platform;
    return { text: `${base} (deleted)`, link: null, deleted: true, platform };
  }
  if (creator) {
    return { text: `${creator} on ${platform}`, link: recipe.source, deleted: false, platform };
  }
  return { text: autoLabel, link: recipe.source, deleted: false, platform };
};

const Recipe: React.FC<RecipeProps> = ({ recipe, onBack }) => {
  const [servings, setServings] = React.useState(recipe.servings);
  const [hoveredStep, setHoveredStep] = React.useState<number | null>(null);
  const [playMode, setPlayMode] = React.useState(false);
  const [playStep, setPlayStep] = React.useState(1);
  const wakeLock = React.useRef<WakeLockSentinel | null>(null);

  const total = recipe.methods.length;
  const activeStep = playMode ? playStep : hoveredStep;

  const multiplier = servings / recipe.servings;
  const scaledIngredients = recipe.ingredients.map((i) => ({
    ...i,
    quantity: +(i.quantity * multiplier).toFixed(2),
  }));

  const source = React.useMemo(() => deriveSource(recipe), [recipe]);

  const next = React.useCallback(
    () => setPlayStep((s) => Math.min(total, s + 1)),
    [total]
  );
  const prev = React.useCallback(
    () => setPlayStep((s) => Math.max(1, s - 1)),
    []
  );

  React.useEffect(() => {
    if (!playMode) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowRight") {
        e.preventDefault();
        next();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.code === "Escape") {
        setPlayMode(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [playMode, next, prev]);

  React.useEffect(() => {
    if (!playMode) return;
    const onTap = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target.closest("button, a, input")) return;
      next();
    };
    window.addEventListener("click", onTap);
    return () => window.removeEventListener("click", onTap);
  }, [playMode, next]);

  React.useEffect(() => {
    if (!playMode) return;
    (async () => {
      try {
        const nav = navigator as Navigator & {
          wakeLock?: { request: (t: "screen") => Promise<WakeLockSentinel> };
        };
        if (nav.wakeLock) {
          wakeLock.current = await nav.wakeLock.request("screen");
        }
      } catch {
        /* noop */
      }
    })();
    return () => {
      if (wakeLock.current) {
        try { wakeLock.current.release(); } catch { /* noop */ }
        wakeLock.current = null;
      }
    };
  }, [playMode]);

  const togglePlay = () => {
    setPlayMode((p) => {
      if (!p) setPlayStep(1);
      return !p;
    });
  };

  React.useEffect(() => {
    if (!playMode) return;
    const el = document.querySelector<HTMLElement>(`[data-step="${playStep}"]`);
    if (el) el.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [playMode, playStep]);

  return (
    <main style={{ maxWidth: 1240, margin: "0 auto", padding: "24px 24px 64px", width: "100%" }}>
      <button
        onClick={onBack}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          fontFamily: "var(--mono)",
          fontSize: 12,
          color: "var(--fg-2)",
          marginBottom: 20,
        }}
      >
        <Icon name="arrow-left" size={13} /> all recipes
      </button>

      <header
        className="rp-recipe-header"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) 220px",
          gap: 28,
          alignItems: "start",
          marginBottom: 24,
          paddingBottom: 20,
          borderBottom: "1px dashed var(--rule)",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--mono)",
              fontWeight: 700,
              fontSize: "clamp(28px, 4vw, 44px)",
              lineHeight: 1.1,
              margin: 0,
              marginBottom: 10,
              letterSpacing: "-0.01em",
            }}
          >
            {recipe.name.toLowerCase()}
          </h1>
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: 13,
              color: "var(--fg-2)",
              marginBottom: 14,
            }}
          >
            modified from{" "}
            {source.link ? (
              <a href={source.link} target="_blank" rel="noreferrer" className="link-underline">
                {source.text} <Icon name="external" size={10} />
              </a>
            ) : (
              <span style={{ color: "var(--fg-3)" }}>{source.text}</span>
            )}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
              marginBottom: 14,
            }}
          >
            <span style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--fg-2)" }}>
              servings
            </span>
            <button onClick={() => setServings((s) => Math.max(1, s - 1))} style={stepperBtn}>
              −
            </button>
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 20,
                fontWeight: 700,
                minWidth: 28,
                textAlign: "center",
              }}
            >
              {servings}
            </div>
            <button onClick={() => setServings((s) => s + 1)} style={stepperBtn}>
              +
            </button>
            <div style={{ display: "flex", gap: 4, marginLeft: 6 }}>
              {[1, 2, 3, 4].map((m) => {
                const val = recipe.servings * m;
                const active = val === servings;
                return (
                  <button
                    key={m}
                    onClick={() => setServings(val)}
                    style={{
                      padding: "3px 9px",
                      fontFamily: "var(--mono)",
                      fontSize: 11,
                      color: active ? "var(--bg)" : "var(--fg-2)",
                      background: active ? "var(--fg)" : "transparent",
                      border: `1px solid ${active ? "var(--fg)" : "var(--rule)"}`,
                      borderRadius: 2,
                    }}
                  >
                    {m}x
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div
          className="rp-recipe-header-photo"
          style={{
            aspectRatio: "1/1",
            borderRadius: 4,
            overflow: "hidden",
            border: "1px solid var(--rule-soft)",
          }}
        >
          <RecipePlaceholder recipe={recipe} />
        </div>
      </header>

      <section
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: 20,
        }}
      >
        <button
          onClick={togglePlay}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "9px 14px",
            background: playMode ? "var(--fg)" : "var(--accent)",
            color: "var(--bg)",
            border: `1px solid ${playMode ? "var(--fg)" : "var(--accent)"}`,
            borderRadius: 3,
            fontFamily: "var(--mono)",
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          <Icon name={playMode ? "stop" : "play"} size={13} />
          {playMode ? "stop" : "play mode"}
        </button>

        {playMode && (
          <>
            <button onClick={prev} disabled={playStep === 1} style={playNavBtn(playStep === 1)}>
              <Icon name="arrow-left" size={12} /> prev
            </button>
            <button onClick={next} disabled={playStep === total} style={playNavBtn(playStep === total)}>
              next <Icon name="arrow-right" size={12} />
            </button>
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 13,
                fontWeight: 700,
                color: "var(--fg-2)",
              }}
            >
              step {playStep} / {total}
            </div>
            <div
              style={{
                marginLeft: "auto",
                fontFamily: "var(--mono)",
                fontSize: 11,
                color: "var(--fg-3)",
              }}
            >
              press space · tap · ← →
            </div>
          </>
        )}
      </section>

      {playMode && (
        <div
          style={{
            height: 2,
            background: "var(--rule-soft)",
            position: "relative",
            marginBottom: 18,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              width: `${(playStep / total) * 100}%`,
              background: "var(--accent)",
              transition: "width 0.3s ease",
            }}
          />
        </div>
      )}

      <section
        className="rp-recipe-split"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 0.8fr) minmax(0, 1.2fr)",
          gap: 40,
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: "var(--mono)",
              fontSize: 14,
              fontWeight: 700,
              marginTop: 0,
              marginBottom: 10,
              color: "var(--fg-2)",
            }}
          >
            <span style={{ color: "var(--accent)" }}># </span>ingredients
          </h2>
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {scaledIngredients.map((ing, i) => {
              const linked = activeStep !== null && ing.steps.includes(activeStep);
              const dim = activeStep !== null && !linked;
              return (
                <li
                  key={i}
                  style={{
                    display: "flex",
                    gap: 8,
                    padding: "6px 0",
                    fontFamily: "var(--mono)",
                    fontSize: 14,
                    opacity: dim ? 0.35 : 1,
                    color: linked ? "var(--accent)" : "var(--fg)",
                    fontWeight: linked ? 700 : 400,
                    transition: "opacity 0.15s, color 0.15s",
                  }}
                >
                  <span
                    style={{
                      minWidth: 56,
                      color: linked ? "var(--accent)" : "var(--fg-2)",
                    }}
                  >
                    {fmtQty(ing.quantity)}
                    {ing.unit ? ` ${ing.unit}` : ""}
                  </span>
                  <span>{ing.name}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <h2
            style={{
              fontFamily: "var(--mono)",
              fontSize: 14,
              fontWeight: 700,
              marginTop: 0,
              marginBottom: 10,
              color: "var(--fg-2)",
              display: "flex",
              alignItems: "baseline",
              gap: 10,
            }}
          >
            <span>
              <span style={{ color: "var(--accent)" }}># </span>methods
            </span>
            {!playMode && (
              <span style={{ fontWeight: 400, color: "var(--fg-3)", fontSize: 11 }}>
                hover a step →
              </span>
            )}
          </h2>
          <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {recipe.methods.map((step, i) => {
              const n = i + 1;
              const active = activeStep === n;
              const faded = playMode && !active;
              return (
                <li
                  key={i}
                  data-step={n}
                  onMouseEnter={() => !playMode && setHoveredStep(n)}
                  onMouseLeave={() => !playMode && setHoveredStep(null)}
                  onClick={() => playMode && setPlayStep(n)}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "30px 1fr",
                    gap: 12,
                    padding: "10px 10px 10px 6px",
                    background: active ? "var(--paper-2)" : "transparent",
                    borderLeft: `2px solid ${active ? "var(--accent)" : "transparent"}`,
                    transition: "background 0.15s, border-color 0.15s, opacity 0.15s",
                    fontFamily: "var(--mono)",
                    fontSize: 14,
                    lineHeight: 1.5,
                    opacity: faded ? 0.35 : 1,
                    fontWeight: active && playMode ? 700 : 400,
                    cursor: playMode ? "pointer" : "default",
                  }}
                >
                  <span
                    style={{
                      color: active ? "var(--accent)" : "var(--fg-3)",
                      fontWeight: 700,
                    }}
                  >
                    {n}.
                  </span>
                  <span>{step}</span>
                </li>
              );
            })}
          </ol>

          {recipe.notes && recipe.notes.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <h3
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 14,
                  fontWeight: 700,
                  marginBottom: 8,
                  color: "var(--fg-2)",
                }}
              >
                <span style={{ color: "var(--accent)" }}># </span>notes
              </h3>
              <ol
                style={{
                  paddingLeft: 20,
                  color: "var(--fg-2)",
                  fontFamily: "var(--mono)",
                  fontSize: 13,
                  lineHeight: 1.55,
                }}
              >
                {recipe.notes.map((n, i) => (
                  <li key={i} style={{ marginBottom: 4 }}>
                    {n}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

const stepperBtn: React.CSSProperties = {
  width: 26,
  height: 26,
  border: "1px solid var(--rule)",
  fontFamily: "var(--mono)",
  fontSize: 14,
  color: "var(--fg-2)",
  borderRadius: 2,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

const playNavBtn = (disabled: boolean): React.CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "7px 12px",
  border: "1px solid var(--rule)",
  background: "transparent",
  color: "var(--fg-2)",
  fontFamily: "var(--mono)",
  fontSize: 12,
  borderRadius: 3,
  opacity: disabled ? 0.4 : 1,
});

export default Recipe;
