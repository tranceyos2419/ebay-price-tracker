import TableView, { TableViewProps } from "@/components/features/TableView";
import { onFetchRecords } from "@/actions/dashoard";

export default async function DashboardPage() {
  const result = await onFetchRecords();
  const initialData: TableViewProps["initialData"] = result.initialData || [];

  return (
    <div className="p-4 min-h-screen flex flex-col">
      <TableView initialData={initialData} />
    </div>
  );
}
