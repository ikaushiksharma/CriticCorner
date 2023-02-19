import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { uploadTrailer } from "../../api/movie";
import { useNotification } from "../../hooks";
import ModalContainer from "../modals/ModalContainer";
import MovieForm from "./MovieForm";
const MovieUpload = ({ visible, onClose }) => {
  const [videoSelected, setVideoSelected] = useState(false);
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoInfo, setVideoInfo] = useState({});
  const { updateNotification } = useNotification();

  const handleTypeError = (error) => {
    updateNotification("error", error);
  };

  const handleUploadTrailer = async (data) => {
    const { error, url, public_id } = await uploadTrailer(data, setUploadProgress);
    if (error) updateNotification("error", error);
    setVideoUploaded(true);
    setVideoInfo({ url, public_id });
  };
  const handleChange = (file) => {
    const formData = new FormData();
    formData.append("video", file);
    setVideoSelected(true);
    handleUploadTrailer(formData);
  };
  const getUploadProgressValue = () => {
    if (!videoUploaded && uploadProgress >= 100) {
      return "Processing";
    }
    return `Upload Progress ${uploadProgress}`;
  };
  return (
    <ModalContainer visible={visible} >
      <UploadProgress
          visible={!videoUploaded && videoSelected}
          message={getUploadProgressValue()}
          width={uploadProgress}
        />
        <TrailerSelector
          visible={!videoSelected}
          onTypeError={handleTypeError}
          handleChange={handleChange}
        />
      <MovieForm />
    </ModalContainer>
  );
};

const TrailerSelector = ({ visible, handleChange, onTypeError }) => {
  if (!visible) return null;
  return (
    <div className="h-full flex items-center justify-center">
      <FileUploader handleChange={handleChange} onTypeError={onTypeError} types={["mp4", "avi"]}>
        <div className="w-48 h-48 border border-dashed dark:border-dark-subtle border-light-subtle rounded-full cursor-pointer text-secondary dark:text-dark-subtle flex flex-col justify-center items-center">
          <AiOutlineCloudUpload size={80} />
          <p>Drop your file here!</p>
        </div>
      </FileUploader>
    </div>
  );
};

const UploadProgress = ({ width, message, visible }) => {
  if (!visible) return null;
  return (
    <div className="dark:bg-secondary bg-white drop-shadow-lg rounded p-3">
      <div className="relative h-3 dark:bg-dark-subtle bg-light-subtle overflow-hidden">
        <div
          style={{ width: width + "%" }}
          className="h-full w-14 absolute bg-secondary left-0 dark:bg-white"
        ></div>
        <p className="font-semibold dark:text-dark-subtle text-light-subtle animate-pulse mt-1">
          {message}
        </p>
      </div>
    </div>
  );
};

export default MovieUpload;
