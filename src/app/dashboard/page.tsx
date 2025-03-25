import TableView from "@/components/features/TableView";
import { onFetchRecords } from "@/actions/dashoard";
import { TableRowData } from "@/types/interfaces";

export default async function DashboardPage() {
  const result = await onFetchRecords();
  const initialData: TableRowData[] = result.initialData || [];

  return (
    <div className="p-4 min-h-screen flex flex-col">
      <TableView initialData={initialData} />
    </div>
  );
}
