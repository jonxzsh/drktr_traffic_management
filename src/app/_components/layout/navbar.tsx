"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import GlobalTrafficRulesMangeDialog from "../global-traffic-rules/manage-dialog";

const DashboardNavbar = () => {
  return (
    <div className="flex h-16 min-h-16 w-full items-center justify-center bg-foreground text-background">
      <div className="flex w-content items-center justify-between">
        <div className="flex items-center gap-x-4">
          <div className="flex text-xl font-semibold">
            drktr admin dashboard
          </div>
          <div className="flex gap-x-2">
            <NavOption href={"/dashboard/publishers"}>Publishers</NavOption>
            <NavOption href={"/dashboard/topics"}>Topics</NavOption>
            <NavOption href={"/dashboard/landing-pages"}>
              Landing Pages
            </NavOption>
            <NavOption href={"/dashboard/backup-landing-pages"}>
              Backup Landing Pages
            </NavOption>
            <NavOption href={"/dashboard/traffic-rulesets"}>
              Traffic Rulesets
            </NavOption>
            <GlobalTrafficRulesMangeDialog />
          </div>
        </div>
        <div className="flex">
          <Link href="/logout">
            <Button variant={"destructive"}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                />
              </svg>
              <div>Logout</div>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const NavOption = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href}>
      <Button variant={isActive ? "secondary" : "ghost"}>{children}</Button>
    </Link>
  );
};

export default DashboardNavbar;
