import React from "react";
import {
  FileText,
  BookOpen,
  FolderKanban,
  Tags,
} from "lucide-react";

const actions = [
  {
    title: "New Blog",
    subtitle: "Create article",
    icon: FileText,
    path: "/blogs/create",
  },
  {
    title: "Case Study",
    subtitle: "Add case study",
    icon: BookOpen,
    path: "/case-studies/create",
  },
  {
    title: "Project",
    subtitle: "Add project",
    icon: FolderKanban,
    path: "/projects",
  },
  {
    title: "Category",
    subtitle: "Manage categories",
    icon: Tags,
    path: "/project-categories",
  },
];

const QuickActions = () => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <h2 className="font-bold text-slate-900">
        Quick Actions
      </h2>

      <p className="mt-1 text-xs text-slate-400">
        Frequently used actions
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3">

        {actions.map((action) => {

          const Icon = action.icon;

          return (
            <a
              key={action.title}
              href={action.path}
              className="rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50/50"
            >

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                <Icon className="h-4 w-4 text-slate-600" />
              </div>

              <p className="mt-3 text-sm font-semibold text-slate-800">
                {action.title}
              </p>

              <p className="mt-0.5 text-[11px] text-slate-400">
                {action.subtitle}
              </p>

            </a>
          );
        })}

      </div>

    </section>
  );
};

export default QuickActions;