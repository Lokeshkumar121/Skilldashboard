import React from "react";
import { BookOpen } from "lucide-react";
import EmptyState from "../common/EmptyState";

const RecentCaseStudies = ({ caseStudies = [] }) => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5">

        <div>
          <h2 className="font-bold text-slate-900">
            Recent Case Studies
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Latest project work
          </p>
        </div>

        <a
          href="/case-studies"
          className="text-sm font-semibold text-blue-600"
        >
          View All
        </a>

      </div>

      {caseStudies.length === 0 ? (
        <EmptyState
          title="No case studies"
          description="Create your first case study."
        />
      ) : (
        <div className="divide-y divide-slate-100">

          {caseStudies.map((study) => (

            <div
              key={study._id}
              className="flex gap-3 px-5 py-4"
            >

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50">
                <BookOpen className="h-5 w-5 text-purple-600" />
              </div>

              <div>

                <h3 className="text-sm font-semibold text-slate-800">
                  {study.title}
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  {study.categories?.join(", ") || "No category"}
                </p>

              </div>

            </div>

          ))}

        </div>
      )}

    </section>
  );
};

export default RecentCaseStudies;