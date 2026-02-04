export function Button({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "black",
        color: "white",
        padding: "10px 18px",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer"
      }}
    >
      {children}
    </button>
  )
}
