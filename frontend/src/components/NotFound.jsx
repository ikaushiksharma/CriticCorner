import React from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="lg:px-24 dark:bg-primary w-full min-h-screen lg:py-24 md:py-20 md:px-44 px-4 py-24 items-center flex justify-center flex-col-reverse lg:flex-row md:gap-28 gap-16">
      <div className="xl:pt-24 w-full xl:w-1/2 relative pb-12 lg:pb-0">
        <div className="relative">
          <div className="absolute">
            <div className="text-primary dark:text-white">
              <h1 className="my-2 font-bold text-2xl">
                Looks like you've found the doorway to the great nothing
              </h1>
              <p className="my-2">
                Sorry about that! Please visit our hompage to get where you need to go.
              </p>
              <button
                onClick={() => {
                  navigate("/");
                }}
                className="sm:w-full lg:w-auto my-2 border rounded md py-4 px-8 text-center bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-opacity-50"
              >
                Take me there!
              </button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <img src="https://i.ibb.co/ck1SGFJ/Group.png" />
      </div>
    </div>
  );
}
