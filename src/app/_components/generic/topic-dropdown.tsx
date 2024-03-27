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
}: {
  defaultValue: string;
  onChange: (state: string) => void;
}) => {
  const topics = api.topics.getTopics.useQuery();

  if (topics.isFetching || !topics.data) {
    return <Skeleton className="h-11 w-full" />;
  }

  return (
    <Select defaultValue={defaultValue} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={"Select a topic"} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Topics</SelectLabel>
          {topics.data.map((topic, index) => (
            <SelectItem value={topic.id} key={`topic-dropdown-option-${index}`}>
              {topic.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default TopicDropdown;
