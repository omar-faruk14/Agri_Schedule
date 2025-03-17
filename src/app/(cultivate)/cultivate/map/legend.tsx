

const Legend: React.FC = () => {
  return (
    <div
      style={{
        position: "absolute",
        top: "80px",
        right: "5px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "3px",
        fontSize: "10px",
        fontWeight: "bold",
        color: "black",
        zIndex: 1000,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        padding: "3px 5px",
        borderRadius: "3px",
      }}
    >
      {[
        { color: "#ff0000", label: "スタート" },
        { color: "orange", label: "途中 " },
        { color: "green", label: "完了" },
      ].map((item, index) => (
        <div
          key={index}
          style={{ display: "flex", alignItems: "center", gap: "3px" }}
        >
          <div
            style={{
              width: "10px", // Smaller indicator
              height: "10px",
              backgroundColor: item.color,
              borderRadius: "50%",
            }}
          ></div>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
};


export default Legend;