import {
  ClipboardListIcon,
  FlagIcon,
  GaugeCircleIcon,
  MenuIcon,
  TargetIcon,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "react-router-dom";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { FullScaleIcon } from "./icons/FullScaleIcon";

const Hamburger = () => {
  return (
    <Sheet>
      <SheetTrigger className="rounded-full h-10 w-10 flex justify-center items-center">
        <MenuIcon className="" />
      </SheetTrigger>
      <SheetContent
        closeIcon={false}
        side="left"
        className="px-2 py-4 w-64 border-none flex flex-col justify-start"
      >
        <div className="flex gap-3 mb-4 px-2 items-center">
          <SheetPrimitive.Close className="h-fit p-1.5 rounded-full flex justify-center items-center">
            <MenuIcon className="h-[1.2rem] w-[1.2rem]" />
          </SheetPrimitive.Close>
          <SheetPrimitive.Close className="w-full">
            <Link
              className="flex items-center justify-center gap-1 text-primary"
              to="/"
              reloadDocument
              tabIndex={-1}
            >
              {/* <svg fill="currentColor" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="36px" height="36px" viewBox="0 0 425.178 425.178" xmlSpace="preserve">
                <g>
                  <g>
                    <rect y="361.617" width="39.447" height="39.449"/>
                    <rect y="313.412" width="39.447" height="39.433"/>
                    <rect y="265.183" width="39.447" height="39.441"/>
                    <rect y="216.969" width="39.447" height="39.449"/>
                    <rect y="168.746" width="39.447" height="39.447"/>
                    <rect y="120.537" width="39.447" height="39.443"/>
                    <rect y="72.323" width="39.447" height="39.447"/>
                    <rect y="24.112" width="39.447" height="39.447"/>
                    <rect x="48.218" y="361.617" width="39.447" height="39.449"/>
                    <rect x="48.218" y="313.412" width="39.447" height="39.433"/>
                    <rect x="48.218" y="265.183" width="39.447" height="39.441"/>
                    <rect x="48.218" y="216.969" width="39.447" height="39.449"/>
                    <rect x="48.218" y="168.746" width="39.447" height="39.447"/>
                    <rect x="96.435" y="361.617" width="39.439" height="39.449"/>
                    <rect x="96.435" y="313.412" width="39.439" height="39.433"/>
                    <rect x="96.435" y="265.183" width="39.439" height="39.441"/>
                    <rect x="144.645" y="361.617" width="39.447" height="39.449"/>
                    <rect x="144.645" y="313.412" width="39.447" height="39.433"/>
                    <rect x="144.645" y="265.183" width="39.447" height="39.441"/>
                    <rect x="144.645" y="216.969" width="39.447" height="39.449"/>
                    <rect x="144.645" y="168.746" width="39.447" height="39.447"/>
                    <rect x="144.645" y="120.537" width="39.447" height="39.443"/>
                    <rect x="192.859" y="361.617" width="39.445" height="39.449"/>
                    <rect x="192.859" y="313.412" width="39.445" height="39.433"/>
                    <rect x="241.085" y="361.617" width="39.441" height="39.449"/>
                    <rect x="241.085" y="313.412" width="39.441" height="39.433"/>
                    <rect x="241.085" y="265.183" width="39.441" height="39.441"/>
                    <rect x="241.085" y="216.969" width="39.441" height="39.449"/>
                    <rect x="241.085" y="168.746" width="39.441" height="39.447"/>
                    <rect x="241.085" y="120.537" width="39.441" height="39.443"/>
                    <rect x="241.085" y="72.323" width="39.441" height="39.447"/>
                    <rect x="289.299" y="361.617" width="39.444" height="39.449"/>
                    <rect x="337.504" y="361.617" width="39.453" height="39.449"/>
                    <rect x="337.504" y="313.412" width="39.453" height="39.433"/>
                    <rect x="337.504" y="265.183" width="39.453" height="39.441"/>
                    <rect x="385.725" y="361.617" width="39.453" height="39.449"/>
                    <rect x="385.725" y="313.412" width="39.453" height="39.433"/>
                    <rect x="385.725" y="265.183" width="39.453" height="39.441"/>
                    <rect x="385.725" y="216.969" width="39.453" height="39.449"/>
                  </g>
                </g>
              </svg> */}
              <FullScaleIcon size={36} className="fill-current text-primary" />
              <span className="text-2xl font-bold tracking-tighter text-secondary-foreground">
                stockpilot
              </span>
            </Link>
          </SheetPrimitive.Close>
        </div>
        <div className="w-full flex flex-col gap-2 items-center">
          <SheetPrimitive.Close className="w-full" tabIndex={-1}>
            <Link
              to="/dashboard"
              className="w-full flex gap-4 text-xl justify-start px-3 py-3 items-center hover:bg-accent hover:text-accent-foreground rounded-md font-medium"
              reloadDocument
            >
              <GaugeCircleIcon
                size={24}
                className={
                  location.pathname === "/dashboard" ? "text-primary" : ""
                }
              />
              <span>Dashboard</span>
            </Link>
          </SheetPrimitive.Close>
          <SheetPrimitive.Close className="w-full" tabIndex={-1}>
            <Link
              to="/inventory"
              className="w-full flex gap-4 text-xl justify-start px-3 py-3 items-center hover:bg-accent hover:text-accent-foreground rounded-md font-medium"
              reloadDocument
            >
              <ClipboardListIcon
                size={24}
                className={
                  location.pathname === "/inventory" ? "text-primary" : ""
                }
              />
              <span>Inventory</span>
            </Link>
          </SheetPrimitive.Close>
          <SheetPrimitive.Close className="w-full" tabIndex={-1}>
            <Link
              to="/tracker"
              className="w-full flex gap-4 text-xl justify-start px-3 py-3 items-center hover:bg-accent hover:text-accent-foreground rounded-md font-medium"
              reloadDocument
            >
              <TargetIcon
                size={24}
                className={
                  location.pathname === "/tracker" ? "text-primary" : ""
                }
              />
              <span>Tracker</span>
            </Link>
          </SheetPrimitive.Close>
          <SheetPrimitive.Close className="w-full" tabIndex={-1}>
            <Link
              to="/requests"
              className="w-full flex gap-4 text-xl justify-start px-3 py-3 items-center hover:bg-accent hover:text-accent-foreground rounded-md font-medium"
              reloadDocument
            >
              <FlagIcon
                size={24}
                className={
                  location.pathname === "/requests" ? "text-primary" : ""
                }
              />
              <span>Requests</span>
            </Link>
          </SheetPrimitive.Close>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Hamburger;
