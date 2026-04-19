import React from "react";
import Icon from "./Icon";
import type { Theme } from "./types";

interface TopBarProps {
  theme: Theme;
  setTheme: (t: Theme) => void;
  onHome: () => void;
  onToggleTweaks: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ theme, setTheme, onHome, onToggleTweaks }) => {
  const isDark = theme === "dark";
  return (
    <header
      style={{
        borderBottom: "1px solid var(--rule)",
        background: "var(--bg)",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <button
          onClick={onHome}
          title="home"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            fontFamily: "var(--mono)",
            fontSize: 14,
            fontWeight: 700,
            color: "var(--fg)",
            padding: "6px 10px",
            border: "1px solid var(--rule)",
            borderRadius: 3,
          }}
        >
          <Icon name="home" size={14} />
          <span>recipe portfolio</span>
        </button>

        <div style={{ flex: 1 }} />

        <button
          onClick={onToggleTweaks}
          title="tweaks"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            borderRadius: 999,
            color: "var(--fg-2)",
          }}
        >
          <Icon name="sliders" size={15} />
        </button>
        <a
          href="https://github.com/lucharo/recipe-portfolio"
          target="_blank"
          rel="noreferrer"
          title="source on github"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            borderRadius: 999,
            color: "var(--fg-2)",
          }}
        >
          <Icon name="github" size={16} />
        </a>
        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          title={isDark ? "light mode" : "dark mode"}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            borderRadius: 999,
            color: "var(--fg-2)",
          }}
        >
          <Icon name={isDark ? "sun" : "moon"} size={15} />
        </button>
      </div>
    </header>
  );
};

export default TopBar;
