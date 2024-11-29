import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";
import UserAvatar from "./UserAvatar";
import Notification from "./Notification";
import Hamburger from "./Hamburger";
import { Button } from "./ui/button";
import {
  ClipboardListIcon,
  FlagIcon,
  GaugeCircleIcon,
  TargetIcon,
} from "lucide-react";
import { Gear } from "@phosphor-icons/react";
import { FullScaleIcon } from "./icons/FullScaleIcon";
import { useUserContext } from "@/hooks/useUserData";
import VersionBadge from "./VersionBadge";

const NavigationBar = () => {
  const { user: userData } = useUserContext();
  const isDevMode = import.meta.env.DEV;

  return (
    <section className="flex w-full justify-between py-6 px-6 z-0">
      <div className="flex items-center justify-center">
        <NavigationMenu>
          <NavigationMenuList className="gap-1">
            <NavigationMenuItem className="inline sm:hidden">
              <Hamburger />
            </NavigationMenuItem>
            <NavigationMenuItem className="flex items-center">
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
                <FullScaleIcon
                  size={36}
                  className="fill-current text-primary"
                />
                <span className="text-2xl pr-1 font-bold tracking-tighter text-secondary-foreground">
                  stockpilot
                </span>
                {isDevMode && <VersionBadge />}
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="hidden sm:flex items-center justify-center">
        <NavigationMenu>
          <NavigationMenuList className="space-x-0 xl:space-x-3">
            <Link
              to="/dashboard"
              className={`${
                location.pathname.startsWith("/dashboard")
                  ? "bg-secondary"
                  : "bg-none"
              }  rounded-r-none rounded-l-xl xl:rounded-full hover:bg-secondary hover:text-secondary-foreground text-secondary-foreground border border-t-2 border-b-2 border-l-2 xl:border-2 font-semibold text-md flex gap-2 items-center focus-visible:outline outline-offset-2 outline-2 outline-primary px-3.5 py-1.5`}
              style={{ textDecoration: "none" }}
            >
              <GaugeCircleIcon
                className={
                  location.pathname.startsWith("/dashboard")
                    ? "text-primary"
                    : ""
                }
              />
              <span className="hidden lg:inline-block">Dashboard</span>
            </Link>
            <Link
              to="/inventory"
              className={`${
                location.pathname.startsWith("/inventory")
                  ? "bg-secondary"
                  : "bg-none"
              } rounded-none xl:rounded-full hover:bg-secondary hover:text-secondary-foreground text-secondary-foreground border border-t-2 border-b-2 xl:border-2 font-semibold text-md flex gap-2 items-center focus-visible:outline outline-offset-2 outline-2 outline-primary px-3.5 py-1.5`}
              style={{ textDecoration: "none" }}
            >
              <ClipboardListIcon
                className={
                  location.pathname.startsWith("/inventory")
                    ? "text-primary"
                    : ""
                }
              />
              <span className="hidden lg:inline-block">Inventory</span>
            </Link>
            <Link
              to="/tracker"
              className={`${
                location.pathname.startsWith("/tracker")
                  ? "bg-secondary"
                  : "bg-none"
              } rounded-none xl:rounded-full hover:bg-secondary hover:text-secondary-foreground text-secondary-foreground border border-t-2 border-b-2 xl:border-2 font-semibold text-md flex gap-2 items-center focus-visible:outline outline-offset-2 outline-2 outline-primary px-3.5 py-1.5`}
              style={{ textDecoration: "none" }}
            >
              <TargetIcon
                className={
                  location.pathname.startsWith("/tracker") ? "text-primary" : ""
                }
              />
              <span className="hidden lg:inline-block">Tracker</span>
            </Link>
            <Link
              to="/requests"
              className={`${
                location.pathname.startsWith("/requests")
                  ? "bg-secondary"
                  : "bg-none"
              } rounded-none xl:rounded-full hover:bg-secondary hover:text-secondary-foreground text-secondary-foreground border border-t-2 border-b-2 xl:border-2 font-semibold text-md flex gap-2 items-center focus-visible:outline outline-offset-2 outline-2 outline-primary px-3.5 py-1.5`}
              style={{ textDecoration: "none" }}
            >
              <FlagIcon
                className={
                  location.pathname.startsWith("/requests")
                    ? "text-primary"
                    : ""
                }
              />
              <span className="hidden lg:inline-block">Requests</span>
            </Link>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="flex items-center justify-center">
        <NavigationMenu>
          <NavigationMenuList className="gap-1 hidden md:flex">
            <NavigationMenuItem className="justify-center flex">
              <Button
                asChild
                size="icon"
                className="rounded-xl"
                variant="secondary"
              >
                <Link to="/settings">
                  <Gear weight="fill" size={28} />
                </Link>
              </Button>
            </NavigationMenuItem>
            <NavigationMenuItem className="justify-center flex">
              <Notification />
            </NavigationMenuItem>
          </NavigationMenuList>
          <NavigationMenuList className="ml-4">
            <NavigationMenuItem>
              <UserAvatar userInfo={userData} />
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </section>
  );
};

export default NavigationBar;
