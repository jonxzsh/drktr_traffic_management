import DashboardTrafficRequests from "@/app/_components/traffic-requests/traffic-requests";
import { Suspense } from "react";

const TrafficRequests = () => {
  return (
    <div className="flex flex-col gap-y-16">
      <div className="flex max-w-2xl flex-col gap-y-4">
        <div className="text-4xl font-semibold">Traffic Requests</div>
        <div className="text-xl font-light">
          View and manage traffic request history
        </div>
      </div>
      <div className="flex w-full justify-between gap-x-8">
        <div className="w-3/4">
          <Suspense>
            <DashboardTrafficRequests />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default TrafficRequests;
