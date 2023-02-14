import React, { useState } from "react";
import commonInputClasses from "../../utils/theme";
import PosterSelector from "./PosterSelector";

const defaultActorInfo = {
  name: "",
  about: "",
  avatar: null,
};
export default function ActorForm({ title, btnTitle }) {
  const [actorInfo, setActorInfo] = useState({ ...defaultActorInfo });
  const [selectedAvatarForUI, setSelectedAvatarForUI] = useState("");

  const updatePosterForUI = (file) => {
    const url = URL.createObjectURL(file);
    setSelectedAvatarForUI(url);
  };

  const handleChange = ({ target }) => {
    const { name, value, files } = target;
    if (name === "avatar") {
      updatePosterForUI(files[0]);
      return setActorInfo({ ...defaultActorInfo, avatar: files[0] });
    }
    setActorInfo({ ...actorInfo, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  const { name, about } = actorInfo;

  return (
    <form className="dark:bg-primary bg-white p-3 w-[35rem] rounded" onSubmit={handleSubmit}>
      <div className="flex justify-between items-center mb-3">
        <h1 className="font-semibold text-xl dark:text-white text-primary">{title}</h1>
        <button
          className="px-3 py-1 bg-primary text-white dark:bg-white dark:text-primary hover:opacity-80 transition rounded"
          type="submit"
        >
          {btnTitle}
        </button>
      </div>
      <div className="flex space-x-2">
        <PosterSelector
          onChange={handleChange}
          name="avatar"
          selectedPoster={selectedAvatarForUI}
          className="w-36 h-36 aspect-square object-cover rounded"
          lable="Select Avatar"
          accept="image/jpg, image/jpeg, image/png"
        />
        <div className="flex-grow flex flex-col ">
          <input
            name="name"
            placeholder="Enter name"
            type="text"
            value={name}
            onChange={handleChange}
            className={commonInputClasses + " border-b-2"}
          />
          <textarea
            name="about"
            onChange={handleChange}
            placeholder="About"
            value={about}
            className={commonInputClasses + " border-b-2 resize-none h-full"}
          />
        </div>
      </div>
    </form>
  );
}
