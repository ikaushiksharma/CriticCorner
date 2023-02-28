import React, { useState } from "react";
import { BsTrash, BsBoxArrowUpRight, BsPencilSquare } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { deleteMovie } from "../api/movie";
import { useNotification } from "../hooks";
import { getPoster } from "../utils/helper";
import ConfirmModal from "./modals/ConfirmModal";
import UpdateMovie from "./modals/UpdateMovie";

export default function MovieListItem({ movie, afterDelete, afterUpdate }) {
  const { updateNotification } = useNotification();
  const [busy, setBusy] = useState(false);

  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const handleOnDeleteConfirm = async () => {
    setBusy(true);
    const { error, message } = await deleteMovie(movie.id);
    setBusy(false);
    if (error) return updateNotification("error", error);
    hideConfirmModal();
    updateNotification("success", message);
    afterDelete(movie);
  };

  const handleOnEditClick = () => {
    setShowUpdateModal(true);
    setSelectedMovieId(movie.id);
  };
  const handleOnUpdate = (movie) => {
    afterUpdate(movie);
    setShowUpdateModal(false);
    setSelectedMovieId(null);
  };
  // const handleOnOpenClick = () => {
  // };

  const displayConfirmModal = () => setShowConfirmModal(true);
  const hideConfirmModal = () => setShowConfirmModal(false);
  return (
    <>
      <MovieCard
        movie={movie}
        onDeleteClick={displayConfirmModal}
        onEditClick={handleOnEditClick}
        // onOpenClick={handleOnOpenClick}
      />
      <div className="p-0">
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
          movieId={selectedMovieId}
          onSuccess={handleOnUpdate}
        />
      </div>
    </>
  );
}
function MovieCard({ movie, onDeleteClick, onEditClick }) {
  const { id, poster, title, responsivePosters, status, genres = [] } = movie;
  return (
    <table className="w-full border-b">
      <tbody>
        <tr>
          <td>
            <div className="w-24">
              <img
                className="w-full aspect-video"
                src={getPoster(responsivePosters) || poster}
                alt=""
              />
            </div>
          </td>
          <td className="w-full pl-5">
            <div>
              <h1 className="text-lg font-semibold text-primary dark:text-white">{title}</h1>
              <div className="space-x-2">
                {genres.map((genre, index) => (
                  <span key={genre + index} className="text-primary dark:text-white text-xs">
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </td>
          <td className="px-5">
            <p className="text-primary dark:text-white">{status}</p>
          </td>
          <td>
            <div className="flex items-center space-x-3 text-primary dark:text-white text-lg">
              <button onClick={onDeleteClick} type="button">
                <BsTrash />
              </button>
              <button onClick={onEditClick} type="button">
                <BsPencilSquare />
              </button>
              <Link to={"/movie/" + id}>
                <BsBoxArrowUpRight />
              </Link>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
