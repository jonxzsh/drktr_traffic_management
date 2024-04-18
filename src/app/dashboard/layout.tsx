import DashboardNavbar from "../_components/layout/navbar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen w-full flex-col">
      <DashboardNavbar />
      <div className="flex justify-center py-16">
        <div className="max-w-content w-content">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
