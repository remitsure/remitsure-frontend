export function Notice({
  tone = "info",
  children,
}: {
  tone?: "info" | "error" | "success";
  children: React.ReactNode;
}) {
  const style = {
    info: "border-line bg-card text-muted",
    error: "border-red-200 bg-red-50 text-red-700",
    success: "border-green-200 bg-green-50 text-green-800",
  }[tone];
  return <div className={`rounded-xl border px-4 py-3 text-sm ${style}`}>{children}</div>;
}
