import { getCurrentUser } from "@/services/auth";
import Navbar from "@/components/Home/Navbar/Navbar";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <>
      <Navbar user={user} />
      {children}
    </>
  );
}
