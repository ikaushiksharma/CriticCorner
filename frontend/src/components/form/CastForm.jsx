import React, { useState } from "react";
import { useNotification } from "../../hooks";
import { commonInputClasses } from "../../utils/theme";
import LiveSearch from "../admin/LiveSearch";
import { renderItem, results } from "../admin/MovieForm";

const defaultCastInfo = {
  profile: {},
  roleAs: "",
  leadActor: false,
};
export default function CastForm({ onSubmit }) {
  const { updateNotification } = useNotification();
  const [castInfo, setCastInfo] = useState({ ...defaultCastInfo });
  const handleOnChange = ({ target }) => {
    const { checked, name, value } = target;
    if (name === "leadActor") return setCastInfo({ ...castInfo, leadActor: checked });
    setCastInfo({ ...castInfo, [name]: value });
  };
  const handleProfileSelect = (profile) => {
    setCastInfo({ ...castInfo, profile });
  };
  const handleSubmit = () => {
    const { profile, roleAs } = castInfo;
    if (!profile.name) return updateNotification("error", "Cast Profile is missing!");
    if (!roleAs.trim()) return updateNotification("error", "Cast Role is missing!");
    onSubmit(castInfo);
    setCastInfo({ ...defaultCastInfo });
  };
  const { leadActor, profile, roleAs } = castInfo;
  return (
    <div className="flex items-center space-x-2">
      <input
        onChange={handleOnChange}
        type="checkbox"
        name="leadActor"
        className="w-4 h-4"
        checked={leadActor}
        title='Set as Lead Actor'
      />
      <LiveSearch
        placeholder="Search profile"
        value={profile.name}
        results={results}
        onSelect={handleProfileSelect}
        renderItem={renderItem}
      />
      <span className="dark:text-dark-subtle text-light-subtle font-semibold">as</span>
      <div className="flex-grow">
        <input
          type="text"
          className={commonInputClasses + " rounded p-1 text-lg border-2"}
          placeholder="Role as"
          name="roleAs"
          value={roleAs}
          onChange={handleOnChange}
        />
      </div>
      <button
        onClick={handleSubmit}
        type="button"
        className="bg-secondary dark:bg-white text-white dark:text-primary rounded px-1"
      >
        Add
      </button>
    </div>
  );
}
