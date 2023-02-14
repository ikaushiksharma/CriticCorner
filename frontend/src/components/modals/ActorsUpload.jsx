import React from "react";
import ActorForm from "../form/ActorForm";
import ModalContainer from "./ModalContainer";

export default function ActorsUpload({ visible, onClose }) {
  return (
    <ModalContainer visible={visible} onClose={onClose} ignoreContainer>
      <ActorForm title="Create New Actor" btnTitle="Create" />
    </ModalContainer>
  );
}
