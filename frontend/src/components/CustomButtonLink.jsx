import React from "react";

export default function CustomButtonLink({ label, clickable = true, onClick }) {
  const className = clickable
    ? "text-highlight dark:text-highlight-dark hover:underline"
    : "text-highlight dark:text-highlight-dark cursor=default";
  return (
    <button type="button" className={className} onClick={onClick}>
      {label}
    </button>
  );
}
