import { redirect } from "next/navigation";
import TableView from "@/components/features/TableView";
import {
  onFetchRecords,
  handleOAuthCallback,
  isAuthenticated,
} from "@/actions/dashoard";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const code = searchParams.code;
  if (code) {
    await handleOAuthCallback(code);
    redirect("/dashboard");
  }
  const error = searchParams.error;
  if (error) {
    redirect("/auth-declined");
  }
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect("/signin");
  }
  const { initialData } = await onFetchRecords();

  return (
    <div className="p-4 min-h-screen flex flex-col">
      <TableView initialData={initialData || []} />
    </div>
  );
}
