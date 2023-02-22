import React, { useState } from "react";
import { updateMovie } from "../../api/movie";
import { useNotification } from "../../hooks";
import MovieForm from "../admin/MovieForm";
import ModalContainer from "./ModalContainer";

export default function UpdateMovie({ visible, onSuccess, onClose, initialState }) {
  const { updateNotification } = useNotification();
  const [busy, setBusy] = useState(false);
  const handleSubmit = async (data) => {
    setBusy(true);
    const { movie, error, message } = await updateMovie(initialState.id, data);
    setBusy(false);
    if (error) return updateNotification("error", error);

    updateNotification("success", message);
    onSuccess(movie);
    onClose();
  };
  return (
    <ModalContainer visible={visible}>
      <MovieForm
        btnTitle="Update"
        busy={busy}
        initialState={initialState}
        onSubmit={!busy ? handleSubmit : null}
      />
    </ModalContainer>
  );
}
