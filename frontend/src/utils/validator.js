export const validateMovie = (movieInfo) => {
  const { title, storyLine, language, releaseDate, status, type, genres, tags, cast } = movieInfo;
  if (!title.trim()) return { error: "Title is missing!" };
  if (!storyLine.trim()) return { error: "Story Line is missing!" };
  if (!language.trim()) return { error: "language is missing!" };
  if (!releaseDate.trim()) return { error: "Release Date is missing!" };
  if (!status.trim()) return { error: "Status is missing!" };
  if (!type.trim()) return { error: "Type is missing!" };
  if (!genres.length) return { error: "Genres are missing" };
  for (let gen of genres) {
    if (!gen.trim()) return { error: "Invalid genres!" };
  }
  if (!tags.length) return { error: "Tags are missing" };
  for (let tag of tags) {
    if (!tag.trim()) return { error: "Invalid Tag!" };
  }
  if (!cast.length) return { error: "Cast and crew are missing" };
  for (let c of cast) {
    if (typeof c !== "object") return { error: "Invalid cast!" };
  }
  return { error: null };
};
