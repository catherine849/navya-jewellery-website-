export function Card({ children }) {
  return (
    <div style={{
      border: "1px solid #eee",
      borderRadius: "12px",
      padding: "20px",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
      backgroundColor: "#ffffff"
    }}>
      {children}
    </div>
  );
}

export function CardHeader({ children }) {
  return (
    <div style={{
      marginBottom: "10px",
      fontWeight: "600",
      fontSize: "18px"
    }}>
      {children}
    </div>
  );
}

export function CardContent({ children }) {
  return (
    <div style={{
      fontSize: "14px",
      color: "#555"
    }}>
      {children}
    </div>
  );
}
