import { Skeleton } from "@/components/ui/skeleton";
import { trafficRulesets } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { Combobox } from "@headlessui/react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { useEffect, useState } from "react";

const TrafficRulesetsDropdown = ({
  defaultValue,
  onChange,
}: {
  defaultValue: string[];
  onChange: (state: string[]) => void;
}) => {
  const [rulesetNameFilter, setRulesetNameFilter] = useState<string>("");
  const [rulesets, setRulesets] = useState<
    (typeof trafficRulesets.$inferSelect)[]
  >([]);

  const trafficRulesetsQuery =
    api.trafficRulesets.getTrafficRulesets.useQuery();

  useEffect(() => {
    if (!trafficRulesetsQuery.data) return;
    if (rulesetNameFilter.length > 0) {
      setRulesets(
        trafficRulesetsQuery.data.filter((f) =>
          f.name.toLowerCase().includes(rulesetNameFilter.toLowerCase()),
        ),
      );
    } else {
      setRulesets(trafficRulesetsQuery.data);
    }
  }, [rulesetNameFilter]);

  useEffect(() => {
    if (!trafficRulesetsQuery.data) return;
    setRulesets(trafficRulesetsQuery.data);
  }, [trafficRulesetsQuery.data]);

  if (!trafficRulesetsQuery.data) return <Skeleton />;

  const getRulesetName = (ruleset_id: string) => {
    const rIndex = trafficRulesetsQuery.data.findIndex(
      (r) => r.id === ruleset_id,
    );
    if (rIndex === -1) return ruleset_id;
    return trafficRulesetsQuery.data[rIndex]!.name;
  };

  return (
    <Combobox value={defaultValue} onChange={onChange} multiple>
      <div className="relative">
        <div className="relative w-full cursor-default overflow-hidden rounded-lg border border-input bg-white text-left">
          <Combobox.Input
            className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus-visible:outline-none"
            displayValue={(rulesets: string[]) => {
              if (Array.isArray(rulesets)) {
                return rulesets.map((r) => getRulesetName(r)).join(", ");
              } else {
                return rulesets;
              }
            }}
            onChange={(e) => setRulesetNameFilter(e.target.value)}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronsUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Combobox.Button>
        </div>
        <Combobox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
          {rulesets.map((ruleset) => (
            <Combobox.Option
              className={({ active }) =>
                `relative cursor-default select-none py-2 pl-4 pr-4 ${
                  active ? "bg-primary text-white" : "text-gray-900"
                }`
              }
              key={`ruleset-option-${ruleset.id}`}
              value={ruleset.id}
            >
              {({ selected, active }) => (
                <div className="flex items-center gap-x-2">
                  <div className="w-6">
                    {selected && <CheckIcon size={17} />}
                  </div>
                  <div>{ruleset.name}</div>
                </div>
              )}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </div>
    </Combobox>
  );
};

export default TrafficRulesetsDropdown;
