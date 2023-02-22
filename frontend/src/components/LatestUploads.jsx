import React, { useEffect, useState } from "react";
import { deleteMovie, getMovieForUpdate, getMovies } from "../api/movie";
import { useNotification } from "../hooks";
import ConfirmModal from "./modals/ConfirmModal";
import UpdateMovie from "./modals/UpdateMovie";
import MovieListItem from "./MovieListItem";
const pageNo = 0;
const limit = 5;
export default function LatestUploads() {
  const { updateNotification } = useNotification();
  const [movies, setMovies] = useState([]);
  const [busy, setBusy] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const fetchLatestUploads = async () => {
    const { error, movies } = await getMovies(pageNo, limit);
    if (error) return updateNotification("error", error);
    setMovies([...movies]);
  };
  const handleOnDeleteClick = (movie) => {
    setSelectedMovie(movie);
    setShowConfirmModal(true);
  };
  const hideConfirmModal = () => {
    setShowConfirmModal(false);
  };
  const handleOnDeleteConfirm = async () => {
    setBusy(true);
    const { error, message } = await deleteMovie(selectedMovie.id);
    setBusy(false);
    if (error) return updateNotification("error", error);
    updateNotification("success", message);
    fetchLatestUploads();
    hideConfirmModal();
  };
  const handleOnEditClick = async ({ id }) => {
    const { movie, error } = await getMovieForUpdate(id);
    if (error) return updateNotification("error", error);
    setSelectedMovie(movie);
    setShowUpdateModal(true);
  };
  const hideUpdateForm = () => {
    setShowUpdateModal(false);
  };
  const handleOnUpdate = (movie) => {
    const updatedMovies = movies.map((m) => (m.id === movie.id ? movie : m));
    setMovies([...updatedMovies]);
    setShowUpdateModal(false);
  };
  useEffect(() => {
    fetchLatestUploads();
  }, []);

  return (
    <>
      <div className="bg-white shadow dark:shadow dark:bg-secondary p-5 rounded col-span-2">
        <h1 className="font-semibold text-2xl mb-2 text-primary dark:text-white">Recent Uploads</h1>
        <div className="space-y-3">
          {movies.map((movie) => (
            <MovieListItem
              movie={movie}
              key={movie.id}
              onDeleteClick={() => handleOnDeleteClick(movie)}
              onEditClick={() => handleOnEditClick(movie)}
            />
          ))}
        </div>
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
