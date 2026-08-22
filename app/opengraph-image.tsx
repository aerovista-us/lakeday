import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Lake Day — Check the lake before you go.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 72px", background: "radial-gradient(circle at 82% 12%, #174c58 0%, #0b1b21 38%, #071014 72%)", color: "#f4f7f7", fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", fontSize: 28, fontWeight: 900, letterSpacing: "0.04em" }}>🌊 LAKE DAY</div>
        <div style={{ display: "flex", fontSize: 20, color: "#5ee6d0", fontWeight: 800 }}>AEROVISTA LOCAL · CDA</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", maxWidth: 940 }}>
        <div style={{ display: "flex", color: "#5ee6d0", fontWeight: 800, fontSize: 22, letterSpacing: ".08em", marginBottom: 18 }}>LAKE COEUR D&apos;ALENE</div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 82, lineHeight: .96, fontWeight: 900, letterSpacing: "-.045em" }}>
          <span>Is today a</span><span style={{ color: "#a9c4ca" }}>good lake day?</span>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,.16)", paddingTop: 28, fontSize: 23 }}>
        <span>Weather · Wind · Air Quality · Activity-aware call</span><span style={{ color: "#7e9299", fontSize: 18 }}>Built in Coeur d&apos;Alene</span>
      </div>
    </div>,
    size
  );
}
