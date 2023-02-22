import React, { useEffect, useState } from "react";
import { deleteMovie, getMovieForUpdate, getMovies } from "../../api/movie";
import { useNotification } from "../../hooks";
import ConfirmModal from "../modals/ConfirmModal";
import UpdateMovie from "../modals/UpdateMovie";
import MovieListItem from "../MovieListItem";
import NextAndPrevButton from "../NextAndPrevButton";
const limit = 10;
let currentPageNo = 0;
export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [busy, setBusy] = useState(false);
  const [reachedToEnd, setReachedToEnd] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const { updateNotification } = useNotification();

  const fetchMovies = async (pageNo) => {
    const { error, movies } = await getMovies(pageNo, limit);
    if (error) return updateNotification("error", error);
    if (!movies.length) {
      currentPageNo = pageNo - 1;
      return setReachedToEnd(true);
    }
    setMovies([...movies]);
  };
  const handleOnNextClick = () => {
    if (reachedToEnd) return updateNotification("error", "You are on the last page");
    currentPageNo++;
    fetchMovies(currentPageNo);
  };
  const handleOnPrevClick = () => {
    if (currentPageNo === 0) return updateNotification("error", "You are on the first page");
    if (reachedToEnd) setReachedToEnd(false);
    currentPageNo--;
    fetchMovies(currentPageNo);
  };
  const handleOnEditClick = async ({ id }) => {
    const { movie, error } = await getMovieForUpdate(id);
    if (error) return updateNotification("error", error);
    setSelectedMovie(movie);
    setShowUpdateModal(true);
  };
  const handleOnDeleteClick = (movie) => {
    setSelectedMovie(movie);
    setShowConfirmModal(true);
  };
  const handleOnDeleteConfirm = async () => {
    setBusy(true);
    const { error, message } = await deleteMovie(selectedMovie.id);
    setBusy(false);
    if (error) return updateNotification("error", error);
    updateNotification("success", message);
    hideConfirmModal();
    fetchMovies(currentPageNo);
  };
  const hideUpdateForm = () => {
    setShowUpdateModal(false);
  };
  const hideConfirmModal = () => {
    setShowConfirmModal(false);
  };
  const handleOnUpdate = (movie) => {
    const updatedMovies = movies.map((m) => (m.id === movie.id ? movie : m));
    setMovies([...updatedMovies]);
    setShowUpdateModal(false);
  };
  useEffect(() => {
    fetchMovies(currentPageNo);
  }, []);

  return (
    <>
      <div className="space-y-5 p-5">
        {movies.map((movie, index) => (
          <MovieListItem
            key={movie.id}
            movie={movie}
            onEditClick={() => handleOnEditClick(movie)}
            onDeleteClick={() => handleOnDeleteClick(movie)}
          />
        ))}
        <NextAndPrevButton onPrevClick={handleOnPrevClick} onNextClick={handleOnNextClick} />
      </div>
      <ConfirmModal
        visible={showConfirmModal}
        onConfirm={handleOnDeleteConfirm}
        onCancel={hideConfirmModal}
        busy={busy}
        title="Are you sure?"
        subtitle="This action will remove this movie permanently!"
      />
      <UpdateMovie
        visible={showUpdateModal}
        initialState={selectedMovie}
        onSuccess={handleOnUpdate}
        onClose={hideUpdateForm}
      />
    </>
  );
}
