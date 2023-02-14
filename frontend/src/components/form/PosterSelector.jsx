import React from "react";

const commonPosterUI =
  "flex justify-center items-center border border-dashed rounded aspect-video dark:border-dark-subtle border-light-subtle cursor-pointer";

export default function PosterSelector({
  name,
  lable,
  accept,
  selectedPoster,
  onChange,
  className,
}) {
  return (
    <div>
      <input accept={accept} onChange={onChange} id={name} type="file" hidden />
      <label htmlFor={name}>
        {selectedPoster ? (
          <img
            src={selectedPoster}
            alt="poster"
            className={commonPosterUI + " object-cover " + className}
          />
        ) : (
          <PosterUI label={lable} className={className} />
        )}
      </label>
    </div>
  );
}

const PosterUI = ({ className, label }) => {
  return (
    <div className={commonPosterUI + " " + className}>
      <span className="dark:text-dark-subtle text-light-subtle">{label}</span>
    </div>
  );
};
