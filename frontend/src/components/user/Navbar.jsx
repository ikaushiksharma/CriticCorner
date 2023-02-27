import React from "react";
import { BsFillSunFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, useTheme } from "../../hooks";
import Container from "../Container";
import AppSearchForm from "../form/AppSearchForm";

export default function Navbar() {
  const { toggleTheme } = useTheme();
  const { authInfo, handleLogout } = useAuth();
  const { isLoggedIn } = authInfo;

  const navigate = useNavigate();

  const handleSearchSubmit = (query) => {
    navigate("/movie/search?title=" + query);
  };

  return (
    <div className="bg-secondary shadow-sm shadow-gray-500">
      <Container className="p-2">
        <div className="flex justify-between items-center">
          <Link to="/">
            <img src="./logo.png" alt="" className="sm:h-10 h-8" />
          </Link>

          <ul className="flex items-center sm:space-x-4 space-x-2">
            <li>
              <button
                onClick={toggleTheme}
                className="dark:bg-white bg-dark-subtle p-1 rounded sm:text-2xl text-lg"
              >
                <BsFillSunFill className="text-secondary" />
              </button>
            </li>
            <li>
              <AppSearchForm
                placeholder="Search"
                inputClassName="border-dark-subtle text-white focus:border-white sm:w-auto w-40 sm:text-lg "
                onSubmit={handleSearchSubmit}
              />
            </li>
            <li>
              {isLoggedIn ? (
                <button onClick={handleLogout} className="text-white font-semibold text-lg">
                  Log out
                </button>
              ) : (
                <Link className="text-white font-semibold text-lg" to="/auth/signin">
                  Login
                </Link>
              )}
            </li>
          </ul>
        </div>
      </Container>
    </div>
  );
}
