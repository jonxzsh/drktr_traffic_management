import { DataTable } from "@/app/_components/ui/data-table";
import { ILandingPage } from "@/lib/types/generic";
import { ColumnDef } from "@tanstack/react-table";
import LandingPageDeleteDialog from "./delete-dialog";
import LandingPageEditDialog from "./edit-dialog";

const LandingPagesDataTable = ({
  data,
  refresh,
}: {
  data: ILandingPage[];
  refresh: () => void;
}) => {
  const LandingPagesTableColumns: ColumnDef<ILandingPage>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "topic",
      header: "Topic",
      cell: ({ row }) => {
        return <>{row.original.topic.name}</>;
      },
    },
    {
      accessorKey: "feedProvider",
      header: "Feed Provider",
    },
    {
      accessorKey: "url",
      header: "URL",
      cell: ({ row }) => {
        return <div className="max-w-[250px] truncate">{row.original.url}</div>;
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
