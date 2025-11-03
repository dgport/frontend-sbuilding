import type React from "react";

export function SvgDefinitions() {
  return (
    <defs>
      {/* Background image pattern for clipping */}
      <pattern
        id="bgImage"
        x="0"
        y="0"
        width="1280"
        height="800"
        patternUnits="userSpaceOnUse"
      >
        <image
          href="/images/elisium/Gegma.png"
          x="0"
          y="0"
          width="1280"
          height="800"
          preserveAspectRatio="xMidYMid meet"
        />
      </pattern>

      {/* Available (green) - hover is lighter */}
      <linearGradient id="freeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#22c55e" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#16a34a" stopOpacity="0.45" />
      </linearGradient>
      <linearGradient id="freeHoverGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#22c55e" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#16a34a" stopOpacity="0.25" />
      </linearGradient>

      {/* Sold (red) - hover is lighter */}
      <linearGradient id="soldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ef4444" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#dc2626" stopOpacity="0.45" />
      </linearGradient>
      <linearGradient id="soldHoverGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ef4444" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#dc2626" stopOpacity="0.25" />
      </linearGradient>

      <filter id="dropShadow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
        <feOffset dx="0" dy="2" result="offsetblur" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.5" />
        </feComponentTransfer>
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* Enhanced lift shadow with multiple layers */}
      <filter id="liftShadow" x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur1" />
        <feOffset in="blur1" dx="0" dy="6" result="offset1" />

        <feGaussianBlur in="SourceAlpha" stdDeviation="10" result="blur2" />
        <feOffset in="blur2" dx="0" dy="12" result="offset2" />

        <feComponentTransfer>
          <feFuncA type="linear" slope="0.5" />
        </feComponentTransfer>
        <feMerge>
          <feMergeNode in="offset2" />
          <feMergeNode in="offset1" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );
}
