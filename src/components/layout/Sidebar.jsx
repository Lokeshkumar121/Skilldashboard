import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Tags,
  FileText,
  BookOpen,
  MessageSquare,
  GraduationCap,
  Settings,
  X,
} from "lucide-react";

const menuItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Student Enquiries",
    path: "/contacts",
    icon: MessageSquare,
  },
  {
    label: "Projects",
    path: "/projects",
    icon: FolderKanban,
  },
  {
    label: "Project Categories",
    path: "/project-categories",
    icon: Tags,
  },
  {
    label: "Blogs",
    path: "/blogs",
    icon: FileText,
  },
  {
    label: "Case Studies",
    path: "/case-studies",
    icon: BookOpen,
  },
  {
    label: "Consultations",
    path: "/consultations",
    icon: MessageSquare,
  },
  {
    label: "Students",
    path: "/students",
    icon: GraduationCap,
  },
];

const Sidebar = ({ open, onClose }) => {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen w-[260px]
          flex-col border-r border-slate-200 bg-white
          transition-transform duration-300
          lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >

        {/* Logo */}

        <div className="flex h-[76px] items-center border-b border-slate-100 px-6">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold text-white">
              S
            </div>

            <div>
              <h1 className="font-bold text-slate-900">
                SkillPilot
              </h1>

              <p className="text-[11px] text-slate-400">
                Admin Dashboard
              </p>
            </div>

          </div>

          <button
            onClick={onClose}
            className="ml-auto lg:hidden"
          >
            <X className="h-5 w-5 text-slate-400" />
          </button>

        </div>


        {/* Navigation */}

        <div className="flex-1 overflow-y-auto px-4 py-6">

          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Main Menu
          </p>

          <nav className="space-y-1">

            {menuItems.map((item) => {

              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) => `
                    flex items-center gap-3 rounded-xl px-3 py-3
                    text-sm font-medium transition
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }
                  `}
                >

                  {({ isActive }) => (
                    <>
                      <span
                        className={`
                          flex h-8 w-8 items-center justify-center rounded-lg
                          ${
                            isActive
                              ? "bg-blue-600 text-white"
                              : "bg-slate-100 text-slate-500"
                          }
                        `}
                      >
                        <Icon className="h-4 w-4" />
                      </span>

                      {item.label}
                    </>
                  )}

                </NavLink>
              );
            })}

          </nav>


          <p className="mb-3 mt-8 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            System
          </p>

          <NavLink
            to="/settings"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-500 hover:bg-slate-50"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
              <Settings className="h-4 w-4" />
            </span>

            Settings
          </NavLink>

        </div>


        {/* Profile */}

        <div className="border-t border-slate-100 p-4">

          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
              LK
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">
                Admin
              </p>

              <p className="truncate text-xs text-slate-400">
                SkillPilot
              </p>
            </div>

          </div>

        </div>

      </aside>
    </>
  );
};

export default Sidebar;