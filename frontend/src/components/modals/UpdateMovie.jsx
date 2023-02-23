import React, { useEffect, useState } from "react";
import { getMovieForUpdate, updateMovie } from "../../api/movie";
import { useNotification } from "../../hooks";
import MovieForm from "../admin/MovieForm";
import ModalContainer from "./ModalContainer";

export default function UpdateMovie({ visible, onSuccess, movieId }) {
  const { updateNotification } = useNotification();
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const handleSubmit = async (data) => {
    setBusy(true);
    const { movie, error, message } = await updateMovie(movieId, data);
    setBusy(false);
    if (error) return updateNotification("error", error);

    updateNotification("success", message);
    onSuccess(movie);
    // onClose();
  };
  const fetchMovieToUpdate = async () => {
    const { movie, error } = await getMovieForUpdate(movieId);
    if (error) return updateNotification("error", error);
    setSelectedMovie(movie);
    setReady(true);
  };

  useEffect(() => {
    if (movieId) fetchMovieToUpdate();
  }, [movieId]);

  return (
    <ModalContainer visible={visible}>
      {ready ? (
        <MovieForm
          btnTitle="Update"
          busy={busy}
          initialState={selectedMovie}
          onSubmit={!busy ? handleSubmit : null}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-light-subtle dark:text-dark-subtle animate-pulse text-xl">
            Please Wait...
          </p>
        </div>
      )}
    </ModalContainer>
  );
}
