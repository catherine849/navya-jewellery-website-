export function Input({ style, className, ...props }) {
  return (
    <input
      {...props}
      style={{
        padding: "12px 16px",
        border: "1px solid #e5e5e5",
        borderRadius: "0",
        width: "100%",
        fontSize: "14px",
        fontFamily: "'Inter', sans-serif",
        color: "#1a1a1a",
        outline: "none",
        transition: "border-color 0.2s ease",
        backgroundColor: "white",
        ...style
      }}
      className={className}
      onFocus={(e) => {
        e.target.style.borderColor = "#1a1a1a";
      }}
      onBlur={(e) => {
        e.target.style.borderColor = "#e5e5e5";
      }}
    />
  );
}
