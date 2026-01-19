import { ImageResponse } from "next/og";

// Image metadata
export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

// Image generation
export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        background: "#3b82f6",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        width="180"
        height="180"
        viewBox="0 0 180 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="180" height="180" fill="#3B82F6" />
        <path d="M90 36L54 72L90 108L126 72L90 36Z" fill="white" />
        <path d="M72 72L90 90L108 72L90 54L72 72Z" fill="#1E40AF" />
        <circle cx="90" cy="72" r="12" fill="white" />
      </svg>
    </div>,
    {
      ...size,
    },
  );
}
