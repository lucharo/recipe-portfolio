import React from "react";

type IconName =
  | "sun" | "moon" | "play" | "stop" | "x"
  | "arrow-left" | "arrow-right" | "external" | "github" | "home"
  | "grid" | "list";

interface IconProps {
  name: IconName;
  size?: number;
  stroke?: number;
}

const Icon: React.FC<IconProps> = ({ name, size = 16, stroke = 1.6 }) => {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: stroke,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "sun":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      );
    case "moon":
      return (
        <svg {...common}>
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      );
    case "play":
      return (
        <svg {...common}>
          <path d="M7 4l13 8-13 8z" />
        </svg>
      );
    case "stop":
      return (
        <svg {...common}>
          <rect x="6" y="6" width="12" height="12" rx="1" />
        </svg>
      );
    case "x":
      return (
        <svg {...common}>
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      );
    case "arrow-left":
      return (
        <svg {...common}>
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
      );
    case "arrow-right":
      return (
        <svg {...common}>
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      );
    case "external":
      return (
        <svg {...common}>
          <path d="M14 3h7v7M10 14L21 3M19 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6" />
        </svg>
      );
    case "github":
      return (
        <svg {...common}>
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.5a3.4 3.4 0 0 0-.9-2.6c3-.3 6.2-1.5 6.2-6.8A5.3 5.3 0 0 0 19.9 5a4.9 4.9 0 0 0-.1-3.7s-1.1-.3-3.7 1.4a12.8 12.8 0 0 0-6.6 0C6.9 1 5.8 1.3 5.8 1.3A4.9 4.9 0 0 0 5.7 5a5.3 5.3 0 0 0-1.5 4.1c0 5.3 3.2 6.5 6.2 6.8a3.4 3.4 0 0 0-.9 2.6V22" />
        </svg>
      );
    case "home":
      return (
        <svg {...common}>
          <path d="M3 10l9-7 9 7v11a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2z" />
        </svg>
      );
    case "grid":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    case "list":
      return (
        <svg {...common}>
          <path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01" />
        </svg>
      );
    default:
      return null;
  }
};

export default Icon;
