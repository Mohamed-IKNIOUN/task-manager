import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
} from "lucide-react";

function Sidebar() {
  const links = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Projects", path: "/projects", icon: FolderKanban },
    { name: "Tasks", path: "/tasks", icon: CheckSquare },
  ];

  return (
    <aside className="flex min-h-screen w-64 flex-col bg-slate-900 px-5 py-7 text-white">
      <h1 className="mb-10 text-xl font-bold tracking-wide">
        Task<span className="text-indigo-400">Manager</span>
      </h1>

      <nav className="flex flex-col gap-2">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon size={19} />
              {link.name}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto text-xs text-slate-500">
        TaskFlow · Project Management
      </div>
    </aside>
  );
}

export default Sidebar;