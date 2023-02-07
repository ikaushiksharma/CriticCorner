import React from "react";
import { Route, Routes } from "react-router-dom";
import Actors from "../components/admin/Actors";
import Dashboard from "../components/admin/Dashboard";
import Header from "../components/admin/Header";
import Movies from "../components/admin/Movies";
import Navbar from "../components/admin/Navbar";
import NotFound from "../components/NotFound";
function AdminNavigator() {
  return (
    <div className="flex dark:bg-primary bg-white">
      <Navbar />
      <div className="flex-1 p-2 max-w-screen-xl">
        <Header /*onAddActorClick={} onAddMovieClick={ } *//>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/actors" element={<Actors />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default AdminNavigator;
