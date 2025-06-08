import "../gradienttext/gradienttext.css";

export default function GradientText({
  children,
  className = "",
  colors = ["#6366ff", "#f9a1e3", "#6366ff"],
  animationSpeed = 8,
}) {
  const gradientStyle = {
    backgroundImage: `linear-gradient(to right, ${colors.join(", ")})`,
    animationDuration: `${animationSpeed}s`,
  };

  return (
    <span className={className}>
      <span className="text-content" style={gradientStyle}>
        {children}
      </span>
    </span>
  );
}