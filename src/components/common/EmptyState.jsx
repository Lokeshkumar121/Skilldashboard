import React from "react";
import { Inbox } from "lucide-react";

const EmptyState = ({
  title = "No data found",
  description = "There is nothing to display here.",
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">

      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
        <Inbox className="h-6 w-6 text-slate-400" />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-slate-800">
        {title}
      </h3>

      <p className="mt-1 max-w-sm text-xs text-slate-400">
        {description}
      </p>

    </div>
  );
};

export default EmptyState;