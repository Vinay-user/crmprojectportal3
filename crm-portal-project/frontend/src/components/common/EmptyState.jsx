export default function EmptyState({
  title = "No data found",
  description = "There are no records to display."
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon">∅</div>

      <h3>{title}</h3>

      <p>{description}</p>
    </div>
  );
}