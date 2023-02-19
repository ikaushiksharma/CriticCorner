const cloudinary = require("../cloud");
const { sendError } = require("../utils/helper");
const Movie = require("../models/movie");
const { isValidObjectId } = require("mongoose");

exports.uploadTrailer = async (req, res) => {
  const { file } = req;
  if (!file) return sendError(res, "Video file is missing!");

  const { secure_url: url, public_id } = await cloudinary.uploader.upload(file.path, {
    resource_type: "video",
  });
  res.status(201).json({ url, public_id });
};

exports.createMovie = async (req, res) => {
  const { file, body } = req;
  const {
    title,
    storyLine,
    director,
    releaseDate,
    status,
    type,
    genres,
    tags,
    cast,
    writers,
    trailer,
    language,
  } = body;
  const newMovie = new Movie({
    title,
    storyLine,
    releaseDate,
    status,
    type,
    genres,
    tags,
    cast,
    trailer,
    language,
  });
  if (director) {
    if (!isValidObjectId(director)) return sendError(res, "Invalid director id!");
    newMovie.director = director;
  }
  if (writers) {
    for (let writer of writers)
      if (!isValidObjectId(writer)) return sendError(res, "Invalid writer id!");
    newMovie.writers = writers;
  }

  // uploading poster
  if (file) {
    const {
      secure_url: url,
      public_id,
      responsive_breakpoints,
    } = await cloudinary.uploader.upload(file.path, {
      transformation: {
        width: 1280,
        height: 720,
      },
      responsive_breakpoints: {
        create_derived: true,
        max_width: 640,
        max_images: 3,
      },
    });
    const finalPoster = { url, public_id, responsive: [] };
    const { breakpoints } = responsive_breakpoints[0];
    if (breakpoints.length) {
      for (let imgObj of breakpoints) {
        const { secure_url } = imgObj;
        finalPoster.responsive.push(secure_url);
      }
    }
    newMovie.poster = finalPoster;
  }
  await newMovie.save();
  res.status(201).json({
    id: newMovie._id,
    title,
    storyLine,
    director,
    releaseDate,
    status,
    type,
    genres,
    tags,
    cast,
    writers,
    trailer,
    language,
  });
};

exports.updateMovieWithoutPoster = async (req, res) => {
  const { movieId } = req.params;
  if (!isValidObjectId(movieId)) return sendError(res, "Invalid movie id");
  const movie = await Movie.findById(movieId);
  if (!movie) return sendError(res, "Movie not found", 404);
  const {
    title,
    storyLine,
    director,
    releaseDate,
    status,
    type,
    genres,
    tags,
    cast,
    writers,
    trailer,
    language,
  } = req.body;
  movie.title = title;
  movie.storyLine = storyLine;
  movie.releaseDate = releaseDate;
  movie.status = status;
  movie.type = type;
  movie.genres = genres;
  movie.tags = tags;
  movie.cast = cast;
  movie.trailer = trailer;
  movie.language = language;

  if (director) {
    if (!isValidObjectId(director)) return sendError(res, "Invalid director id!");
    movie.director = director;
  }
  if (writers) {
    for (let writer of writers)
      if (!isValidObjectId(writer)) return sendError(res, "Invalid writer id!");
    movie.writers = writers;
  }
  await movie.save();
  res.json({ message: "Movie Updated Successfully", movie });
};

exports.updateMovieWithPoster = async (req, res) => {
  const { movieId } = req.params;
  if (!isValidObjectId(movieId)) return sendError(res, "Invalid movie id");
  if (!req.file) return sendError(res, "Movie Poster is missing!");
  const movie = await Movie.findById(movieId);
  if (!movie) return sendError(res, "Movie not found", 404);

  const {
    title,
    storyLine,
    director,
    releaseDate,
    status,
    type,
    genres,
    tags,
    cast,
    writers,
    trailer,
    language,
  } = req.body;
  movie.title = title;
  movie.storyLine = storyLine;
  movie.releaseDate = releaseDate;
  movie.status = status;
  movie.type = type;
  movie.genres = genres;
  movie.tags = tags;
  movie.cast = cast;
  movie.trailer = trailer;
  movie.language = language;

  if (director) {
    if (!isValidObjectId(director)) return sendError(res, "Invalid director id!");
    movie.director = director;
  }
  if (writers) {
    for (let writer of writers)
      if (!isValidObjectId(writer)) return sendError(res, "Invalid writer id!");
    movie.writers = writers;
  }
  const posterID = movie.poster?.public_id;
  if (posterID) {
    const { result } = await cloudinary.uploader.destroy(posterID);
    if (result !== "ok") return sendError(res, "Could not update poster at the moment!");
  }
  const {
    secure_url: url,
    public_id,
    responsive_breakpoints,
  } = await cloudinary.uploader.upload(req.file.path, {
    transformation: {
      width: 1280,
      height: 720,
    },
    responsive_breakpoints: {
      create_derived: true,
      max_width: 640,
      max_images: 3,
    },
  });
  const finalPoster = { url, public_id, responsive: [] };
  const { breakpoints } = responsive_breakpoints[0];
  if (breakpoints.length) {
    for (let imgObj of breakpoints) {
      const { secure_url } = imgObj;
      finalPoster.responsive.push(secure_url);
    }
  }
  movie.poster = finalPoster;
  await movie.save();
  res.json({ message: "Movie Updated Successfully", movie });
};

exports.removeMovie = async (req, res) => {
  const { movieId } = req.params;
  if (!isValidObjectId(movieId)) return sendError(res, "Invalid Movie Id");
  const movie = await Movie.findById(movieId);
  if (!movie) return sendError(res, "Movie not found", 404);

  const posterID = movie.poster?.public_id;
  if (posterID) {
    const { result } = await cloudinary.uploader.destroy(posterID);
    if (result !== "ok") return sendError(res, "Could not delete poster at the moment!");
  }
  const trailerId = movie.trailer?.public_id;
  if (trailerId) {
    const { result } = await cloudinary.uploader.destroy(trailerId, { resource_type: "video" });
    if (result !== "ok") return sendError(res, "Could not delete trailer at the moment!");
  }
  await Movie.findByIdAndDelete(movieId);
  res.json({ message: "Movie deleted Successfully" });
};
