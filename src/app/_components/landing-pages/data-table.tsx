import { DataTable } from "@/app/_components/ui/data-table";
import { landingPages } from "@/server/db/schema";
import { ColumnDef } from "@tanstack/react-table";
import LandingPageDeleteDialog from "./delete-dialog";
import LandingPageEditDialog from "./edit-dialog";

const LandingPagesDataTable = ({
  data,
  refresh,
}: {
  data: (typeof landingPages.$inferSelect)[];
  refresh: () => void;
}) => {
  const LandingPagesTableColumns: ColumnDef<
    typeof landingPages.$inferSelect
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
      accessorKey: "feedProvider",
      header: "Feed Provider",
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
    {
      accessorKey: "trafficRulesetId",
      header: "",
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-end gap-x-2">
            <LandingPageEditDialog
              landingPage={row.original}
              onSuccess={() => refresh()}
            />
            <LandingPageDeleteDialog
              landingPage={row.original}
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
