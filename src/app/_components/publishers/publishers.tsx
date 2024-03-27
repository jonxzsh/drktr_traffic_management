"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/trpc/react";
import PublisherCreateDialog from "./create-dialog";
import PublishersDataTable from "./data-table";

const DashboardPublishers = () => {
  const publishers = api.publishers.getPublishers.useQuery();

  if (publishers.isFetching || !publishers.data) {
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
        <div className="text-2xl font-semibold">Existing Publishers</div>
        <PublisherCreateDialog onSuccess={() => publishers.refetch()} />
      </div>
      <PublishersDataTable data={publishers.data} />
    </div>
  );
};

export default DashboardPublishers;
