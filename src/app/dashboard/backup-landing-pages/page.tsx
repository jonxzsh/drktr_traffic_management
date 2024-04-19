import DashboardBackupLandingPages from "@/app/_components/backup-landing-pages/backup-landing-pages";
import { Suspense } from "react";

const BackupLandingPages = () => {
  return (
    <div className="flex flex-col gap-y-16">
      <div className="flex max-w-2xl flex-col gap-y-4">
        <div className="text-4xl font-semibold">Backup Landing Pages</div>
        <div className="text-xl font-light">
          View and manage backup landing pages, settings and statistics
        </div>
      </div>
      <div className="flex w-full justify-between gap-x-8">
        <div className="w-3/4">
          <Suspense>
            <DashboardBackupLandingPages />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default BackupLandingPages;
