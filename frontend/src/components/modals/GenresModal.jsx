import React, { useState, useEffect } from "react";
import genres from "../../utils/genres";
import Submit from "../form/Submit";
import ModalContainer from "./ModalContainer";

export default function GenresModal({ visible, previousSelection, onClose, onSubmit }) {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const handleGenresSelector = (genre) => {
    let newGenres = [];
    if (selectedGenres.includes(genre)) {
      newGenres = selectedGenres.filter((gen) => gen !== genre);
    } else {
      newGenres = [...selectedGenres, genre];
    }
    setSelectedGenres([...newGenres]);
  };
  const handleSubmit = () => {
    onSubmit(selectedGenres);
    onClose();
  };

  const handleClose = () => {
    setSelectedGenres(previousSelection);
    onClose();
  };
  useEffect(() => {
    setSelectedGenres(previousSelection);
  }, []);

  return (
    <ModalContainer visible={visible} onClose={handleClose}>
      <div className="flex flex-col justify-between h-full">
        <div>
          <h1 className="dark:text-white text-primary text-2xl font-semibold text-center">
            Select Genres
          </h1>
          <div className="space-y-3">
            {genres.map((gen) => {
              return (
                <Genre
                  selected={selectedGenres.includes(gen)}
                  onClick={() => handleGenresSelector(gen)}
                  key={gen}
                >
                  {gen}
                </Genre>
              );
            })}
          </div>
        </div>
        <div className="w-56 self-center">
          <Submit value="Select" type="button" onClick={handleSubmit} />
        </div>
      </div>
    </ModalContainer>
  );
}

const Genre = ({ children, selected, onClick, key }) => {
  const getSelectedStyle = () => {
    return selected
      ? "dark:bg-white dark:text-primary bg-light-subtle text-white"
      : "text-primary dark:text-white ";
  };
  return (
    <button
      key={key}
      onClick={onClick}
      className={
        getSelectedStyle() +
        "border-2 dark:border-dark-subtle border-light-subtle  p-1 rounded mr-3"
      }
    >
      {children}
    </button>
  );
};
