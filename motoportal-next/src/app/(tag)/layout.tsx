export default function TagLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-[#f4f3f1]">{children}</div>;
}