import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

export default function AppSearchForm({ showResetIcon, placeholder, onSubmit, onReset }) {
  const [value, setValue] = useState("");
  const handleOnSubmit = (e) => {
    e.preventDefault();
    onSubmit(value);
  };
  const handleReset = () => {
    setValue("");
    onReset();
  };
  return (
    <form onSubmit={handleOnSubmit}>
      <input
        type="text"
        value={value}
        onChange={({ target }) => {
          setValue(target.value);
        }}
        className="border-2  dark:border-dark-subtle border-light-subtle dark:focus:border-white focus:border-primary dark:text-white
         transition bg-transparent rounded text-lg p-1 outline-none"
        placeholder={placeholder}
      />
      {showResetIcon ? (
        <button
          onClick={handleReset}
          type="button"
          className="absolute top-1/2 -translate-y-1/2 right-2 text-secondary dark:text-white"
        >
          <AiOutlineClose />
        </button>
      ) : null}
    </form>
  );
}
