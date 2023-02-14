import React, { useState } from "react";
import { ImSpinner3 } from "react-icons/im";
import { useNotification } from "../../hooks";
import commonInputClasses from "../../utils/theme";
import Selector from "../Selector";
import PosterSelector from "./PosterSelector";

const defaultActorInfo = {
  name: "",
  about: "",
  avatar: null,
  gender: "",
};

const genderOptions = [
  { title: "Male", value: "male" },
  { title: "Female", value: "female" },
  { title: "Other", value: "other" },
];

const validateActor = ({ avatar, name, about, gender }) => {
  if (!name.trim()) return { error: "Actor name is missing!" };
  if (!about.trim()) return { error: "About section is missing!" };
  if (!gender.trim()) return { error: "Actor gender is missing!" };
  if (avatar && !avatar.type?.startsWith("image")) return { error: "Invalid image / avatar file!" };

  return { error: null };
};

export default function ActorForm({ title, btnTitle, busy, onSubmit }) {
  const [actorInfo, setActorInfo] = useState({ ...defaultActorInfo });
  const [selectedAvatarForUI, setSelectedAvatarForUI] = useState("");
  const { updateNotification } = useNotification();

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
    const { error } = validateActor(actorInfo);
    if (error) return updateNotification("error", error);

    const formData = new FormData();
    for (let key in actorInfo) {
      if (key) formData.append(key, actorInfo[key]);
    }
    onSubmit(formData);
  };
  const { name, about, gender } = actorInfo;

  return (
    <form className="dark:bg-primary bg-white p-3 w-[35rem] rounded" onSubmit={handleSubmit}>
      <div className="flex justify-between items-center mb-3">
        <h1 className="font-semibold text-xl dark:text-white text-primary">{title}</h1>
        <button
          className="h-8 w-24 bg-primary text-white dark:bg-white dark:text-primary hover:opacity-80 transition rounded flex items-center justify-center"
          type="submit"
        >
          {busy ? <ImSpinner3 className="animate-spin" /> : btnTitle}
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
          <div className="mt-3">
            <Selector
              options={genderOptions}
              name="gender"
              label="Gender"
              value={gender}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
