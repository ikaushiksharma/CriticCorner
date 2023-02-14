import React, { useState } from "react";
import { commonInputClasses } from "../../utils/theme";
import Submit from "../form/Submit";
import TagsInput from "../TagsInput";
import LiveSearch from "./LiveSearch";
import useNotification from "../../hooks";
import WritersModal from "../modals/WritersModal";
import CastModal from "../modals/CastModal";
import CastForm from "../form/CastForm";
import PosterSelector from "../form/PosterSelector";
import GenresSelector from "../form/GenresSelector";
import GenresModal from "../modals/GenresModal";
import Selector from "../Selector";
import { languageOptions, statusOptions, typeOptions } from "../../utils/options";
export const results = [
  {
    id: "1",
    avatar:
      "https://images.unsplash.com/photo-1643713303351-01f540054fd7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
    name: "John Doe",
  },
  {
    id: "2",
    avatar:
      "https://images.unsplash.com/photo-1643883135036-98ec2d9e50a1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
    name: "Chandri Anggara",
  },
  {
    id: "3",
    avatar:
      "https://images.unsplash.com/photo-1578342976795-062a1b744f37?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
    name: "Amin RK",
  },
  {
    id: "4",
    avatar:
      "https://images.unsplash.com/photo-1564227901-6b1d20bebe9d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
    name: "Edward Howell",
  },
  {
    id: "5",
    avatar:
      "https://images.unsplash.com/photo-1578342976795-062a1b744f37?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
    name: "Amin RK",
  },
  {
    id: "6",
    avatar:
      "https://images.unsplash.com/photo-1564227901-6b1d20bebe9d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
    name: "Edward Howell",
  },
];

export const renderItem = (result) => {
  return (
    <div key={result.id} className="flex space-x-2 rounded overflow-hidden">
      <img src={result.avatar} alt={result.name} className="w-16 h-16 object-cover" />
      <p className="dark:text-white font-semibold">{result.name}</p>
    </div>
  );
};
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

export default function MovieForm() {
  const [movieInfo, setMovieInfo] = useState({ ...defaultMovieInfo });
  const [showWritersModal, setShowWritersModal] = useState(false);
  const [showCastModal, setShowCastModal] = useState(false);
  const [showGenresModal, setShowGenresModal] = useState(false);
  const [selectedPosterForUI, setSelectedPosterForUI] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
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
    const { writers } = profile;
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

  const { title, storyLine, director, writers, cast, tags, genres, status, type, language } =
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
          <div>
            <Label htmlFor="director">Director</Label>
            <LiveSearch
              name="director"
              value={director.name}
              placeholder="Search Profile"
              results={results}
              renderItem={renderItem}
              onSelect={updateDirector}
            />
          </div>
          <div>
            <div className="flex justify-between">
              <LabelWithBadge badge={writers.length} htmlFor="writers">
                Writers
              </LabelWithBadge>
              <ViewAllBtn visible={writers.length} onClick={displayWritersModal}>
                View All
              </ViewAllBtn>
            </div>
            <LiveSearch
              name="writers"
              placeholder="Search Profile"
              results={results}
              renderItem={renderItem}
              onSelect={updateWriters}
            />
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
            className={commonInputClasses + " border-2 rounded p-1 w-auto"}
          />

          <Submit value="Upload" onClick={handleSubmit} type="submit" />
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

const Label = ({ htmlFor, children, badge }) => {
  return (
    <label htmlFor={htmlFor} className="dark:text-dark-subtle text-light-subtle font-semibold">
      {children}
    </label>
  );
};
const LabelWithBadge = ({ htmlFor, children, badge = 0 }) => {
  const renderBadge = () => {
    if (!badge) return null;
    return (
      <span className="dark:bg-dark-subtle bg-light-subtle text-white absolute top-0 right-0 text-xs translate-x-2 -translate-y-1 w-5 h-5 rounded-full flex justify-center">
        {badge <= 9 ? badge : "9+"}
      </span>
    );
  };
  return (
    <div className="relative">
      <Label htmlFor={htmlFor}>{children}</Label>
      {renderBadge()}
    </div>
  );
};

const ViewAllBtn = ({ visible, children, onClick }) => {
  if (!visible) return null;
  return (
    <button
      type="button"
      onClick={onClick}
      className="dark:text-white text-primary hover:underline transition"
    >
      {children}
    </button>
  );
};
