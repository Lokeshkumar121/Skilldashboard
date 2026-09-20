import React from "react";
import { ArrowRight } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import EmptyState from "../common/EmptyState";

const RecentEnquiries = ({ enquiries = [] }) => {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5">

        <div>
          <h2 className="font-bold text-slate-900">
            Recent Student Enquiries
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Latest requests from students
          </p>
        </div>

        <a
          href="/contacts"
          className="flex items-center gap-1 text-sm font-semibold text-blue-600"
        >
          View All
          <ArrowRight className="h-4 w-4" />
        </a>

      </div>


      {enquiries.length === 0 ? (
        <EmptyState
          title="No enquiries yet"
          description="Student enquiries will appear here."
        />
      ) : (
        <div className="overflow-x-auto">

          <table className="w-full min-w-[700px]">

            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">

                <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wider text-slate-400">
                  Student
                </th>

                <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wider text-slate-400">
                  Project
                </th>

                <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wider text-slate-400">
                  Location
                </th>

                <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wider text-slate-400">
                  Status
                </th>

              </tr>
            </thead>

            <tbody>

              {enquiries.map((item) => (

                <tr
                  key={item._id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60"
                >

                  <td className="px-5 py-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600">
                        {item.firstName?.[0]}
                        {item.lastName?.[0]}
                      </div>

                      <div>

                        <p className="text-sm font-semibold text-slate-800">
                          {item.firstName} {item.lastName}
                        </p>

                        <p className="text-xs text-slate-400">
                          {item.email}
                        </p>

                      </div>

                    </div>

                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {item.projectType || "—"}
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-500">
                    {item.city || "—"}
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge status={item.status} />
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>
      )}

    </section>
  );
};

export default RecentEnquiries;