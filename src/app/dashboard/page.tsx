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
  searchParams: Promise<{
    code?: string;
    error?: string;
    [key: string]: string | undefined;
  }>;
}) {
  const params = await searchParams;

  if (params.code) {
    await handleOAuthCallback(params.code);
    redirect("/dashboard");
  }

  if (params.error) {
    redirect("/auth-declined");
  }

  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect("/signin");
  }

  const { initialData } = await onFetchRecords();

  return (
    <div className="p-4 min-h-screen flex flex-col">
      <TableView initialData={initialData} />
    </div>
  );
}
