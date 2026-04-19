import React from "react";
import type { Accent, AppState, CardStyle, Theme } from "./types";
import Icon from "./Icon";

interface TweaksPanelProps {
  open: boolean;
  onClose: () => void;
  tweaks: Pick<AppState, "cardStyle" | "accent" | "theme">;
  setTweak: <K extends "cardStyle" | "accent" | "theme">(key: K, value: AppState[K]) => void;
}

const CARD_STYLES: CardStyle[] = ["simple", "polaroid", "list"];
const ACCENTS: { name: Accent; color: string }[] = [
  { name: "persimmon", color: "oklch(56% 0.14 35)" },
  { name: "mustard",   color: "oklch(60% 0.13 85)" },
  { name: "forest",    color: "oklch(48% 0.12 150)" },
  { name: "plum",      color: "oklch(48% 0.13 345)" },
];
const THEMES: Theme[] = ["light", "dark"];

const TweaksPanel: React.FC<TweaksPanelProps> = ({ open, onClose, tweaks, setTweak }) => {
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        right: 16,
        bottom: 16,
        width: 260,
        background: "var(--bg)",
        border: "1px solid var(--fg)",
        borderRadius: 4,
        padding: 14,
        zIndex: 100,
        boxShadow: "0 12px 28px -10px oklch(20% 0.02 60 / 0.22)",
        fontFamily: "var(--mono)",
        fontSize: 12,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
          paddingBottom: 8,
          borderBottom: "1px dashed var(--rule)",
        }}
      >
        <span style={{ fontWeight: 700 }}># tweaks</span>
        <button
          onClick={onClose}
          title="close"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 22,
            height: 22,
            color: "var(--fg-3)",
            borderRadius: 2,
          }}
        >
          <Icon name="x" size={13} />
        </button>
      </div>

      <Row label="card style">
        {CARD_STYLES.map((v) => (
          <Seg
            key={v}
            active={tweaks.cardStyle === v}
            onClick={() => setTweak("cardStyle", v)}
          >
            {v}
          </Seg>
        ))}
      </Row>

      <Row label="accent">
        {ACCENTS.map(({ name, color }) => (
          <button
            key={name}
            onClick={() => setTweak("accent", name)}
            title={name}
            style={{
              width: 24,
              height: 24,
              borderRadius: 999,
              background: color,
              border:
                tweaks.accent === name ? "2px solid var(--fg)" : "1px solid var(--rule)",
              cursor: "pointer",
            }}
          />
        ))}
      </Row>

      <Row label="theme">
        {THEMES.map((v) => (
          <Seg key={v} active={tweaks.theme === v} onClick={() => setTweak("theme", v)}>
            {v}
          </Seg>
        ))}
      </Row>
    </div>
  );
};

const Row: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ marginBottom: 12 }}>
    <div style={{ color: "var(--fg-3)", marginBottom: 6, fontSize: 11 }}>{label}</div>
    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>{children}</div>
  </div>
);

const Seg: React.FC<{
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    style={{
      padding: "4px 9px",
      border: `1px solid ${active ? "var(--fg)" : "var(--rule)"}`,
      background: active ? "var(--fg)" : "transparent",
      color: active ? "var(--bg)" : "var(--fg-2)",
      fontFamily: "var(--mono)",
      fontSize: 11,
      borderRadius: 2,
    }}
  >
    {children}
  </button>
);

export default TweaksPanel;
