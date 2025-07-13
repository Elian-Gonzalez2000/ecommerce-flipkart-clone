const Skeleton = ({ width = "100%", height = "1rem", styles = {} }) => {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius: "4px", ...styles }}
    ></div>
  );
};

export default Skeleton;
