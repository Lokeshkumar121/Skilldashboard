import React from "react";
import { FileText } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import EmptyState from "../common/EmptyState";

const RecentBlogs = ({ blogs = [] }) => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5">

        <div>
          <h2 className="font-bold text-slate-900">
            Recent Blogs
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Latest content
          </p>
        </div>

        <a
          href="/blogs"
          className="text-sm font-semibold text-blue-600"
        >
          View All
        </a>

      </div>

      {blogs.length === 0 ? (
        <EmptyState
          title="No blogs found"
          description="Create your first blog."
        />
      ) : (
        <div className="divide-y divide-slate-100">

          {blogs.map((blog) => (

            <div
              key={blog._id}
              className="flex items-center gap-4 px-5 py-4"
            >

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>

              <div className="min-w-0 flex-1">

                <h3 className="truncate text-sm font-semibold text-slate-800">
                  {blog.title}
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  {blog.categories?.join(", ") || "No category"}
                </p>

              </div>

              <StatusBadge status={blog.status} />

            </div>

          ))}

        </div>
      )}

    </section>
  );
};

export default RecentBlogs;