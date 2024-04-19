"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/trpc/react";
import BackupLandingPageCreateDialog from "./create-dialog";
import BackupLandingPagesDataTable from "./data-table";

const DashboardBackupLandingPages = () => {
  const landingPages = api.backupLandingPages.getBackupLandingPages.useQuery();

  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-semibold">
          Existing Backup Landing Pages
        </div>
        <div className="flex items-center gap-x-3">
          <BackupLandingPageCreateDialog
            onSuccess={() => landingPages.refetch()}
          />
        </div>
      </div>
      {landingPages.data ? (
        <BackupLandingPagesDataTable
          data={landingPages.data}
          refresh={() => landingPages.refetch()}
        />
      ) : (
        <div className="flex flex-col gap-y-1">
          {Array.from(Array(12).keys()).map((loadingRow, index) => (
            <Skeleton
              className="h-11 w-full"
              key={`home-backup-landing-pages-loading-${index}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardBackupLandingPages;
