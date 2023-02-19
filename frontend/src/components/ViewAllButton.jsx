import React from "react";

export default function ViewAllBtn({ visible, children, onClick }) {
  if (!visible) return null;
  return (
    <button
      type="button"
      onClick={onClick}
      className="dark:text-white text-primary hover:underline transition"
    >
      {children}
    </button>
  );
}
