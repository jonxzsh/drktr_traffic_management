"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/trpc/react";
import TopicCreateDialog from "./create-dialog";
import TopicsDataTable from "./data-table";

const DashboardTopics = () => {
  const topics = api.topics.getTopics.useQuery();

  if (topics.isFetching || !topics.data) {
    return (
      <div className="flex flex-col gap-y-1">
        {Array.from(Array(12).keys()).map((loadingRow, index) => (
          <Skeleton
            className="h-11 w-full"
            key={`home-topics-loading-${index}`}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-semibold">Existing Topics</div>
        <TopicCreateDialog onSuccess={() => topics.refetch()} />
      </div>
      <TopicsDataTable data={topics.data} />
    </div>
  );
};

export default DashboardTopics;
