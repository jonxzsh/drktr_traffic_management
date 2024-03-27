import { DataTable } from "@/app/_components/ui/data-table";
import { trafficRulesets } from "@/server/db/schema";
import { ColumnDef } from "@tanstack/react-table";

const TrafficRulesetsDataColumns: ColumnDef<
  typeof trafficRulesets.$inferSelect
>[] = [
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
    accessorKey: "referrer_domains_allowed",
    header: "Referrer Domains Allowed",
  },
  {
    accessorKey: "referrer_required_parameters",
    header: "Referrer Required Query Parameters",
  },
];

const TrafficRulesetsDataTable = ({
  data,
}: {
  data: (typeof trafficRulesets.$inferSelect)[];
}) => {
  return <DataTable columns={TrafficRulesetsDataColumns} data={data} />;
};

export default TrafficRulesetsDataTable;
