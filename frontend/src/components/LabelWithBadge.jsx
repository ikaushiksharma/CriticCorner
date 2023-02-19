import Label from "./Label";

const LabelWithBadge = ({ htmlFor, children, badge = 0 }) => {
  const renderBadge = () => {
    if (!badge) return null;
    return (
      <span className="dark:bg-dark-subtle bg-light-subtle text-white absolute top-0 right-0 text-xs translate-x-2 -translate-y-1 w-5 h-5 rounded-full flex justify-center">
        {badge <= 9 ? badge : "9+"}
      </span>
    );
  };
  return (
    <div className="relative">
      <Label htmlFor={htmlFor}>{children}</Label>
      {renderBadge()}
    </div>
  );
};

export default LabelWithBadge;
