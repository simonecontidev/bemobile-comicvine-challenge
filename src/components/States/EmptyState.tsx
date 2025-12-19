export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900 }}>{title}</h2>
      <p style={{ marginTop: 8, color: "#666" }}>{description}</p>
    </div>
  );
}