import { DataTable } from "@/app/_components/ui/data-table";
import { Button } from "@/components/ui/button";
import { topics } from "@/server/db/schema";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import TopicsPageDeleteDialog from "./delete-dialog";

const TopicsDataTable = ({
  data,
  refresh,
}: {
  data: (typeof topics.$inferSelect)[];
  refresh: () => void;
}) => {
  const TopicsDataColumns: ColumnDef<typeof topics.$inferSelect>[] = [
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
      accessorKey: "actions",
      header: "",
      cell: ({ row }) => {
        return (
          <div className="flex justify-end gap-x-3">
            <Link
              href={`/dashboard/publishers?filterBy=topic&filterValue=${row.getValue("id")}`}
            >
              <Button size={"sm"} variant={"outline"}>
                Publishers
              </Button>
            </Link>
            <Link
              href={`/dashboard/landing-pages?filterBy=topic&filterValue=${row.getValue("id")}`}
            >
              <Button size={"sm"} variant={"outline"}>
                Landing Pages
              </Button>
            </Link>
            <TopicsPageDeleteDialog
              topic={row.original}
              onSuccess={() => refresh()}
            />
          </div>
        );
      },
    },
  ];

  return <DataTable columns={TopicsDataColumns} data={data} />;
};

export default TopicsDataTable;
