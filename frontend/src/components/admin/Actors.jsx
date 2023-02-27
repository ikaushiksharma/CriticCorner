import React, { useEffect, useState } from "react";
import { BsTrash, BsPencilSquare } from "react-icons/bs";
import { deleteActor, getActors, searchActor } from "../../api/actor";
import { useNotification, useSearch } from "../../hooks";
import AppSearchForm from "../form/AppSearchForm";
import ConfirmModal from "../modals/ConfirmModal";
import UpdateActor from "../modals/UpdateActor";
import NextAndPrevButton from "../NextAndPrevButton";
import NotFoundText from "../NotFoundText";

let currentPageNo = 0;
const limit = 20;
export default function Actors() {
  const [actors, setActors] = useState([]);
  const [results, setResults] = useState([]);
  const [reachedToEnd, setReachedToEnd] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [busy, setBusy] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const { updateNotification } = useNotification();
  const { handleSearch, resetSearch, resultNotFound } = useSearch();
  const fetchActors = async (pageNo) => {
    const { profiles, error } = await getActors(pageNo, limit);
    if (error) return updateNotification("error", error);
    if (!profiles.length) {
      currentPageNo = pageNo;
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

  const handleOnEditClick = (profile) => {
    setShowUpdateModal(true);
    setSelectedProfile(profile);
  };
  const hideUpdateModal = () => {
    setShowUpdateModal(false);
  };
  const handleOnSearchSubmit = (value) => {
    setShowUpdateModal(false);
    handleSearch(searchActor, value, setResults);
  };
  const handleSearchFormReset = () => {
    resetSearch();
    setResults([]);
  };
  const handleOnActorUpdate = (profile) => {
    const newActors = actors.map((actor) => {
      if (profile.id === actor.id) return profile;
      return actor;
    });
    setActors([...newActors]);
  };
  const handleOnDeleteClick = (profile) => {
    setSelectedProfile(profile);
    setShowConfirmModal(true);
  };

  const handleOnDeleteConfirm = async () => {
    setBusy(true);
    const { error, message } = await deleteActor(selectedProfile.id);
    setBusy(false);
    if (error) {
      return updateNotification("error", error);
    }
    fetchActors(currentPageNo);
    hideConfirmModal();
    updateNotification("success", message);
  };

  const hideConfirmModal = () => {
    setShowConfirmModal(false);
  };

  useEffect(() => {
    fetchActors(currentPageNo);
  }, []);

  return (
    <>
      <div className="p-5">
        <div className="flex justify-end mb-5">
          <AppSearchForm
            placeholder="Search Actors"
            onSubmit={handleOnSearchSubmit}
            showResetIcon={results.length || resultNotFound}
            onReset={handleSearchFormReset}
          />
        </div>
        <NotFoundText text="Record Not Found" visible={resultNotFound} />
        <div className="grid grid-cols-4 gap-5 ">
          {results.length || resultNotFound
            ? results.map((actor) => (
                <ActorProfile
                  key={actor.id}
                  profile={actor}
                  onEditClick={() => handleOnEditClick(actor)}
                  onDeleteClick={() => handleOnDeleteClick(actor)}
                />
              ))
            : actors.map((actor) => (
                <ActorProfile
                  key={actor.id}
                  profile={actor}
                  onEditClick={() => handleOnEditClick(actor)}
                  onDeleteClick={() => handleOnDeleteClick(actor)}
                />
              ))}
        </div>
        {!results.length && !resultNotFound ? (
          <NextAndPrevButton
            className="mt-5"
            onPrevClick={handleOnPrevClick}
            onNextClick={handleOnNextClick}
          />
        ) : null}
      </div>
      <ConfirmModal
        visible={showConfirmModal}
        title="Are you sure?"
        subtitle="This action will remove this profile permanently"
        busy={busy}
        onConfirm={handleOnDeleteConfirm}
        onCancel={hideConfirmModal}
      />
      <UpdateActor
        visible={showUpdateModal}
        onClose={hideUpdateModal}
        initialState={selectedProfile}
        onSuccess={handleOnActorUpdate}
      />
    </>
  );
}

const ActorProfile = ({ profile, onEditClick, onDeleteClick }) => {
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
        <Options onEditClick={onEditClick} onDeleteClick={onDeleteClick} visible={showOptions} />
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
