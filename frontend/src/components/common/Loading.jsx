export default function Loading({
  text = "Loading..."
}) {
  return (
    <div className="loading-container">
      <div className="spinner" />
      <span>{text}</span>
    </div>
  );
}