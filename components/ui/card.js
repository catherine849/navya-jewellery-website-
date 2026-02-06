export function Card({ children, style, ...props }) {
  return (
    <div
      style={{
        border: "1px solid #e5e5e5",
        backgroundColor: "#ffffff",
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, style, ...props }) {
  return (
    <div
      style={{
        padding: "20px 24px",
        borderBottom: "1px solid #e5e5e5",
        fontWeight: "500",
        fontSize: "16px",
        letterSpacing: "1px",
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({ children, style, ...props }) {
  return (
    <div
      style={{
        padding: "24px",
        fontSize: "14px",
        color: "#1a1a1a",
        lineHeight: "1.6",
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardFooter({ children, style, ...props }) {
  return (
    <div
      style={{
        padding: "20px 24px",
        borderTop: "1px solid #e5e5e5",
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
}
