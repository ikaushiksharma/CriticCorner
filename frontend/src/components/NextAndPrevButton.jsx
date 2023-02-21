import React from "react";

export default function NextAndPrevButton({ onPrevClick, onNextClick, className = "" }) {
  const getClasses = () => "flex justify-end items-center space-x-3";
  return (
    <div className={getClasses() + className}>
      <Button onClick={onPrevClick} title="Prev" />
      <Button onClick={onNextClick} title="Next" />
    </div>
  );
}

const Button = ({ title, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-primary dark:text-white hover:underline"
    >
      {title}
    </button>
  );
};
