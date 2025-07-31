import CircularProgress from "@mui/material/CircularProgress";
import React from "react";

export default function FilePreview({
  src,
}: {
  src: string;
}): React.ReactElement {
  const [progressDisplay, setProgressDisplay] = React.useState("block");

  return (
    <div
      sx={{
        background: "#5a5a5a",
        paddingTop: "calc(3 / 4 * 100%)",
        position: "relative",
      }}
    >
      <div
        sx={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress
          style={{ color: "#aaa", display: progressDisplay }}
          size={60}
        />
      </div>
      <img
        sx={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
        src={src}
        onLoad={() => setProgressDisplay("none")}
      />
    </div>
  );
}
