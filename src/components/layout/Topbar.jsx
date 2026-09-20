import React from "react";
import {
  Menu,
  Search,
  Bell,
} from "lucide-react";

const Topbar = ({ onMenuClick }) => {
  return (
    <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">

      <div className="flex items-center gap-3">

        <button
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 lg:hidden"
        >
          <Menu className="h-5 w-5 text-slate-600" />
        </button>

        <div>
          <h2 className="text-lg font-bold text-slate-900">
            SkillPilot Admin
          </h2>

          <p className="hidden text-xs text-slate-400 sm:block">
            Manage your platform
          </p>
        </div>

      </div>


      <div className="flex items-center gap-3">

        <button className="hidden h-10 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm text-slate-400 md:flex">
          <Search className="h-4 w-4" />

          Search

          <span className="ml-4 rounded bg-slate-100 px-2 py-0.5 text-[10px]">
            ⌘ K
          </span>
        </button>


        <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200">
          <Bell className="h-4 w-4 text-slate-500" />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>


        <div className="hidden h-10 items-center gap-2 rounded-xl border border-slate-200 px-2 sm:flex">

          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-xs font-bold text-blue-600">
            LK
          </div>

          <span className="pr-2 text-sm font-medium">
            Admin
          </span>

        </div>

      </div>

    </header>
  );
};

export default Topbar;