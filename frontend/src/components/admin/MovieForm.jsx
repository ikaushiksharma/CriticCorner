import React, { useState } from "react";
import { commonInputClasses } from "../../utils/theme";
import Submit from "../form/Submit";
import TagsInput from "../TagsInput";
import LiveSearch from "./LiveSearch";
import useNotification from "../../hooks";
import WritersModal from "../modals/WritersModal";
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
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  const { updateNotification } = useNotification();

  const renderItem = (result) => {
    return (
      <div key={result.id} className="flex space-x-2 rounded overflow-hidden">
        <img src={result.avatar} alt={result.name} className="w-16 h-16 object-cover" />
        <p className="dark:text-white font-semibold">{result.name}</p>
      </div>
    );
  };

  const handleChange = ({ target }) => {
    const { value, name } = target;
    setMovieInfo({ ...movieInfo, [name]: value });
  };
  const updateTags = (tags) => {
    setMovieInfo({ ...movieInfo, tags });
  };
  const updateDirector = (profile) => {
    setMovieInfo({ ...movieInfo, director: profile });
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
  const handleWriterRemove = (profileId) => {
    const { writers } = movieInfo;
    const newWriters = writers.filter((writer) => writer.id !== profileId);
    if (!newWriters.length) hideWritersModal();
    setMovieInfo({ ...movieInfo, writers: [...newWriters] });
  };

  const { title, storyLine, director, writers } = movieInfo;
  return (
    <>
      <form onSubmit={handleSubmit} className="flex space-x-3">
        <div className="w-[70%] h-5 space-y-5">
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
            <TagsInput name="tags" onChange={updateTags} />
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
              <button
                onClick={displayWritersModal}
                className="dark:text-white text-primary hover:underline transition"
              >
                View All
              </button>
            </div>
            <LiveSearch
              name="writers"
              placeholder="Search Profile"
              results={results}
              renderItem={renderItem}
              onSelect={updateWriters}
            />
          </div>
          <Submit value="Upload" />
        </div>
        <div className="w-[30%] h-5"></div>
      </form>
      <WritersModal
        onClose={hideWritersModal}
        profiles={writers}
        visible={showWritersModal}
        onRemoveClick={handleWriterRemove}
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
const LabelWithBadge = ({ htmlFor, children, badge }) => {
  const renderBadge = () => {
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
