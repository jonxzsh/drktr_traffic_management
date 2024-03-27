"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/trpc/react";
import LandingPageCreateDialog from "./create-dialog";
import LandingPagesDataTable from "./data-table";

const DashboardLandingPages = () => {
  const landingPages = api.landingPages.getLandingPages.useQuery();

  if (landingPages.isFetching || !landingPages.data) {
    return (
      <div className="flex flex-col gap-y-1">
        {Array.from(Array(12).keys()).map((loadingRow, index) => (
          <Skeleton
            className="h-11 w-full"
            key={`home-publishers-loading-${index}`}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-semibold">Existing Landing Pages</div>
        <LandingPageCreateDialog onSuccess={() => landingPages.refetch()} />
      </div>
      <LandingPagesDataTable data={landingPages.data} />
    </div>
  );
};

export default DashboardLandingPages;
