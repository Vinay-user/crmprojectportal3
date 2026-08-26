export default function StatCard({
  title,
  value,
  change,
  icon: Icon,
  color = "blue"
}) {
  return (
    <div className="stat-card">
      <div
        className={`stat-icon ${color}`}
      >
        {Icon && <Icon size={22} />}
      </div>

      <div className="stat-content">
        <span>{title}</span>

        <strong>{value}</strong>

        {change !== undefined && (
          <small
            className={
              change >= 0
                ? "positive"
                : "negative"
            }
          >
            {change >= 0 ? "+" : ""}
            {change}% from last month
          </small>
        )}
      </div>
    </div>
  );
}