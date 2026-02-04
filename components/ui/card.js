export function Card({ children }) {
  return (
    <div style={{
      border: "1px solid #eee",
      borderRadius: "12px",
      padding: "20px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
    }}>
      {children}
    </div>
  )
}
