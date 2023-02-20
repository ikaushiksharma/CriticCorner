import React, { useState } from "react";
import { BsTrash, BsPencilSquare } from "react-icons/bs";

function Actors() {
  return (
    <div className="grid grid-cols-4 gap-3 my-5">
      <ActorProfile
        profile={{
          name: "",
          avatar: "",
          about: "",
        }}
      />
    </div>
  );
}

const ActorProfile = ({ profile }) => {
  const [showOptions, setShowOptions] = useState(false);
  const handleOnMouseEnter = () => {
    setShowOptions(true);
  };
  const handleOnMouseLeave = () => {
    setShowOptions(false);
  };
  if (!profile) return null;
  const { name, avatar, about = "" } = profile;
  return (
    <div className="bg-white shadow dark:shadow dark:bg-secondary rounded h-20 overflow-hidden">
      <div
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
        className="flex cursor-pointer relative"
      >
        <img src={avatar} alt={name} className="w-20 aspect-square object-cover" />
        <div className="px-2">
          <h1 className="text-xl text-primary dark:text-white font-semibold">{name}</h1>
          <p className="text-primary dark:text-white">{about.substring(0, 50)} </p>
        </div>
        <Options visible={showOptions} />
      </div>
    </div>
  );
};

const Options = ({ visible, onDeleteClick, onEditClick }) => {
  if (!visible) return null;
  return (
    <div className="absolute inset-0 bg-primary bg-opacity-25 backdrop-blur-sm flex justify-center items-center space-x-5">
      <button
        onClick={onDeleteClick}
        className="p-2 rounded-full bg-white text-primary hover:opacity-80 transition"
        type="button"
      >
        <BsTrash />
      </button>
      <button
        onClick={onEditClick}
        className="p-2 rounded-full bg-white text-primary hover:opacity-80 transition"
        type="button"
      >
        <BsPencilSquare />
      </button>
    </div>
  );
};
export default Actors;
