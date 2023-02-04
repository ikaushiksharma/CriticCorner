exports.parseData = (req, res, next) => {
  const { trailer, cast, genres, tags, writers } = req.body;
  if (genres) req.body.genres = JSON.parse(genres);
  if (cast) req.body.cast = JSON.parse(cast);
  if (tags) req.body.tags = JSON.parse(tags);
  if (writers) req.body.writers = JSON.parse(writers);
  next();
};
