import DashboardNavbar from "../_components/layout/navbar";

export default ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen w-full flex-col">
      <DashboardNavbar />
      <div className="flex justify-center py-16">
        <div className="w-content max-w-content">{children}</div>
      </div>
    </div>
  );
};
