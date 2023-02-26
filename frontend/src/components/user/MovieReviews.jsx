import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BsTrash, BsPencilSquare } from "react-icons/bs";
import { deleteReview, getReviewByMovie } from "../../api/review";
import { useAuth, useNotification } from "../../hooks";
import Container from "../Container";
import CustomButtonLink from "../CustomButtonLink";
import RatingStar from "../RatingStar";
import ConfirmModal from "../modals/ConfirmModal";

const getNameInitial = (name = "") => {
  return name[0].toUpperCase();
};

export default function MovieReviews() {
  const { movieId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [profileOwnersReview, setProfileOwnersReview] = useState(null);
  const [busy, setBusy] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const { authInfo } = useAuth();
  const profileId = authInfo.profile?.id;
  const { updateNotification } = useNotification();
  const fetchReviews = async () => {
    const { error, reviews } = await getReviewByMovie(movieId);
    if (error) return updateNotification("error", error);
    setReviews([...reviews]);
  };

  const findProfileOwnersReview = () => {
    if (profileOwnersReview) return setProfileOwnersReview(null);
    const matched = reviews.find((review) => review.owner.id === profileId);
    if (!matched) return updateNotification("error", "You don't have any review!");
    setProfileOwnersReview(matched);
  };
  const displayConfirmModal = () => setShowConfirmModal(true);
  const hideConfirmModal = () => setShowConfirmModal(false);

  const handleOnDeleteConfirm = async () => {
    setBusy(true);
    const { error, message } = await deleteReview(profileOwnersReview.id);
    setBusy(false);
    if (error) return updateNotification("error", error);
    updateNotification("success", message);
    const updatedReviews = reviews.filter((r) => r.id !== profileOwnersReview.id);
    setReviews([...updatedReviews]);
    setProfileOwnersReview(null);
    hideConfirmModal();
  };
  useEffect(() => {
    if (movieId) fetchReviews();
  }, [movieId]);

  if (!reviews) return null;

  return (
    <div className="dark:bg-primary bg-white min-h-screen pb-10">
      <Container className="xl:px-0 px-2">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold dark:text-white text-secondary">
            <span className="text-light-subtle dark:text-dark-subtle font-normal">
              Reviews for:
            </span>{" "}
            This is the title
          </h1>
          {profileId ? (
            <CustomButtonLink
              label={profileOwnersReview ? "View All" : "Find My Reviews"}
              onClick={findProfileOwnersReview}
            />
          ) : null}
        </div>
        {profileOwnersReview ? (
          <ReviewCard review={profileOwnersReview} />
        ) : (
          <div className="space-y-3 mt-3">
            {reviews.map((r) => (
              <div>
                <ReviewCard review={r} key={r.id} />
                <div className="flex space-x-3 dark:text-white text-primary text-xl p-3 ">
                  <button onClick={displayConfirmModal} type="button">
                    <BsTrash />
                  </button>
                  <button type="button">
                    <BsPencilSquare />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
      <ConfirmModal
        visible={showConfirmModal}
        onCancel={hideConfirmModal}
        onConfirm={handleOnDeleteConfirm}
        title="Are you sure?"
        subtitle="This will remove this review permanently."
        busy={busy}
      />
    </div>
  );
}

const ReviewCard = ({ review }) => {
  const { owner, content, rating } = review;
  return (
    <div className="flex space-x-3">
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-light-subtle dark:bg-dark-subtle text-white text-xl select-none">
        {getNameInitial(owner.name)}
      </div>
      <div>
        <h1 className="dark:text-white text-secondary font-semibold text-lg">{owner.name}</h1>
        <RatingStar rating={rating} />
        <p className="text-light-subtle dark:text-dark-subtle">{content}</p>
      </div>
    </div>
  );
};
