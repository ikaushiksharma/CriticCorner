import React, { useState } from "react";
import { updateReview } from "../../api/review";
import { useNotification } from "../../hooks";
import RatingForm from "../form/RatingForm";
import ModalContainer from "./ModalContainer";

export default function EditRatingModal({ visible, onSuccess, initialState, onClose }) {
  const { updateNotification } = useNotification();
  const [busy, setBusy] = useState(false);
  const handleSubmit = async (data) => {
    setBusy(true);
    const { error, message } = await updateReview(initialState.id, data);
    setBusy(false);
    if (error) return updateNotification("error", error);
    onSuccess({ ...data });
    updateNotification("success", message);
    onClose();
  };
  return (
    <ModalContainer onClose={onClose} visible={visible} ignoreContainer>
      <RatingForm busy={busy} initialState={initialState} onSubmit={handleSubmit} />
    </ModalContainer>
  );
}
