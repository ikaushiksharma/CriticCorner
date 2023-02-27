const Movie = require("../models/movie");
const Review = require("../models/review");
const User = require("../models/user");
const { topRatedMoviesPipeline, getAverageRatings } = require("../utils/helper");

exports.getAppInfo = async (req, res) => {
  const movieCount = await Movie.countDocuments();
  const reviewCount = await Review.countDocuments();
  const userCount = await User.countDocuments();
  res.json({ appInfo: { movieCount, reviewCount, userCount } });
};

exports.getMostRated = async (req, res) => {
  const movies = await Movie.aggregate(topRatedMoviesPipeline());
  const mapMovies = async (m) => {
    const reviews = await getAverageRatings(m._id);
    return {
      id: m._id,
      title: m.title,
      reviews: { ...reviews },
    };
  };
  const topRatedMovies = await Promise.all(movies.map(mapMovies));
  res.json({ movies: topRatedMovies });
};
