import React, { useState } from "react";
import { searchActor } from "../../api/actor";
import { useNotification, useSearch } from "../../hooks";
import { renderItem } from "../../utils/helper";
import { commonInputClasses } from "../../utils/theme";
import LiveSearch from "../admin/LiveSearch";

const defaultCastInfo = {
  profile: {},
  roleAs: "",
  leadActor: false,
};
export default function CastForm({ onSubmit }) {
  const [castInfo, setCastInfo] = useState({ ...defaultCastInfo });
  const { updateNotification } = useNotification();
  const { handleSearch, resetSearch } = useSearch();
  const [profiles, setProfiles] = useState([]);
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
    setCastInfo({ ...defaultCastInfo, profile: { name: "" } });
    resetSearch();
    setProfiles([]);
  };

  const handleProfileChange = ({ target }) => {
    const { value } = target;
    const { profile } = castInfo;
    profile.name = value;
    setCastInfo({ ...castInfo, ...profile });
    handleSearch(searchActor, value, setProfiles);
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
        title="Set as Lead Actor"
      />
      <LiveSearch
        placeholder="Search profile"
        name="cast"
        value={profile.name}
        results={profiles}
        onSelect={handleProfileSelect}
        renderItem={renderItem}
        onChange={handleProfileChange}
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
