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

const TrafficRulesetsDropdown = ({
  defaultValue,
  onChange,
}: {
  defaultValue: string;
  onChange: (state: string) => void;
}) => {
  const trafficRulesets = api.trafficRulesets.getTrafficRulesets.useQuery();

  if (trafficRulesets.isFetching || !trafficRulesets.data) {
    return <Skeleton className="h-11 w-full" />;
  }

  return (
    <Select defaultValue={defaultValue} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={"Select a traffic ruleset"} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Traffic Rulesets</SelectLabel>
          {trafficRulesets.data.map((trafficRuleset, index) => (
            <SelectItem
              value={trafficRuleset.id}
              key={`topic-dropdown-option-${index}`}
            >
              {trafficRuleset.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default TrafficRulesetsDropdown;
