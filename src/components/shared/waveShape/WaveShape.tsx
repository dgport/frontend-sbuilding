import background from "@/root/public/images/bg-body.jpg";

export const WaveShape = ({ position = "top", className = "" }) => {
  const isTop = position === "top";

  return (
    <div
      className={`absolute ${
        isTop ? "top-0 -mt-px" : "bottom-0"
      } w-full z-10 ${className}`}
      style={{ marginBottom: isTop ? undefined : "-1px" }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 120"
        className={`w-full h-auto ${isTop ? "transform rotate-180" : ""}`}
        preserveAspectRatio="none"
      >
        <defs>
          <pattern
            id="bgPattern"
            patternUnits="userSpaceOnUse"
            width="1440"
            height="120"
          >
            <image
              href={background.src}
              x="0"
              y="0"
              width="1440"
              height="120"
              preserveAspectRatio="xMidYMid slice"
            />
          </pattern>
        </defs>
        <path
          fill="url(#bgPattern)"
          d="M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,120 L0,120 Z"
        />
      </svg>
    </div>
  );
};
