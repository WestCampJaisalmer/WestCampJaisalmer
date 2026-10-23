import React from "react";

/** Renders text with each newline as a line break (used for editable multi-line headings). */
export default function Lines({ text }: { text: string }) {
  const parts = text.split(/\r?\n/);
  return (
    <>
      {parts.map((line, i) => (
        <React.Fragment key={i}>
          {i > 0 && <br />}
          {line}
        </React.Fragment>
      ))}
    </>
  );
}
