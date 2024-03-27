import { DataTable } from "@/app/_components/ui/data-table";
import { topics } from "@/server/db/schema";
import { ColumnDef } from "@tanstack/react-table";

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
];

const TopicsDataTable = ({
  data,
}: {
  data: (typeof topics.$inferSelect)[];
}) => {
  return <DataTable columns={TopicsDataColumns} data={data} />;
};

export default TopicsDataTable;
