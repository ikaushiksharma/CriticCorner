import React from "react";

export default function NotFoundText({ text, visible }) {
  if (visible) return null;
  return (
    <h1 className="font-semibold text-3xl text-secondary dark:text-white text-center py-5 opacity-40">
      {text}
    </h1>
  );
}
