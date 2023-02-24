import React, { useEffect, useState } from "react";
import { getTopRatedMovies } from "../../api/movie";
import { useNotification } from "../../hooks";
import MovieList from "./MovieList";

export default function TopRatedMovies() {
  const [movies, setMovies] = useState([]);
  const { updateNotification } = useNotification();

  const fetchMovies = async () => {
    const { error, movies } = await getTopRatedMovies();
    if (error) return updateNotification("error", error);
    setMovies([...movies]);
  };
  useEffect(() => {
    fetchMovies();
  }, []);

  return <MovieList title="Viewer's Choice (Movies)" movies={movies} />;
}
