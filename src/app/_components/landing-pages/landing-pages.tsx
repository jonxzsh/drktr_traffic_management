"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { FeedProvider } from "@/lib/types/generic";
import { api } from "@/trpc/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import LandingPageCreateDialog from "./create-dialog";
import LandingPagesDataTable from "./data-table";
import LandingPageFilterPopover from "./filter-popover";

const DashboardLandingPages = () => {
  const searchParams = useSearchParams();
  const filterValue = searchParams.get("filterValue");

  const [feedProviderFilter, setFeedProviderFilter] = useState<
    undefined | FeedProvider
  >(undefined);
  const [topicFilter, setTopicFilter] = useState<undefined | string>(
    searchParams.get("filterBy") === "topic" && filterValue
      ? filterValue
      : undefined,
  );

  const landingPages = api.landingPages.getLandingPages.useQuery({
    topic_id_filter: topicFilter,
    feed_provider_filter: feedProviderFilter,
  });

  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-semibold">Existing Landing Pages</div>
        <div className="flex items-center gap-x-3">
          <LandingPageFilterPopover
            feedProviderFilter={feedProviderFilter}
            setFeedProviderFilter={setFeedProviderFilter}
            topicFilter={topicFilter}
            setTopicFilter={setTopicFilter}
          />
          <LandingPageCreateDialog onSuccess={() => landingPages.refetch()} />
        </div>
      </div>
      {landingPages.data ? (
        <LandingPagesDataTable
          data={landingPages.data}
          refresh={() => landingPages.refetch()}
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

export default DashboardLandingPages;
