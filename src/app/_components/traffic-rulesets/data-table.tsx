import { DataTable } from "@/app/_components/ui/data-table";
import { ITrafficRuleset } from "@/lib/types/generic";
import { ColumnDef } from "@tanstack/react-table";
import TrafficRulesetsPageDeleteDialog from "./delete-dialog";
import TrafficRulesetManageDialog from "./manage-dialog";

const TrafficRulesetsDataTable = ({
  data,
  refresh,
}: {
  data: ITrafficRuleset[];
  refresh: () => void;
}) => {
  const TrafficRulesetsDataColumns: ColumnDef<ITrafficRuleset>[] = [
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
      cell: ({ row }) => (
        <div>
          {row.original.rulesetAllowedDomains.map((d) => d.domain).join(", ")}
        </div>
      ),
    },
    {
      accessorKey: "referrer_required_parameters",
      header: "Referrer Required Query Parameters",
      cell: ({ row }) => (
        <div>
          {row.original.rulesetRequiredParameters
            .map((p) => p.parameter)
            .join(", ")}
        </div>
      ),
    },
    {
      accessorKey: ".",
      header: "",
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-end gap-x-2">
            <TrafficRulesetManageDialog
              ruleset={row.original}
              refresh={refresh}
            />
            <TrafficRulesetsPageDeleteDialog
              ruleset={row.original}
              onSuccess={refresh}
            />
          </div>
        );
      },
    },
  ];

  return <DataTable columns={TrafficRulesetsDataColumns} data={data} />;
};

export default TrafficRulesetsDataTable;
