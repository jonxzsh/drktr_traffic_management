import { DataTable } from "@/app/_components/ui/data-table";
import { IPublisher } from "@/lib/types/generic";
import { publishers } from "@/server/db/schema";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import PublishersPageDeleteDialog from "./delete-dialog";
import PublishersEditDialog from "./edit-dialog";

const PublishersDataTable = ({
  data,
  refresh,
}: {
  data: (typeof publishers.$inferSelect)[];
  refresh: () => void;
}) => {
  const PublishersTableColumns = useMemo(
    () =>
      [
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
          accessorKey: "active",
          header: "Status",
          cell: ({ row }) => {
            return <>{row.original.active ? "Active" : "Inactive"}</>;
          },
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
        {
          accessorKey: ".",
          header: "",
          cell: ({ row }) => {
            return (
              <div className="flex items-center justify-end gap-x-2">
                <PublishersEditDialog
                  publisher={row.original as IPublisher}
                  refresh={refresh}
                />
                <PublishersPageDeleteDialog
                  publisher={row.original as IPublisher}
                  onSuccess={refresh}
                />
              </div>
            );
          },
        },
      ] as ColumnDef<typeof publishers.$inferSelect>[],
    [],
  );

  return <DataTable columns={PublishersTableColumns} data={data} />;
};

export default PublishersDataTable;
