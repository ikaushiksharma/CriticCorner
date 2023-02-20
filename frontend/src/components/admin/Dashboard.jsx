import AppInfoBox from "../AppInfoBox";
import LatestUploads from "../LatestUploads";

export default function Dashboard() {
  return (
    <div className="grid grid-cols-3 gap-5 my-5">
      <AppInfoBox title="Total Movies" subTitle="100" />
      <AppInfoBox title="Total Reviews" subTitle="100" />
      <AppInfoBox title="Total Users" subTitle="100" />
      <LatestUploads />
    </div>
  );
}
