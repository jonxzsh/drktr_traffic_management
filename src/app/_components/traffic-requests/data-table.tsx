import { DataTable } from "@/app/_components/ui/data-table";
import { ITrafficRequest } from "@/lib/types/generic";
import { ColumnDef } from "@tanstack/react-table";

const TrafficRequestsDataTable = ({
  data,
  refresh,
}: {
  data: ITrafficRequest[];
  refresh: () => void;
}) => {
  const TrafficRequestsTableColumns: ColumnDef<ITrafficRequest>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "referrerUrl",
      header: "Referrer",
    },
    {
      accessorKey: "topicId",
      header: "Topic ID",
    },
    {
      accessorKey: "publisherId",
      header: "Publisher ID",
    },

    {
      accessorKey: "monetized",
      header: "Monetized",
    },
    {
      accessorKey: "createdAt",
      header: () => <div className="text-right">Created</div>,
      cell: ({ row }) => {
        const formattedDate = new Date(row.getValue("createdAt"));
        return (
          <div className="text-right">
            {formattedDate.toLocaleDateString("en-US")}
          </div>
        );
      },
    },
  ];

  return <DataTable columns={TrafficRequestsTableColumns} data={data} />;
};

export default TrafficRequestsDataTable;
