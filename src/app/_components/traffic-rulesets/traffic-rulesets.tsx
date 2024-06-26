"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/trpc/react";
import TrafficRulesetsCreateDialog from "./create-dialog";
import TrafficRulesetsDataTable from "./data-table";

const DashboardTrafficRuleSets = () => {
  const trafficRulesets = api.trafficRulesets.getTrafficRulesets.useQuery();

  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-semibold">Existing Traffic Rulesets</div>
        <TrafficRulesetsCreateDialog
          onSuccess={() => trafficRulesets.refetch()}
        />
      </div>
      {trafficRulesets.data ? (
        <TrafficRulesetsDataTable
          data={trafficRulesets.data}
          refresh={() => trafficRulesets.refetch()}
        />
      ) : (
        <div className="flex flex-col gap-y-1">
          {Array.from(Array(12).keys()).map((loadingRow, index) => (
            <Skeleton
              className="h-11 w-full"
              key={`home-traffic-rulesets-loading-${index}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardTrafficRuleSets;
