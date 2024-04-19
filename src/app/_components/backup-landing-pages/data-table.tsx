import { DataTable } from "@/app/_components/ui/data-table";
import { backupLandingPages } from "@/server/db/schema";
import { ColumnDef } from "@tanstack/react-table";
import BackupLandingPageDeleteDialog from "./delete-dialog";
import BackupLandingPageEditDialog from "./edit-dialog";

const LandingPagesDataTable = ({
  data,
  refresh,
}: {
  data: (typeof backupLandingPages.$inferSelect)[];
  refresh: () => void;
}) => {
  const LandingPagesTableColumns: ColumnDef<
    typeof backupLandingPages.$inferSelect
  >[] = [
    {
      accessorKey: "id",
      header: "ID",
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
        const formattedDate = new Date(row.getValue("createdAt"));
        return (
          <div className="text-right">
            {formattedDate.toLocaleDateString("en-US")}
          </div>
        );
      },
    },
    {
      accessorKey: "trafficRulesetId",
      header: "",
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-end gap-x-2">
            <BackupLandingPageEditDialog
              backupLandingPage={row.original}
              onSuccess={() => refresh()}
            />
            <BackupLandingPageDeleteDialog
              backupLandingPage={row.original}
              onSuccess={() => refresh()}
            />
          </div>
        );
      },
    },
  ];

  return <DataTable columns={LandingPagesTableColumns} data={data} />;
};

export default LandingPagesDataTable;
