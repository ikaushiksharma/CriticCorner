import React, { useEffect, useState } from "react";
import { BsTrash, BsPencilSquare } from "react-icons/bs";
import { getActors } from "../../api/actor";
import { useNotification } from "../../hooks";
import NextAndPrevButton from "../NextAndPrevButton";

let currentPageNo = 0;
const limit = 20;
export default function Actors() {
  const [actors, setActors] = useState([]);
  const [reachedToEnd, setReachedToEnd] = useState(false);
  const { updateNotification } = useNotification();
  const fetchActors = async (pageNo) => {
    const { profiles, error } = await getActors(pageNo, limit);
    if (error) return updateNotification("error", error);
    if (!profiles.length) {
      currentPageNo = pageNo - 1;
      return setReachedToEnd(true);
    }
    setActors([...profiles]);
  };
  const handleOnNextClick = () => {
    if (reachedToEnd) return updateNotification("error", "You are on the last page");
    currentPageNo++;
    fetchActors(currentPageNo);
  };
  const handleOnPrevClick = () => {
    if (currentPageNo === 0) return updateNotification("error", "You are on the first page");
    if (reachedToEnd) setReachedToEnd(false);

    currentPageNo--;
    fetchActors(currentPageNo);
  };
  useEffect(() => {
    fetchActors(currentPageNo);
  }, []);

  return (
    <div className="p-5">
      <div className="grid grid-cols-4 gap-5 ">
        {actors.map((actor) => {
          return <ActorProfile key={actor.id} profile={actor} />;
        })}
      </div>
      <NextAndPrevButton
        className="mt-5"
        onPrevClick={handleOnPrevClick}
        onNextClick={handleOnNextClick}
      />
    </div>
  );
}

const ActorProfile = ({ profile }) => {
  const [showOptions, setShowOptions] = useState(false);
  const acceptedNameLength = 15;
  const handleOnMouseEnter = () => {
    setShowOptions(true);
  };
  const handleOnMouseLeave = () => {
    setShowOptions(false);
  };
  if (!profile) return null;

  const getName = (name) => {
    if (name.length > acceptedNameLength) {
      return name.substring(0, acceptedNameLength) + "...";
    }
    return name;
  };

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
          <h1 className="text-xl text-primary dark:text-white font-semibold whitespace-nowrap">
            {getName(name)}
          </h1>
          <p className="text-primary dark:text-white opacity-70">{about.substring(0, 50)} </p>
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
