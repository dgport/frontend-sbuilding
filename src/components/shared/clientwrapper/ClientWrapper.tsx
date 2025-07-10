// components/ClientWrapper.js
'use client';
import { useState, useEffect } from 'react';

function LoadingScreen() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "4rem",
        fontWeight: "bold",
        fontFamily: "Arial, sans-serif",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "140px",
            height: "140px",
            border: "3px solid #f3f3f3",
            borderTop: "3px solid #333",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        ></div>

        <div
          style={{
            fontSize: "5rem",
            fontWeight: "bold",
            color: "transparent",
            background:
              "linear-gradient(to bottom, #333 0%, #333 50%, transparent 50%, transparent 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            animation: "fillUp 2s ease-in-out infinite",
          }}
        >
          A
        </div>

        {/* Loading dots */}
        <div
          style={{
            position: "absolute",
            bottom: "-40px",
            display: "flex",
            gap: "8px",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              backgroundColor: "#333",
              borderRadius: "50%",
              animation: "dot1 1.4s ease-in-out infinite",
            }}
          ></div>
          <div
            style={{
              width: "8px",
              height: "8px",
              backgroundColor: "#333",
              borderRadius: "50%",
              animation: "dot2 1.4s ease-in-out infinite",
            }}
          ></div>
          <div
            style={{
              width: "8px",
              height: "8px",
              backgroundColor: "#333",
              borderRadius: "50%",
              animation: "dot3 1.4s ease-in-out infinite",
            }}
          ></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fillUp {
          0% {
            background: linear-gradient(
              to bottom,
              transparent 0%,
              transparent 100%
            );
            background-clip: text;
            -webkit-background-clip: text;
          }
          50% {
            background: linear-gradient(to bottom, #333 0%, #333 100%);
            background-clip: text;
            -webkit-background-clip: text;
          }
          100% {
            background: linear-gradient(
              to bottom,
              transparent 0%,
              transparent 100%
            );
            background-clip: text;
            -webkit-background-clip: text;
          }
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes dot1 {
          0%,
          80%,
          100% {
            transform: scale(0);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes dot2 {
          0%,
          80%,
          100% {
            transform: scale(0);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes dot3 {
          0%,
          80%,
          100% {
            transform: scale(0);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes dot1 {
          animation-delay: 0s;
        }
        @keyframes dot2 {
          animation-delay: 0.2s;
        }
        @keyframes dot3 {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
}

export default function ClientWrapper({ children }: any) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return children;
}