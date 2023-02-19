import React from "react";

export default function Label({ htmlFor, children, badge }) {
  return (
    <label htmlFor={htmlFor} className="dark:text-dark-subtle text-light-subtle font-semibold">
      {children}
    </label>
  );
}
