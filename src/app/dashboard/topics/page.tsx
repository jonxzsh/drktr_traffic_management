import DashboardTopics from "@/app/_components/topics/topics";

const Topics = () => {
  return (
    <div className="flex flex-col gap-y-16">
      <div className="flex max-w-2xl flex-col gap-y-4">
        <div className="text-4xl font-semibold">Topics</div>
        <div className="text-xl font-light">
          View and manage topics, settings and statistics
        </div>
      </div>
      <div className="flex w-full justify-between gap-x-8">
        <div className="w-3/4">
          <DashboardTopics />
        </div>
      </div>
    </div>
  );
};

export default Topics;
