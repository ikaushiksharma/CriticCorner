const crypto = require("crypto");
const cloudinary = require("../cloud");
const Review = require("../models/review");
exports.sendError = (res, error, statusCode = 401) => {
  res.status(statusCode).json({ error });
};
exports.generateRandomByte = () => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(30, (err, buff) => {
      if (err) reject(err);
      const buffString = buff.toString("hex");

      console.log(buffString);
      resolve(buffString);
    });
  });
};
exports.handleNotFound = (req, res) => {
  this.sendError(res, "Not found", 404);
};
exports.uploadImageToCloud = async (file) => {
  const { secure_url: url, public_id } = await cloudinary.uploader.upload(file, {
    gravity: "face",
    height: 500,
    width: 500,
    crop: "thumb",
  });
  return { url, public_id };
};
exports.formatActor = (actor) => {
  const { _id, name, about, gender, avatar } = actor;
  return { id: _id, name, about, gender, avatar: avatar?.url };
};
exports.averageRatingPipeline = (movieId) => {
  return [
    {
      $lookup: {
        from: "Review",
        localField: "rating",
        foreignField: "_id",
        as: "avgRat",
      },
    },
    {
      $match: { parentMovie: movieId },
    },
    {
      $group: {
        _id: null,
        ratingAvg: { $avg: "$rating" },
      },
      reviewCount: {
        $sum: 1,
      },
    },
  ];
};
exports.topRatedMoviesPipeline = (type) => {
  const matchOptions = {
    reviews: {
      $exists: true,
    },
    status: { $eq: "public" },
  };

  if (type) matchOptions.type = { $eq: type };

  return [
    {
      $lookup: {
        from: "Movie",
        localField: "reviews",
        foreignField: "_id",
        as: "topRated",
      },
    },
    {
      $match: matchOptions,
    },
    {
      $project: {
        title: 1,
        poster: "$poster.url",
        responsivePosters: "$poster.responsive",
        reviewCount: { $size: "$reviews" },
      },
    },
    {
      $sort: {
        reviewCount: -1,
      },
    },
    {
      $limit: 5,
    },
  ];
};
exports.getAverageRatings = async (movieId) => {
  const [aggregatedResponse] = await Review.aggregate(this.averageRatingPipeline(movieId));
  const reviews = {};
  if (aggregatedResponse) {
    const { ratingAvg, reviewCount } = aggregatedResponse;
    reviews.ratingAvg = parseFloat(ratingAvg).toFixed(1);
    reviews.reviewCount = reviewCount;
  }
  return reviews;
};
exports.relatedMovieAggregation = (tags, movieId) => {
  return [
    {
      $lookup: {
        from: "Movie",
        localField: "tags",
        foreignField: "_id",
        as: "relatedMovies",
      },
    },
    {
      $match: {
        tags: { $in: [...tags] },
        _id: { $ne: movieId },
      },
    },
    {
      $project: {
        title: 1,
        poster: "$poster.url",
        responsivePosters: "$poster.responsive",
      },
    },
    {
      $limit: 5,
    },
  ];
};
