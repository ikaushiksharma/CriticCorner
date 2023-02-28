import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchPublicMovies } from "../../api/movie";
import { useNotification } from "../../hooks";
import Container from "../Container";
// import MovieListItem from "../MovieListItem";
import NotFoundText from "../NotFoundText";
import MovieList from "./MovieList";

export default function SearchMovies() {
  const [searchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [resultNotFound, setResultNotFound] = useState(true);
  const { updateNotification } = useNotification();
  const query = searchParams.get("title");

  const searchMovies = async (val) => {
    const { results, error } = await searchPublicMovies(val);
    if (error) return updateNotification("error", error);
    if (!results.length) {
      setResultNotFound(true);
      return setMovies([]);
    }
    setResultNotFound(false);
    setMovies([...results]);
  };

  useEffect(() => {
    if (query.trim()) searchMovies(query);
  }, [query]);

  return resultNotFound ? (
    <NotFoundText text="Record not Found!" visible={resultNotFound} />
  ) : (
    <div className="dark:bg-primary bg-white min-h-screen py-8">
      <Container className="px-2 xl:p-0">
        <MovieList movies={movies} />
      </Container>
    </div>
  );
}
