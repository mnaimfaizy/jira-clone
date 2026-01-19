import { ImageResponse } from "next/og";

// Image metadata
export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

// Image generation
export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 24,
        background: "#3b82f6",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        borderRadius: "20%",
      }}
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="32" height="32" fill="#3B82F6" rx="6" />
        <path d="M16 6L8 14L16 22L24 14L16 6Z" fill="white" />
        <path d="M12 14L16 18L20 14L16 10L12 14Z" fill="#1E40AF" />
        <circle cx="16" cy="14" r="2" fill="white" />
      </svg>
    </div>,
    {
      ...size,
    },
  );
}
