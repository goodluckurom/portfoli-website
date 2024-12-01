import { getSession, isAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminDashboard from "./AdminDashboard";
import { getDynamicConfig } from '@/lib/dynamic';

export const dynamic = getDynamicConfig('/admin');

export default async function AdminPage() {
  // Server-side authentication check
  const session = await getSession();
  
  if (!session || session?.role!=='ADMIN') {
    redirect("/");
  }

  return <AdminDashboard dynamic={dynamic} />;
}
