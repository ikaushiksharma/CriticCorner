import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Actors from "../components/admin/Actors";
import Dashboard from "../components/admin/Dashboard";
import Header from "../components/admin/Header";
import Movies from "../components/admin/Movies";
import MovieUpload from "../components/admin/MovieUpload";
import Navbar from "../components/admin/Navbar";
import SearchMovies from "../components/admin/SearchMovies";
import ActorsUpload from "../components/modals/ActorsUpload";
import NotFound from "../components/NotFound";
import MovieReviews from "../components/user/MovieReviews";
import SingleMovie from "../components/user/SingleMovie";
function AdminNavigator() {
  const [showMovieUploadModal, setShowMovieUploadModal] = useState(false);
  const [showActorsUploadModal, setShowActorsUploadModal] = useState(false);
  const displayMovieUploadModal = () => setShowMovieUploadModal(true);
  const hideMovieUploadModal = () => setShowMovieUploadModal(false);
  const displayActorsUploadModal = () => setShowActorsUploadModal(true);
  const hideActorsUploadModal = () => setShowActorsUploadModal(false);
  return (
    <>
      <div className="flex dark:bg-primary bg-white">
        <Navbar />
        <div className="flex-1 max-w-screen-xl">
          <Header
            onAddActorClick={displayActorsUploadModal}
            onAddMovieClick={displayMovieUploadModal}
          />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/actors" element={<Actors />} />
            <Route path="/search" element={<SearchMovies />} />
            <Route path="/movie/:movieId" element={<SingleMovie />} />
            <Route path="/movie/reviews/:movieId" element={<MovieReviews />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
      <MovieUpload visible={showMovieUploadModal} onClose={hideMovieUploadModal} />
      <ActorsUpload visible={showActorsUploadModal} onClose={hideActorsUploadModal} />
    </>
  );
}

export default AdminNavigator;
