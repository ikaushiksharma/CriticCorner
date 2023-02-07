import React from "react";
import TagsInput from "../TagsInput";
const commonInputClasses =
  "w-full bg-transparent outline-none border-b-2 dark:border-dark-subtle border-light-subtle dark:focus:border-white focus:border-primary transition dark:text-white text-primary";
export default function MovieForm() {
  return (
    <form className="flex space-x-3">
      <div className="w-[70%] h-5 space-y-5">
        <div>
          <Label htmlFor="title">Title</Label>
          <input
            type="text"
            id="title"
            placeholder="Titanic"
            className={commonInputClasses + " border-b-2 font-semibold text-xl"}
          />
        </div>
        <div>
          <Label htmlFor="storyLine">StoryLine</Label>
          <textarea
            id="storyLine"
            placeholder="Movie StoryLine here..."
            className={commonInputClasses + " border-b-2 resize-none h-24"}
          />
        </div>
        <TagsInput />
      </div>
      <div className="w-[30%] h-5"></div>
    </form>
  );
}

const Label = ({ htmlFor, children }) => {
  return (
    <label htmlFor={htmlFor} className="dark:text-dark-subtle text-light-subtle font-semibold">
      {children}
    </label>
  );
};
