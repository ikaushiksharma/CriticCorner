import React from "react";

export default function Selector({ name, value, options, onChange, label }) {
  return (
    <select
      className="border-2 dark:border-dark-subtle border-light-subtle dark:focus:border-white focus:border-primary outline-none transition p-1 pr-10 rounded bg-transparent text-light-subtle dark:text-dark-subtle dark:focus:text-white focus:text-primary"
      id={name}
      name={name}
      value={value}
      onChange={onChange}
    >
      <option value="">{label}</option>
      {options.map(({ title, value }) => {
        return (
          <select key={title} value={value}>
            {title}
          </select>
        );
      })}
    </select>
  );
}
