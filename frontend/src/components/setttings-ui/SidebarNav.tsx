import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
interface SidebarNavProps {
  className?: any;
  items: {
    href: string;
    title: string;
  }[];
}

const SidebarNav = ({ className, items, ...props }: SidebarNavProps) => {
  const location = useLocation();
  const pathname = location.pathname;
  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className
      )}
      {...props}
      x-chunk="dashboard-04-chunk-0"
    >
      {items.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "flex w-full  font-semibold items-center rounded-md p-2 hover:underline",
            {
              "bg-muted": pathname === item.href,
            },
            "justify-start"
          )}
        >
          {item.title}
        </NavLink>
      ))}
    </nav>
  );
};

export default SidebarNav;
