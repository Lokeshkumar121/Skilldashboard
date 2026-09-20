import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  X,
  Image as ImageIcon,
  Plus,
  Loader2,
  Save,
  Pencil,
} from "lucide-react";

import api from "../../services/api";

const CATEGORIES = [
  "Web Development",
  "Mobile App Development",
  "AI & Machine Learning",
  "Data Science",
  "Python Projects",
  "Java Projects",
  "MERN Stack",
  "IoT Projects",
  "Blockchain & Web3",
  "Cyber Security",
  "Cloud & DevOps",
  "Final Year Projects",
  "Mini Projects",
  "Project Consultation",
  "Career Guidance",
  "Internship Guidance",
  "Placement Preparation",
  "DSA & Interview Preparation",
  "Project Documentation",
  "Project Ideas & Tutorials",
];

const CreateBlog = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    author: "",
    readTime: "",
    status: "draft",
  });

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  // New images
  const [coverImage, setCoverImage] = useState(null);
  const [contentImages, setContentImages] = useState([]);

  // Existing images from ImageKit
  const [existingCoverImage, setExistingCoverImage] = useState(null);
  const [existingContentImages, setExistingContentImages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingBlog, setLoadingBlog] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ----------------------------------
  // Load old blog in edit mode
  // ----------------------------------
  useEffect(() => {
    if (!isEditMode) return;

    const loadBlog = async () => {
      try {
        setLoadingBlog(true);
        setError("");

        const response = await api.get("/blogs");

        const blogs =
          response.data?.data ||
          response.data?.blogs ||
          [];

        const blog = blogs.find(
          (item) => item._id === id
        );

        if (!blog) {
          setError("Blog not found.");
          return;
        }

        setFormData({
          title: blog.title || "",
          slug: blog.slug || "",
          excerpt: blog.excerpt || "",
          content: blog.content || "",
          author: blog.author || "",
          readTime: blog.readTime || "",
          status: blog.status || "draft",
        });

        setSelectedCategories(
          blog.categories || []
        );

        setTags(blog.tags || []);

        setExistingCoverImage(
          blog.coverImage || null
        );

        setExistingContentImages(
          blog.contentImages || []
        );
      } catch (err) {
        console.error("Load blog error:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load blog."
        );
      } finally {
        setLoadingBlog(false);
      }
    };

    loadBlog();
  }, [id, isEditMode]);

  // ----------------------------------
  // Handle normal inputs
  // ----------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ----------------------------------
  // Generate slug
  // ----------------------------------
  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-");

    setFormData((prev) => ({
      ...prev,
      slug,
    }));
  };

  // ----------------------------------
  // Category select
  // ----------------------------------
  const toggleCategory = (category) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter(
          (item) => item !== category
        );
      }

      return [...prev, category];
    });
  };

  // ----------------------------------
  // Tags
  // ----------------------------------
  const addTag = () => {
    const value = tagInput.trim();

    if (!value) return;

    if (!tags.includes(value)) {
      setTags((prev) => [...prev, value]);
    }

    setTagInput("");
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const removeTag = (tag) => {
    setTags((prev) =>
      prev.filter((item) => item !== tag)
    );
  };

  // ----------------------------------
  // Cover Image
  // ----------------------------------
  const handleCoverImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setCoverImage(file);

    // New image selected, old image is replaced
    setExistingCoverImage(null);
  };

  const removeNewCoverImage = () => {
    setCoverImage(null);
  };

  // ----------------------------------
  // Existing Cover Image
  // ----------------------------------
  const removeExistingCoverImage = () => {
    setExistingCoverImage(null);
  };

  // ----------------------------------
  // Content Images
  // ----------------------------------
  const handleContentImages = (e) => {
    const files = Array.from(
      e.target.files || []
    );

    if (!files.length) return;

    setContentImages((prev) => [
      ...prev,
      ...files,
    ]);
  };

  const removeContentImage = (index) => {
    setContentImages((prev) =>
      prev.filter(
        (_, imageIndex) => imageIndex !== index
      )
    );
  };

  // ----------------------------------
  // Existing Content Images
  // ----------------------------------
  const removeExistingContentImage = (index) => {
    setExistingContentImages((prev) =>
      prev.filter(
        (_, imageIndex) => imageIndex !== index
      )
    );
  };

  // ----------------------------------
  // Submit
  // ----------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Basic validation
    if (!formData.title.trim()) {
      setError("Blog title is required.");
      return;
    }

    if (!formData.content.trim()) {
      setError("Blog content is required.");
      return;
    }

    if (!selectedCategories.length) {
      setError(
        "Please select at least one category."
      );
      return;
    }

    // Cover required only when creating
    // During edit, old cover can remain
    if (
      !coverImage &&
      !existingCoverImage
    ) {
      setError("Please select a cover image.");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append("title", formData.title);
      data.append("slug", formData.slug);
      data.append("excerpt", formData.excerpt);
      data.append("content", formData.content);
      data.append("author", formData.author);
      data.append("readTime", formData.readTime);
      data.append("status", formData.status);

      // Multiple categories
      selectedCategories.forEach((category) => {
        data.append(
          "categories",
          category
        );
      });

      // Multiple tags
      tags.forEach((tag) => {
        data.append("tags", tag);
      });

      // ----------------------------------
      // Cover Image
      // ----------------------------------
      if (coverImage) {
        data.append(
          "coverImage",
          coverImage
        );
      }

      // ----------------------------------
      // Existing Content Images
      // Send fileIds that should remain
      // ----------------------------------
      existingContentImages.forEach(
        (image) => {
          if (image.fileId) {
            data.append(
              "existingContentImageFileIds",
              image.fileId
            );
          }
        }
      );

      // ----------------------------------
      // New Content Images
      // ----------------------------------
      contentImages.forEach((image) => {
        data.append(
          "contentImages",
          image
        );
      });

      let response;

      if (isEditMode) {
        response = await api.patch(
          `/blogs/${id}`,
          data,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        console.log(
          "Blog updated:",
          response.data
        );

        setSuccess(
          "Blog updated successfully."
        );
      } else {
        response = await api.post(
          "/blogs",
          data,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        console.log(
          "Blog created:",
          response.data
        );

        setSuccess(
          "Blog created successfully."
        );
      }

      setTimeout(() => {
        navigate("/blogs");
      }, 1000);
    } catch (err) {
      console.error(
        isEditMode
          ? "Update blog error:"
          : "Create blog error:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          `Failed to ${
            isEditMode
              ? "update"
              : "create"
          } blog. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------
  // Loading old blog
  // ----------------------------------
  if (isEditMode && loadingBlog) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <Loader2
            size={20}
            className="animate-spin"
          />
          Loading blog...
        </div>
      </div>
    );
  }

  return (
    <div className="pb-10">

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <button
            type="button"
            onClick={() =>
              navigate("/blogs")
            }
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft size={17} />
            Back to Blogs
          </button>

          <h1 className="text-2xl font-bold text-slate-900">
            {isEditMode
              ? "Edit Blog"
              : "Create Blog"}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            {isEditMode
              ? "Update your SkillPilot article."
              : "Create and publish a new SkillPilot article."}
          </p>

        </div>

      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        {/* Basic Information */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">

          <div className="mb-6">

            <h2 className="text-lg font-semibold text-slate-900">
              Basic Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add the main information about your blog.
            </p>

          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

            {/* Title */}
            <div className="lg:col-span-2">

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Blog Title *
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Best Final Year Project Ideas for CSE Students"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            {/* Slug */}
            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Slug
              </label>

              <div className="flex gap-2">

                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="final-year-project-ideas"
                  className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <button
                  type="button"
                  onClick={generateSlug}
                  className="rounded-xl bg-slate-100 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
                >
                  Generate
                </button>

              </div>

            </div>

            {/* Author */}
            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Author
              </label>

              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="SkillPilot Team"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            {/* Read Time */}
            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Read Time
              </label>

              <input
                type="text"
                name="readTime"
                value={formData.readTime}
                onChange={handleChange}
                placeholder="5 min read"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            {/* Status */}
            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="draft">
                  Draft
                </option>

                <option value="published">
                  Published
                </option>
              </select>

            </div>

            {/* Excerpt */}
            <div className="lg:col-span-2">

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Short Description / Excerpt
              </label>

              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows={4}
                placeholder="Write a short description of the blog..."
                className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

          </div>

        </div>

        {/* Categories */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">

          <div className="mb-5">

            <h2 className="text-lg font-semibold text-slate-900">
              Categories
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              You can select multiple categories for one blog.
            </p>

          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {CATEGORIES.map((category) => {

              const selected =
                selectedCategories.includes(
                  category
                );

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    toggleCategory(category)
                  }
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${
                    selected
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >

                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                      selected
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-slate-300"
                    }`}
                  >

                    {selected && (
                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-3.5 w-3.5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.704 5.29a1 1 0 010 1.42l-7.25 7.25a1 1 0 01-1.415.005l-3.25-3.15a1 1 0 011.392-1.435l2.542 2.464 6.545-6.554a1 1 0 01.436 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}

                  </span>

                  <span>
                    {category}
                  </span>

                </button>
              );
            })}

          </div>

          {selectedCategories.length > 0 && (
            <div className="mt-5 rounded-xl bg-slate-50 p-4">

              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Selected Categories
              </p>

              <div className="mt-3 flex flex-wrap gap-2">

                {selectedCategories.map(
                  (category) => (
                    <span
                      key={category}
                      className="rounded-full bg-blue-100 px-3 py-1.5 text-xs font-medium text-blue-700"
                    >
                      {category}
                    </span>
                  )
                )}

              </div>

            </div>
          )}

        </div>

        {/* Tags */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">

          <div className="mb-5">

            <h2 className="text-lg font-semibold text-slate-900">
              Tags
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add tags and press Enter.
            </p>

          </div>

          <div className="flex gap-2">

            <input
              type="text"
              value={tagInput}
              onChange={(e) =>
                setTagInput(e.target.value)
              }
              onKeyDown={
                handleTagKeyDown
              }
              placeholder="e.g. React, JavaScript, Final Year"
              className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <button
              type="button"
              onClick={addTag}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              <Plus size={17} />
              Add
            </button>

          </div>

          {tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">

              {tags.map((tag) => (

                <span
                  key={tag}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700"
                >

                  {tag}

                  <button
                    type="button"
                    onClick={() =>
                      removeTag(tag)
                    }
                    className="text-slate-400 transition hover:text-red-500"
                  >
                    <X size={14} />
                  </button>

                </span>

              ))}

            </div>
          )}

        </div>

        {/* Content */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">

          <div className="mb-5">

            <h2 className="text-lg font-semibold text-slate-900">
              Blog Content
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Write the complete article content.
            </p>

          </div>

          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={18}
            placeholder="Write your complete blog content here..."
            className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-sm leading-7 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

        </div>

        {/* Cover Image */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">

          <div className="mb-5">

            <h2 className="text-lg font-semibold text-slate-900">
              Cover Image
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Select the main image for this blog.
            </p>

          </div>

          {/* New Cover */}
          {coverImage ? (

            <div className="relative overflow-hidden rounded-2xl border border-slate-200">

              <img
                src={URL.createObjectURL(
                  coverImage
                )}
                alt="Cover preview"
                className="h-72 w-full object-cover"
              />

              <button
                type="button"
                onClick={
                  removeNewCoverImage
                }
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-700 shadow-md transition hover:text-red-600"
              >
                <X size={18} />
              </button>

            </div>

          ) : existingCoverImage ? (

            <div className="relative overflow-hidden rounded-2xl border border-slate-200">

              <img
                src={
                  existingCoverImage.url
                }
                alt="Existing cover"
                className="h-72 w-full object-cover"
              />

              <div className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
                Existing Image
              </div>

              <button
                type="button"
                onClick={
                  removeExistingCoverImage
                }
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-700 shadow-md transition hover:text-red-600"
              >
                <X size={18} />
              </button>

            </div>

          ) : (

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 px-6 py-12 text-center transition hover:border-blue-400 hover:bg-blue-50/40">

              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <Upload size={24} />
              </div>

              <p className="text-sm font-semibold text-slate-800">
                Click to upload cover image
              </p>

              <p className="mt-1 text-xs text-slate-500">
                JPG, JPEG, PNG, WEBP or GIF — max 5MB
              </p>

              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                onChange={
                  handleCoverImage
                }
                className="hidden"
              />

            </label>

          )}

          {/* If old cover was removed */}
          {!coverImage &&
            !existingCoverImage &&
            isEditMode && (
              <label className="mt-4 flex cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100">

                <Upload
                  size={17}
                  className="mr-2"
                />

                Select New Cover Image

                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  onChange={
                    handleCoverImage
                  }
                  className="hidden"
                />

              </label>
            )}

        </div>

        {/* Content Images */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">

          <div className="mb-5">

            <h2 className="text-lg font-semibold text-slate-900">
              Content Images
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Select multiple images to use inside your article.
            </p>

          </div>

          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 px-6 py-10 text-center transition hover:border-blue-400 hover:bg-blue-50/40">

            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-600">
              <ImageIcon size={24} />
            </div>

            <p className="text-sm font-semibold text-slate-800">
              Select content images
            </p>

            <p className="mt-1 text-xs text-slate-500">
              You can select multiple images
            </p>

            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
              multiple
              onChange={
                handleContentImages
              }
              className="hidden"
            />

          </label>

          {/* Existing images */}
          {existingContentImages.length >
            0 && (

            <div className="mt-6">

              <p className="mb-3 text-sm font-medium text-slate-700">
                Existing Images
              </p>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">

                {existingContentImages.map(
                  (image, index) => (

                    <div
                      key={
                        image.fileId ||
                        `${image.url}-${index}`
                      }
                      className="group relative overflow-hidden rounded-xl border border-slate-200"
                    >

                      <img
                        src={image.url}
                        alt={`Existing content ${index + 1}`}
                        className="h-36 w-full object-cover"
                      />

                      <div className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-1 text-[10px] font-medium text-white">
                        Existing
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeExistingContentImage(
                            index
                          )
                        }
                        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-700 opacity-0 shadow transition group-hover:opacity-100 hover:text-red-600"
                      >
                        <X size={16} />
                      </button>

                    </div>

                  )
                )}

              </div>

            </div>

          )}

          {/* New images */}
          {contentImages.length > 0 && (

            <div className="mt-6">

              <p className="mb-3 text-sm font-medium text-slate-700">
                New Images
              </p>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">

                {contentImages.map(
                  (image, index) => (

                    <div
                      key={`${image.name}-${index}`}
                      className="group relative overflow-hidden rounded-xl border border-slate-200"
                    >

                      <img
                        src={URL.createObjectURL(
                          image
                        )}
                        alt={image.name}
                        className="h-36 w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeContentImage(
                            index
                          )
                        }
                        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-700 opacity-0 shadow transition group-hover:opacity-100 hover:text-red-600"
                      >
                        <X size={16} />
                      </button>

                      <div className="truncate bg-white px-3 py-2 text-xs text-slate-500">
                        {image.name}
                      </div>

                    </div>

                  )
                )}

              </div>

            </div>

          )}

        </div>

        {/* Submit */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

          <button
            type="button"
            onClick={() =>
              navigate("/blogs")
            }
            disabled={loading}
            className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >

            {loading ? (

              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />

                {isEditMode
                  ? "Updating Blog..."
                  : "Creating Blog..."}
              </>

            ) : (

              <>
                {isEditMode ? (
                  <Pencil size={18} />
                ) : (
                  <Save size={18} />
                )}

                {isEditMode
                  ? "Update Blog"
                  : "Create Blog"}
              </>

            )}

          </button>

        </div>

      </form>
    </div>
  );
};

export default CreateBlog;