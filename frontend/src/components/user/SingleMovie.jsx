import { Container } from "postcss";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getSingleMovie } from "../../api/movie";
import { useAuth, useNotification } from "../../hooks";
import AddRatingModal from "../modals/AddRatingModal";
import RatingStar from "../RatingStar";
import RelatedMovies from "../RelatedMovies";

const convertReviewCount = (count = 0) => {
  if (count <= 999) return count;
  return parseFloat(count / 1000).toFixed(1) + "K";
};
const convertDate = (date = "") => date.split("T")[0];
export default function SingleMovie() {
  const [ready, setReady] = useState({});
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [movie, setMovie] = useState(false);
  const { updateNotification } = useNotification();
  const { authInfo } = useAuth();
  const navigate = useNavigate();
  const { isLoggedIn } = authInfo;

  const { movieId } = useParams;
  const fetchMovie = async () => {
    const { error, movie } = await getSingleMovie(movieId);
    if (error) return updateNotification("error", error);
    setReady(true);
    setMovie(movie);
  };

  const handleOnRateMovie = () => {
    if (!isLoggedIn) return navigate("/auth/signin");
    setShowRatingModal(true);
  };
  const hideRatingModal = () => {
    setShowRatingModal(false);
  };

  const handleOnRatingSuccess = (reviews) => {
    setMovie({ ...movie, reviews: { ...reviews } });
  };
  useEffect(() => {
    if (movieId) fetchMovie();
  }, [movieId]);

  if (!ready)
    return (
      <div className="h-screen flex justify-center items-center dark:bg-primary bg-white">
        <p className="text-light-subtle dark:text-dark-subtle animate-pulse">Please Wait...</p>
      </div>
    );

  const {
    id,
    trailer,
    poster,
    title,
    storyLine,
    genres = [],
    releaseDate,
    cast = [],
    director,
    type,
    writers = [],
    language,
    reviews = {},
  } = movie;

  return (
    <div className="dark:bg-primary bg-white min-h-screen pb-10">
      <Container>
        <video poster={poster} src={trailer}></video>
        <div className="flex justify-between">
          <h1 className="text-4xl text-highlight dark:text-highlight-dark font-semibold py-3">
            {title}
          </h1>
          <div className="flex flex-col items-end">
            <RatingStar rating={reviews.ratingAvg} />
            <Link
              className="text-highlight dark:text-highlight-dark hover:underline"
              to={"/movie/reviews/" + id}
            >
              {convertReviewCount(reviews.reviewCount)} Reviews
            </Link>
            <button
              type="button"
              onClick={handleOnRateMovie}
              className="text-highlight dark:text-highlight-dark hover:underline"
            >
              Rate The Movie
            </button>
          </div>
        </div>
        <div className="space-y-3">
          <p className="text-light-subtle dark:text-dark-subtle">{storyLine}</p>
          <div className="flex space-x-2">
            <p className="text-light-subtle dark:text-dark-subtle font-semibold">Director:</p>
            <p className="text-highlight dark:text-highlight-dark hover:underline cursor-pointer">
              {director.name}
            </p>
          </div>
          <div className="flex">
            <p className="text-light-subtle dark:text-dark-subtle font-semibold mr-2">Writers:</p>
            <div className="flex space-x-2">
              {writers.map((writer) => (
                <p
                  key={writer.id}
                  className="text-highlight dark:text-highlight-dark hover:underline cursor-pointer"
                >
                  {writer.name}
                </p>
              ))}
            </div>
          </div>
          <div className="flex">
            <p className="text-light-subtle dark:text-dark-subtle font-semibold mr-2">Cast:</p>
            <div className="flex space-x-2">
              {cast.map((c) => {
                return c.leadActor ? (
                  <p
                    key={c.profile.id}
                    className="text-highlight dark:text-highlight-dark hover:underline cursor-pointer"
                  >
                    {c.profile.name}
                  </p>
                ) : null;
              })}
            </div>
          </div>
          <div className="flex space-x-2">
            <p className="text-light-subtle dark:text-dark-subtle font-semibold">Language:</p>
            <p className="text-highlight dark:text-highlight-dark">{language}</p>
          </div>
          <div className="flex space-x-2">
            <p className="text-light-subtle dark:text-dark-subtle font-semibold">Release Date:</p>
            <p className="text-highlight dark:text-highlight-dark">{convertDate(releaseDate)}</p>
          </div>
          <div className="flex">
            <p className="text-light-subtle dark:text-dark-subtle font-semibold mr-2">Genres:</p>
            <div className="flex space-x-2">
              {genres.map((g) => {
                return (
                  <p key={g} className="text-highlight dark:text-highlight-dark">
                    {g}
                  </p>
                );
              })}
            </div>
          </div>
          <div className="flex space-x-2">
            <p className="text-light-subtle dark:text-dark-subtle font-semibold">Type:</p>
            <p className="text-highlight dark:text-highlight-dark">{type}</p>
          </div>
        </div>

        <div className="mt-5">
          <h1 className="text-light-subtle dark:text-dark-subtle font-semibold text-2xl mb-2">
            Cast:
          </h1>
          <div className="grid grid-cols-10">
            {cast.map((c) => {
              return (
                <div key={c.profile.id} className="flex flex-col items-center">
                  <img
                    className="w-24 h-24 aspect-square object-cover rounded-full"
                    src={c.profile.avatar}
                    alt={c.profile.name}
                  />
                  <p className="text-highlight dark:text-highlight-dark hover:underline cursor-pointer">
                    {c.profile.name}
                  </p>
                  <span className="text-light-subtle dark:text-dark-subtle text-sm">as</span>
                  <p className="text-light-subtle dark:text-dark-subtle">{c.roleAs}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-3">
          <RelatedMovies movieId={movieId} />
        </div>
      </Container>
      <AddRatingModal
        visible={showRatingModal}
        onClose={hideRatingModal}
        onSuccess={handleOnRatingSuccess}
      />
    </div>
  );
}
