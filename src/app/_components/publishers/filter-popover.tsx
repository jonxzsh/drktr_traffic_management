import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { XIcon } from "lucide-react";
import { useState } from "react";
import TopicDropdown from "../generic/topic-dropdown";

const PublishersPageFilterPopover = ({
  topicFilter,
  setTopicFilter,
}: {
  topicFilter?: undefined | string;
  setTopicFilter: (state: undefined | string) => void;
}) => {
  const [topicFilterName, setTopicFilterName] = useState<undefined | string>(
    undefined,
  );

  let filterText = "Filter";

  if (topicFilter) {
    if (filterText === "Filter") filterText = "Filtered by ";
    filterText += `topic: ${topicFilterName ?? topicFilter}`;
  }

  const clearFilters = () => {
    setTopicFilter(undefined);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"outline"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
            />
          </svg>
          <div>{filterText}</div>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-y-3">
          <div className="flex flex-col gap-y-2">
            <div className="text-sm font-semibold">Topic</div>
            <TopicDropdown
              defaultValue={topicFilter ?? ""}
              onChange={setTopicFilter}
              setName={setTopicFilterName}
            />
          </div>
          <Button variant="destructive" onClick={() => clearFilters()}>
            <XIcon />
            <div>Clear Filters</div>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PublishersPageFilterPopover;
