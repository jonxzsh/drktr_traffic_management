"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/trpc/react";
import TrafficRequestsDataTable from "./data-table";

const DashboardTrafficRequests = () => {
  const requestsStats = api.trafficRequests.getTrafficStats.useQuery();
  const trafficRequests = api.trafficRequests.getTrafficRequests.useQuery();

  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-semibold">
          Traffic Requests ({requestsStats.data?.totalRequestsCount} total,{" "}
          {requestsStats.data?.monetizedRequestsCount} monetized)
        </div>
      </div>
      {trafficRequests.data ? (
        <TrafficRequestsDataTable
          data={trafficRequests.data}
          refresh={() => trafficRequests.refetch()}
        />
      ) : (
        <div className="flex flex-col gap-y-1">
          {Array.from(Array(12).keys()).map((loadingRow, index) => (
            <Skeleton
              className="h-11 w-full"
              key={`home-publishers-loading-${index}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardTrafficRequests;
