"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/trpc/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import PublisherCreateDialog from "./create-dialog";
import PublishersDataTable from "./data-table";
import PublishersPageFilterPopover from "./filter-popover";

const DashboardPublishers = () => {
  const searchParams = useSearchParams();
  const filterValue = searchParams.get("filterValue");

  const [topicFilter, setTopicFilter] = useState<undefined | string>(
    searchParams.get("filterBy") === "topic" && filterValue
      ? filterValue
      : undefined,
  );

  const publishers = api.publishers.getPublishers.useQuery({
    topic_id_filter: topicFilter,
  });

  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-semibold">Existing Publishers</div>
        <div className="flex gap-x-3">
          <PublishersPageFilterPopover
            topicFilter={topicFilter}
            setTopicFilter={setTopicFilter}
          />
          <PublisherCreateDialog onSuccess={() => publishers.refetch()} />
        </div>
      </div>
      {publishers.data ? (
        <PublishersDataTable
          data={publishers.data}
          refresh={() => publishers.refetch()}
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

export default DashboardPublishers;
