import { useEffect, useState } from "react";
import { getAppInfo } from "../../api/admin";
import { useNotification } from "../../hooks";
import AppInfoBox from "../AppInfoBox";
import LatestUploads from "../LatestUploads";
import MostRatedMovies from "../MostRatedMovies";

export default function Dashboard() {
  const [appInfo, setAppInfo] = useState({
    movieCount: 0,
    reviewCount: 0,
    userCount: 0,
  });

  const { updateNotification } = useNotification();

  const fetchAppInfo = async () => {
    const { error, appInfo } = await getAppInfo();
    if (error) return updateNotification("error", error);
    setAppInfo({ ...appInfo });
  };

  useEffect(() => {
    fetchAppInfo();
  }, []);

  return (
    <div className="grid grid-cols-3 gap-5 p-5">
      <AppInfoBox title="Total Movies" subTitle={appInfo.movieCount.toLocaleString()} />
      <AppInfoBox title="Total Reviews" subTitle={appInfo.reviewCount.toLocaleString()} />
      <AppInfoBox title="Total Users" subTitle={appInfo.userCount.toLocaleString()} />
      <LatestUploads />
      <MostRatedMovies />
    </div>
  );
}
