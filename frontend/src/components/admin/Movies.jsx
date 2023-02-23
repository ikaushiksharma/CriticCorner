import React, { useEffect } from "react";
import { useMovies } from "../../hooks";

import MovieListItem from "../MovieListItem";
import NextAndPrevButton from "../NextAndPrevButton";

export default function Movies() {
  const { fetchMovies, movies: newMovies, fetchNextPage, fetchPrevPage } = useMovies();
  const handleUIUpdate = () => fetchMovies();
  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <>
      <div className="space-y-5 p-5">
        {newMovies.map((movie) => (
          <MovieListItem
            key={movie.id}
            movie={movie}
            afterDelete={handleUIUpdate}
            afterUpdate={handleUIUpdate}
          />
        ))}
        <NextAndPrevButton onPrevClick={fetchPrevPage} onNextClick={fetchNextPage} />
      </div>
    </>
  );
}
