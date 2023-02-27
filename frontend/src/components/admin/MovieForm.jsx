import React, { useEffect, useState } from "react";
import { commonInputClasses } from "../../utils/theme";
import Submit from "../form/Submit";
import TagsInput from "../TagsInput";
import WritersModal from "../modals/WritersModal";
import CastModal from "../modals/CastModal";
import CastForm from "../form/CastForm";
import PosterSelector from "../form/PosterSelector";
import GenresSelector from "../form/GenresSelector";
import GenresModal from "../modals/GenresModal";
import Selector from "../Selector";
import { languageOptions, statusOptions, typeOptions } from "../../utils/options";
import Label from "../Label";
import DirectorSelector from "../DirectorSelector";
import WritersSelector from "../WritersSelector";
import { useNotification } from "../../hooks";
import ViewAllBtn from "../ViewAllButton";
import LabelWithBadge from "../LabelWithBadge";
import { validateMovie } from "../../utils/validator";

const defaultMovieInfo = {
  title: "",
  storyLine: "",
  tags: [],
  cast: [],
  director: {},
  writers: [],
  releaseDate: "",
  poster: null,
  genres: [],
  type: "",
  language: "",
  status: "",
};

export default function MovieForm({ onSubmit, btnTitle, initialState, busy }) {
  const [movieInfo, setMovieInfo] = useState({ ...defaultMovieInfo });
  const [showWritersModal, setShowWritersModal] = useState(false);
  const [showCastModal, setShowCastModal] = useState(false);
  const [showGenresModal, setShowGenresModal] = useState(false);
  const [selectedPosterForUI, setSelectedPosterForUI] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    const { error } = validateMovie(movieInfo);
    if (error) return updateNotification("error", error);
    const { tags, genres, cast, writers, director, poster } = movieInfo;
    const formData = new FormData();

    const finalMovieInfo = {
      ...movieInfo,
    };

    finalMovieInfo.tags = JSON.stringify(tags);
    finalMovieInfo.genres = JSON.stringify(genres);

    const finalCast = cast.map((c) => ({
      actor: c.profile.id,
      roleAs: c.roleAs,
      leadActor: c.leadActor,
    }));
    finalMovieInfo.cast = JSON.stringify(finalCast);

    if (writers.length) {
      const finalWriters = writers.map((w) => w.id);
      finalMovieInfo.writers = JSON.stringify(finalWriters);
    }
    if (director.id) finalMovieInfo.director = director.id;
    if (poster) finalMovieInfo.poster = poster;

    for (let key in finalMovieInfo) {
      formData.append(key, finalMovieInfo[key]);
    }

    onSubmit(formData);
  };
  const { updateNotification } = useNotification();
  const updatePosterForUI = (file) => {
    const url = URL.createObjectURL(file);
    setSelectedPosterForUI(url);
  };
  const handleChange = ({ target }) => {
    const { value, name, files } = target;
    if (name === "poster") {
      const poster = files[0];
      // setSelectedPosterForUI(URL.createObjectURL(poster));
      updatePosterForUI(poster);
      return setMovieInfo({ ...movieInfo, poster });
    }
    setMovieInfo({ ...movieInfo, [name]: value });
  };
  const updateTags = (tags) => {
    setMovieInfo({ ...movieInfo, tags });
  };
  const updateDirector = (profile) => {
    setMovieInfo({ ...movieInfo, director: profile });
  };
  const updateCast = (castInfo) => {
    const { cast } = movieInfo;
    setMovieInfo({ ...movieInfo, cast: [...cast, castInfo] });
  };
  const updateGenres = (genres) => {
    setMovieInfo({ ...movieInfo, genres });
  };
  const updateWriters = (profile) => {
    for (let writer of writers) {
      if (writer.id === profile.id)
        updateNotification("warning", "This profile is already selected!");
    }
    setMovieInfo({ ...movieInfo, writers: [...writers, profile] });
  };

  const hideWritersModal = () => {
    setShowWritersModal(false);
  };
  const displayWritersModal = () => {
    setShowWritersModal(true);
  };
  const hideCastModal = () => {
    setShowCastModal(false);
  };
  const displayCastModal = () => {
    setShowCastModal(true);
  };
  const displayGenresModal = () => {
    setShowGenresModal(true);
  };
  const hideGenresModal = () => {
    setShowGenresModal(false);
  };
  const handleWriterRemove = (profileId) => {
    const { writers } = movieInfo;
    const newWriters = writers.filter((writer) => writer.id !== profileId);
    if (!newWriters.length) hideWritersModal();
    setMovieInfo({ ...movieInfo, writers: [...newWriters] });
  };
  const handleCastRemove = (profileId) => {
    const { cast } = movieInfo;
    const newCast = cast.filter((profile) => profile.id !== profileId);
    if (!newCast.length) hideCastModal();
    setMovieInfo({ ...movieInfo, cast: [...newCast] });
  };

  useEffect(() => {
    if (initialState) {
      setMovieInfo({
        ...initialState,
        releaseDate: initialState.releaseDate.split("T")[0],
        poster: null,
      });
      setSelectedPosterForUI(initialState.poster);
    }
  }, [initialState]);

  const { title, storyLine, writers, cast, tags, genres, status, type, language, releaseDate } =
    movieInfo;
  return (
    <>
      <div className="flex space-x-3">
        <div className="w-[70%] space-y-5">
          <div>
            <Label htmlFor="title">Title</Label>
            <input
              value={title}
              onChange={handleChange}
              name="title"
              type="text"
              id="title"
              placeholder="Titanic"
              className={commonInputClasses + " border-b-2 font-semibold text-xl"}
            />
          </div>
          <div>
            <Label htmlFor="storyLine">StoryLine</Label>
            <textarea
              value={storyLine}
              onChange={handleChange}
              name="storyLine"
              id="storyLine"
              placeholder="Movie StoryLine here..."
              className={commonInputClasses + " border-b-2 resize-none h-24"}
            />
          </div>
          <div>
            <Label htmlFor="tags">Tags</Label>
            <TagsInput value={tags} name="tags" onChange={updateTags} />
          </div>
          <DirectorSelector onSelect={updateDirector} />
          <div>
            <div className="flex justify-between">
              <LabelWithBadge badge={writers.length} htmlFor="writers">
                Writers
              </LabelWithBadge>
              <ViewAllBtn visible={writers.length} onClick={displayWritersModal}>
                View All
              </ViewAllBtn>
            </div>
            <WritersSelector onSelect={updateWriters} />
          </div>
          <div>
            <div className="flex justify-between">
              <LabelWithBadge badge={cast.length}>Add Cast & Crew</LabelWithBadge>
              <ViewAllBtn onClick={displayCastModal} visible={cast.length}>
                View All
              </ViewAllBtn>
            </div>
            <CastForm onSubmit={updateCast} />
          </div>

          <input
            type="date"
            onChange={handleChange}
            name="releaseDate"
            value={releaseDate}
            className={commonInputClasses + " border-2 rounded p-1 w-auto"}
          />

          <Submit busy={busy} value={btnTitle} onClick={handleSubmit} type="submit" />
        </div>
        <div className="w-[30%] space-y-5">
          <PosterSelector
            onChange={handleChange}
            lable="Select Poster"
            name="poster"
            selectedPoster={selectedPosterForUI}
            accept="image/jpg, image/jpeg, image/png"
          />
          <GenresSelector badge={genres.length} onClick={displayGenresModal} />
          <Selector
            onChange={handleChange}
            name="type"
            value={type}
            label="Type"
            options={typeOptions}
          />
          <Selector
            onChange={handleChange}
            name="language"
            value={language}
            label="Language"
            options={languageOptions}
          />
          <Selector
            onChange={handleChange}
            name="status"
            value={status}
            label="Status"
            options={statusOptions}
          />
        </div>
      </div>
      <WritersModal
        onClose={hideWritersModal}
        profiles={writers}
        visible={showWritersModal}
        onRemoveClick={handleWriterRemove}
      />
      <CastModal
        onClose={hideCastModal}
        casts={cast}
        visible={showCastModal}
        onRemoveClick={handleCastRemove}
      />
      <GenresModal
        onSubmit={updateGenres}
        previousSelection={genres}
        visible={showGenresModal}
        onClose={hideGenresModal}
      />
    </>
  );
}
