"use client";
import DashboardTrafficRuleSets from "@/app/_components/traffic-rulesets/traffic-rulesets";
import { useToast } from "@/components/ui/use-toast";

const Topics = () => {
  const { toast } = useToast();

  return (
    <div className="flex flex-col gap-y-16">
      <div className="flex max-w-2xl flex-col gap-y-4">
        <div className="text-4xl font-semibold">Traffic Rulesets</div>
        <div className="text-xl font-light">
          View and manage traffic rulesets, settings and statistics
        </div>
      </div>
      <div className="flex w-full justify-between gap-x-8">
        <div className="w-3/4">
          <DashboardTrafficRuleSets />
        </div>
      </div>
    </div>
  );
};

export default Topics;
