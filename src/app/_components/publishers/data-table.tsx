import { DataTable } from "@/app/_components/ui/data-table";
import { publishers } from "@/server/db/schema";
import { ColumnDef } from "@tanstack/react-table";

const PublishersTableColumns: ColumnDef<typeof publishers.$inferSelect>[] = [
  {
    accessorKey: "id",
    header: "ID",
    size: 120,
  },
  {
    accessorKey: "name",
    header: "Name",
    size: 80,
  },
  {
    accessorKey: "apiKey",
    header: "API Key",
    size: 200,
  },
  {
    accessorKey: "createdAt",
    header: () => <div className="text-right">Created</div>,
    cell: ({ row }) => {
      const formattedDate = new Date(row.getValue("createdAt"))
        .toJSON()
        .slice(0, 10);
      return <div className="text-right">{formattedDate}</div>;
    },
  },
];

const PublishersDataTable = ({
  data,
}: {
  data: (typeof publishers.$inferSelect)[];
}) => {
  return <DataTable columns={PublishersTableColumns} data={data} />;
};

export default PublishersDataTable;
