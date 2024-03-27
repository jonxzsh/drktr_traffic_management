import DashboardPublishers from "@/app/_components/publishers/publishers";

const Publishers = () => {
  return (
    <div className="flex flex-col gap-y-16">
      <div className="flex max-w-2xl flex-col gap-y-4">
        <div className="text-4xl font-semibold">Publishers</div>
        <div className="text-xl font-light">
          View and manage publishers, settings and statistics
        </div>
      </div>
      <div className="flex w-full justify-between gap-x-8">
        <div className="w-3/4">
          <DashboardPublishers />
        </div>
      </div>
    </div>
  );
};

export default Publishers;
