import React from "react";

export default function AppInfoBox({ title, subTitle }) {
  return (
    <div className="bg-white shadow dark:shadow dark:bg-secondary p-5 rounded">
      <h1 className="font-semibold text-2xl mb-2 text-primary dark:text-white">{title}</h1>
      <p className="text-xl text-primary dark:text-white">{subTitle}</p>
    </div>
  );
}
