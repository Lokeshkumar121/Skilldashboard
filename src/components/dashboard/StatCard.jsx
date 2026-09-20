import React from "react";

const StatCard = ({
  title,
  value,
  change,
  description,
  icon: Icon,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h3 className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </h3>

        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Icon className="h-5 w-5" />
        </div>

      </div>

      <div className="mt-4 flex items-center gap-2">

        <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-600">
          {change}
        </span>

        <span className="text-xs text-slate-400">
          {description}
        </span>

      </div>

    </div>
  );
};

export default StatCard;