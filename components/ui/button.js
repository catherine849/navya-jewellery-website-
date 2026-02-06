export function Button({ children, onClick, variant = "default", style, disabled, className, size = "default", ...props }) {
  const baseStyle = {
    fontFamily: "'Inter', sans-serif",
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.3s ease",
    letterSpacing: "1px",
    textTransform: "uppercase",
    fontSize: size === "sm" ? "11px" : "12px",
    fontWeight: "500",
    opacity: disabled ? 0.5 : 1,
    ...style
  };

  const variants = {
    default: {
      background: "#1a1a1a",
      color: "white",
      padding: size === "sm" ? "8px 16px" : "12px 24px",
    },
    outline: {
      background: "white",
      color: "#1a1a1a",
      border: "1px solid #e5e5e5",
      padding: size === "sm" ? "8px 16px" : "12px 24px",
    },
    ghost: {
      background: "transparent",
      color: "#1a1a1a",
      padding: size === "sm" ? "8px 16px" : "12px 24px",
    }
  };

  const combinedStyle = { ...baseStyle, ...variants[variant] };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={combinedStyle}
      className={className}
      onMouseEnter={(e) => {
        if (!disabled) {
          if (variant === "default") {
            e.currentTarget.style.background = "#333";
          } else if (variant === "outline") {
            e.currentTarget.style.borderColor = "#1a1a1a";
          }
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          if (variant === "default") {
            e.currentTarget.style.background = "#1a1a1a";
          } else if (variant === "outline") {
            e.currentTarget.style.borderColor = "#e5e5e5";
          }
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
}
