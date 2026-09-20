import React from "react";

const StatusBadge = ({ status }) => {

  const styles = {
    new: "bg-blue-50 text-blue-600",
    contacted: "bg-amber-50 text-amber-600",
    "in-progress": "bg-purple-50 text-purple-600",
    closed: "bg-emerald-50 text-emerald-600",

    published: "bg-emerald-50 text-emerald-600",
    draft: "bg-slate-100 text-slate-500",
  };

  const key = String(status || "").toLowerCase();

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        styles[key] || "bg-slate-100 text-slate-500"
      }`}
    >
      {status || "Unknown"}
    </span>
  );
};

export default StatusBadge;