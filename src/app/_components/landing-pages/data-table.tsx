import { DataTable } from "@/app/_components/ui/data-table";
import { landingPages } from "@/server/db/schema";
import { ColumnDef } from "@tanstack/react-table";

const LandingPagesTableColumns: ColumnDef<typeof landingPages.$inferSelect>[] =
  [
    {
      accessorKey: "id",
      header: "ID",
      size: 50,
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "url",
      header: "URL",
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

const LandingPagesDataTable = ({
  data,
}: {
  data: (typeof landingPages.$inferSelect)[];
}) => {
  return <DataTable columns={LandingPagesTableColumns} data={data} />;
};

export default LandingPagesDataTable;
