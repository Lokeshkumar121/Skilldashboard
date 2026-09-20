import React, { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  FileText,
  Pencil,
  Eye,
} from "lucide-react";

import { Link } from "react-router-dom";

import {
  getBlogs,
  deleteBlog,
} from "../../services/blogService";

import StatusBadge from "../../components/common/StatusBadge";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBlogs = async () => {
    try {
      const response = await getBlogs();

      setBlogs(
        response.data?.data ||
        response.data?.blogs ||
        []
      );
    } catch (error) {
      console.error("Blogs error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this blog?"
    );

    if (!confirmed) return;

    try {
      await deleteBlog(id);

      setBlogs((prev) =>
        prev.filter((blog) => blog._id !== id)
      );
    } catch (error) {
      console.error(error);

      alert("Unable to delete blog.");
    }
  };

  if (loading) {
    return <Loader text="Loading blogs..." />;
  }

  return (
    <div>

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Blogs
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage SkillPilot articles and resources.
          </p>
        </div>

        <Link
          to="/blogs/create"
          className="flex w-fit items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          New Blog
        </Link>

      </div>

      {/* Blog Table */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">

        {blogs.length === 0 ? (

          <EmptyState
            title="No blogs found"
            description="Create your first SkillPilot blog."
          />

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[800px]">

              <thead>

                <tr className="border-b border-slate-100 bg-slate-50">

                  <th className="px-5 py-4 text-left text-xs font-semibold text-slate-400">
                    Blog
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold text-slate-400">
                    Categories
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold text-slate-400">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold text-slate-400">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {blogs.map((blog) => (

                  <tr
                    key={blog._id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70"
                  >

                    {/* Blog */}
                    <td className="px-5 py-4">

                      <Link
                        to={`/blogs/${blog._id}`}
                        className="flex items-center gap-3"
                      >

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                          <FileText className="h-4 w-4 text-blue-600" />
                        </div>

                        <div>

                          <p className="max-w-[350px] truncate text-sm font-semibold text-slate-800 hover:text-blue-600">
                            {blog.title}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            /{blog.slug}
                          </p>

                        </div>

                      </Link>

                    </td>

                    {/* Categories */}
                    <td className="px-5 py-4 text-sm text-slate-500">
                      {blog.categories?.join(", ") || "—"}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <StatusBadge status={blog.status} />
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">

                      <div className="flex items-center justify-end gap-2">

                        {/* View */}
                        <Link
                          to={`/blogs/${blog._id}`}
                          title="View Blog"
                          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-blue-600"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>

                        {/* Edit */}
                        <Link
                          to={`/blogs/${blog._id}/edit`}
                          title="Edit Blog"
                          className="rounded-lg p-2 text-blue-500 hover:bg-blue-50"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>

                        {/* Delete */}
                        <button
                          onClick={() =>
                            handleDelete(blog._id)
                          }
                          title="Delete Blog"
                          className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
};

export default Blogs;