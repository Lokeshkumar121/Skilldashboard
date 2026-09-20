import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Tag,
  Trash2,
  Edit3,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { getBlogs, deleteBlog } from "../../services/blogService";

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState("");

  // ----------------------------------
  // Fetch Blog
  // ----------------------------------
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getBlogs();

        const blogs =
          response.data?.data ||
          response.data?.blogs ||
          [];

        const foundBlog = blogs.find(
          (item) =>
            String(item._id || item.id) === String(id)
        );

        if (!foundBlog) {
          setError("Blog not found.");
          return;
        }

        setBlog(foundBlog);
      } catch (err) {
        console.error("Fetch blog error:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load blog details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  // ----------------------------------
  // Delete Blog
  // ----------------------------------
  const handleDelete = async () => {
    if (!blog) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this blog?"
    );

    if (!confirmed) return;

    try {
      setDeleteLoading(true);

      await deleteBlog(blog._id || blog.id);

      navigate("/blogs");
    } catch (err) {
      console.error("Delete blog error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to delete blog."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  // ----------------------------------
  // Loading
  // ----------------------------------
  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2
            size={32}
            className="animate-spin text-blue-600"
          />

          <p className="text-sm text-slate-500">
            Loading blog details...
          </p>
        </div>
      </div>
    );
  }

  // ----------------------------------
  // Error
  // ----------------------------------
  if (error || !blog) {
    return (
      <div>
        <button
          type="button"
          onClick={() => navigate("/blogs")}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft size={17} />
          Back to Blogs
        </button>

        <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-6 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
            <AlertCircle size={28} />
          </div>

          <h2 className="text-lg font-semibold text-slate-900">
            Blog Not Found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {error || "The requested blog could not be found."}
          </p>

          <button
            type="button"
            onClick={() => navigate("/blogs")}
            className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  const blogId = blog._id || blog.id;

  const coverImage =
    blog.coverImage?.url ||
    blog.coverImage ||
    "";

  const contentImages = Array.isArray(blog.contentImages)
    ? blog.contentImages
    : [];

  const categories = Array.isArray(blog.categories)
    ? blog.categories
    : [];

  const tags = Array.isArray(blog.tags)
    ? blog.tags
    : [];

  // ----------------------------------
  // Date formatter
  // ----------------------------------
  const formatDate = (date) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="pb-10">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigate("/blogs")}
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft size={17} />
            Back to Blogs
          </button>

          <h1 className="text-2xl font-bold text-slate-900">
            Blog Details
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            View complete information about this blog.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(`/blogs/${blogId}/edit`)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <Edit3 size={17} />
            Edit
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteLoading}
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleteLoading ? (
              <Loader2
                size={17}
                className="animate-spin"
              />
            ) : (
              <Trash2 size={17} />
            )}

            {deleteLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        {/* Left */}
        <div className="space-y-6">
          {/* Blog Header */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {/* Cover Image */}
            {coverImage ? (
              <img
                src={coverImage}
                alt={blog.title}
                className="h-[280px] w-full object-cover sm:h-[380px]"
              />
            ) : (
              <div className="flex h-[280px] w-full items-center justify-center bg-slate-100 text-slate-400 sm:h-[380px]">
                <div className="flex flex-col items-center gap-2">
                  <ImageIcon size={40} />
                  <span className="text-sm">
                    No cover image
                  </span>
                </div>
              </div>
            )}

            <div className="p-6 sm:p-8">
              {/* Categories */}
              {categories.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <span
                      key={category}
                      className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              )}

              {/* Title */}
              <h2 className="text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
                {blog.title}
              </h2>

              {/* Excerpt */}
              {blog.excerpt && (
                <p className="mt-4 text-base leading-7 text-slate-600">
                  {blog.excerpt}
                </p>
              )}

              {/* Meta */}
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-slate-100 pt-5">
                {blog.author && (
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <User
                      size={16}
                      className="text-slate-400"
                    />
                    <span>{blog.author}</span>
                  </div>
                )}

                {blog.readTime && (
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Clock
                      size={16}
                      className="text-slate-400"
                    />
                    <span>{blog.readTime}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Calendar
                    size={16}
                    className="text-slate-400"
                  />
                  <span>
                    {formatDate(
                      blog.publishedAt || blog.createdAt
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Blog Content */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <h3 className="mb-5 text-lg font-semibold text-slate-900">
              Blog Content
            </h3>

            <div className="whitespace-pre-wrap text-[15px] leading-8 text-slate-700">
              {blog.content || "No content available."}
            </div>
          </div>

          {/* Content Images */}
          {contentImages.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
              <div className="mb-5">
                <h3 className="text-lg font-semibold text-slate-900">
                  Content Images
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Images uploaded with this article.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {contentImages.map((image, index) => {
                  const imageUrl =
                    image?.url || image;

                  return (
                    <div
                      key={`${imageUrl}-${index}`}
                      className="overflow-hidden rounded-xl border border-slate-200"
                    >
                      <img
                        src={imageUrl}
                        alt={`${blog.title} ${index + 1}`}
                        className="h-56 w-full object-cover transition hover:scale-[1.02]"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-sm font-semibold text-slate-900">
              Publication Status
            </h3>

            <div className="mt-4">
              {blog.status === "published" ? (
                <span className="inline-flex rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                  Published
                </span>
              ) : (
                <span className="inline-flex rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                  Draft
                </span>
              )}
            </div>
          </div>

          {/* Blog Information */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-sm font-semibold text-slate-900">
              Blog Information
            </h3>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Slug
                </p>

                <p className="mt-1 break-all text-sm text-slate-700">
                  {blog.slug || "Not available"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Created
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {formatDate(blog.createdAt)}
                </p>
              </div>

              {blog.updatedAt && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Last Updated
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {formatDate(blog.updatedAt)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Categories */}
          {categories.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-center gap-2">
                <Tag
                  size={17}
                  className="text-blue-600"
                />

                <h3 className="text-sm font-semibold text-slate-900">
                  Categories
                </h3>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <span
                    key={category}
                    className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-center gap-2">
                <Tag
                  size={17}
                  className="text-slate-500"
                />

                <h3 className="text-sm font-semibold text-slate-900">
                  Tags
                </h3>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-600"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;