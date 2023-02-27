const { isValidObjectId } = require("mongoose");
const Movie = require("../models/movie");
const Review = require("../models/review");
const { sendError, getAverageRatings } = require("../utils/helper");

exports.addReview = async (req, res) => {
  const { movieId } = req.params;
  const { content, rating } = req.body;
  const { user } = req;
  if (!req.user.isVerified) return sendError(res, "Please Verify Your Email First!");
  if (!isValidObjectId(movieId)) return sendError(res, "Invalid Movie");
  const movie = await Movie.findOne({ _id: movieId, status: "public" });
  if (!movie) return sendError(res, "Movie Not Found", 404);
  const isAlreadyReviewed = await Review.findOne({ owner: user._id, parentMovie: movie._id });
  if (isAlreadyReviewed) return sendError(res, "You have already reviewed this movie!");
  const newReview = new Review({
    owner: user._id,
    parentMovie: movieId,
    content,
    rating,
  });

  movie.reviews.push(newReview._id);
  await movie.save();
  await newReview.save();
  const reviews = await getAverageRatings(movie._id);

  res.json({ message: "Review added successfully", reviews });
};

exports.updateReview = async (req, res) => {
  const { reviewId } = req.params;
  const { content, rating } = req.body;
  const { user } = req;
  if (!isValidObjectId(reviewId)) return sendError(res, "Invalid Review Id");
  const review = await Review.findOne({ owner: user._id, _id: reviewId });
  if (!review) return sendError(res, "Review Not Found", 404);
  review.content = content;
  review.rating = rating;
  await review.save();
  res.json({ message: "Review updated successfully" });
};
exports.removeReview = async (req, res) => {
  const { reviewId } = req.params;
  const { user } = req;
  if (!isValidObjectId(reviewId)) return sendError(res, "Invalid Review Id");
  const review = await Review.findOne({ owner: user._id, _id: reviewId });
  if (!review) return sendError(res, "Review Not Found", 404);
  const movie = await Movie.findById(review.parentMovie).select("reviews");
  movie.reviews = movie.reviews.filter((r) => r.toString() !== reviewId);
  await Review.findByIdAndDelete(reviewId);
  await movie.save();
  res.json({ message: "Review removed successfully" });
};
exports.getReviewsByMovie = async (req, res) => {
  const { movieId } = req.params;
  if (!isValidObjectId(movieId)) return sendError(res, "Invalid Movie Id");
  const movie = await Movie.findById(movieId)
    .populate({
      path: "reviews",
      populate: {
        path: "owner",
        select: "name",
      },
    })
    .select("reviews title");
  if (!movie) return sendError(res, "Movie Not Found", 404);
  const reviews = movie.reviews.map((r) => {
    const { owner, content, rating, _id: reviewId } = r;
    const { name, _id: ownerId } = owner;
    return {
      id: reviewId,
      owner: {
        id: ownerId,
        name,
      },
      content,
      rating,
    };
  });
  res.json({ movie: { title: movie.title, reviews } });
};
