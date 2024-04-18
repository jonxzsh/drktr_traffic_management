import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/trpc/react";

const TopicDropdown = ({
  defaultValue,
  onChange,
  filter,
  setName,
}: {
  defaultValue: string;
  onChange: (state: string) => void;
  filter?: (state: string) => boolean;
  setName?: (state: string) => void;
}) => {
  const topics = api.topics.getTopics.useQuery();

  if (topics.isFetching || !topics.data) {
    return <Skeleton className="h-11 w-full" />;
  }

  return (
    <Select
      value={defaultValue}
      onValueChange={(value) => {
        if (setName) {
          const topicIndex = topics.data.findIndex((t) => t.id === value);
          if (topicIndex !== -1) setName(topics.data[topicIndex]!.name);
        }
        onChange(value);
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder={"Select a topic"} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Topics</SelectLabel>
          {topics.data.map((topic, index) => {
            if (filter && !filter(topic.id)) return;
            return (
              <SelectItem
                value={topic.id}
                key={`topic-dropdown-option-${index}`}
              >
                {topic.name}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default TopicDropdown;
