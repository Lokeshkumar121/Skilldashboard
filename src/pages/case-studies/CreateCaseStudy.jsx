import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  X,
  Image as ImageIcon,
  Plus,
  Loader2,
  Save,
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

const CreateCaseStudy = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    shortDescription: "",
    description: "",
    clientType: "",
    challenge: "",
    solution: "",
    result: "",
    status: "draft",
  });

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [technologyInput, setTechnologyInput] = useState("");

  const [features, setFeatures] = useState([]);
  const [featureInput, setFeatureInput] = useState("");

  const [coverImage, setCoverImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ----------------------------------
  // Normal inputs
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
  // Categories
  // ----------------------------------
  const toggleCategory = (category) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((item) => item !== category);
      }

      return [...prev, category];
    });
  };

  // ----------------------------------
  // Technologies
  // ----------------------------------
  const addTechnology = () => {
    const value = technologyInput.trim();

    if (!value) return;

    if (!technologies.includes(value)) {
      setTechnologies((prev) => [...prev, value]);
    }

    setTechnologyInput("");
  };

  const handleTechnologyKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTechnology();
    }
  };

  const removeTechnology = (technology) => {
    setTechnologies((prev) =>
      prev.filter((item) => item !== technology)
    );
  };

  // ----------------------------------
  // Features
  // ----------------------------------
  const addFeature = () => {
    const value = featureInput.trim();

    if (!value) return;

    if (!features.includes(value)) {
      setFeatures((prev) => [...prev, value]);
    }

    setFeatureInput("");
  };

  const handleFeatureKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addFeature();
    }
  };

  const removeFeature = (feature) => {
    setFeatures((prev) =>
      prev.filter((item) => item !== feature)
    );
  };

  // ----------------------------------
  // Cover image
  // ----------------------------------
  const handleCoverImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setCoverImage(file);
  };

  // ----------------------------------
  // Gallery images
  // ----------------------------------
  const handleGalleryImages = (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    setGalleryImages((prev) => {
      const combined = [...prev, ...files];

      return combined.slice(0, 20);
    });
  };

  const removeGalleryImage = (index) => {
    setGalleryImages((prev) =>
      prev.filter((_, imageIndex) => imageIndex !== index)
    );
  };

  // ----------------------------------
  // Submit
  // ----------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Validation
    if (!formData.title.trim()) {
      setError("Case study title is required.");
      return;
    }

    if (!formData.description.trim()) {
      setError("Case study description is required.");
      return;
    }

    if (!selectedCategories.length) {
      setError("Please select at least one category.");
      return;
    }

    if (!coverImage) {
      setError("Please select a cover image.");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      // Basic fields
      data.append("title", formData.title);
      data.append("slug", formData.slug);
      data.append(
        "shortDescription",
        formData.shortDescription
      );
      data.append("description", formData.description);
      data.append("clientType", formData.clientType);
      data.append("challenge", formData.challenge);
      data.append("solution", formData.solution);
      data.append("result", formData.result);
      data.append("status", formData.status);

      // Multiple categories
      selectedCategories.forEach((category) => {
        data.append("categories", category);
      });

      // Multiple technologies
      technologies.forEach((technology) => {
        data.append("technologies", technology);
      });

      // Multiple features
      features.forEach((feature) => {
        data.append("features", feature);
      });

      // Cover image
      data.append("coverImage", coverImage);

      // Multiple gallery images
      galleryImages.forEach((image) => {
        data.append("images", image);
      });

      const response = await api.post(
        "/case-studies",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(
        "Case study created:",
        response.data
      );

      setSuccess(
        "Case study created successfully."
      );

      setTimeout(() => {
        navigate("/case-studies");
      }, 1000);
    } catch (err) {
      console.error(
        "Create case study error:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to create case study. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-10">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() =>
              navigate("/case-studies")
            }
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft size={17} />

            Back to Case Studies
          </button>

          <h1 className="text-2xl font-bold text-slate-900">
            Create Case Study
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Add a new project case study to SkillPilot.
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
        {/* ---------------------------------- */}
        {/* Basic Information */}
        {/* ---------------------------------- */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Basic Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add the main information about the project.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* Title */}
            <div className="lg:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Case Study Title *
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. AI Based Student Management Platform"
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
                  placeholder="ai-student-management-platform"
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

            {/* Client Type */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Client Type
              </label>

              <input
                type="text"
                name="clientType"
                value={formData.clientType}
                onChange={handleChange}
                placeholder="e.g. College / Startup / Business"
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

            {/* Short Description */}
            <div className="lg:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Short Description
              </label>

              <textarea
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                rows={4}
                placeholder="Write a short summary of this case study..."
                className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Description */}
            <div className="lg:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Project Description *
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={8}
                placeholder="Describe the project in detail..."
                className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-sm leading-7 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>

        {/* ---------------------------------- */}
        {/* Categories */}
        {/* ---------------------------------- */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-900">
              Categories
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Select multiple categories for this case study.
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
                          d="M16.704 5.29a1 1 0 010 1.42l-7.25 7.25a1 1 0 01-1.415.005l-3.25-3.15a1 1 0 011.392-1.435l2.542 2.464 6.545-6.554a1 1 0 011.436 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </span>

                  <span>{category}</span>
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

        {/* ---------------------------------- */}
        {/* Technologies */}
        {/* ---------------------------------- */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-900">
              Technologies
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add all technologies used in this project.
            </p>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={technologyInput}
              onChange={(e) =>
                setTechnologyInput(
                  e.target.value
                )
              }
              onKeyDown={
                handleTechnologyKeyDown
              }
              placeholder="e.g. React.js"
              className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <button
              type="button"
              onClick={addTechnology}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              <Plus size={17} />
              Add
            </button>
          </div>

          {technologies.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {technologies.map(
                (technology) => (
                  <span
                    key={technology}
                    className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700"
                  >
                    {technology}

                    <button
                      type="button"
                      onClick={() =>
                        removeTechnology(
                          technology
                        )
                      }
                      className="text-blue-400 transition hover:text-red-500"
                    >
                      <X size={14} />
                    </button>
                  </span>
                )
              )}
            </div>
          )}
        </div>

        {/* ---------------------------------- */}
        {/* Features */}
        {/* ---------------------------------- */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-900">
              Project Features
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add the major features included in the project.
            </p>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={featureInput}
              onChange={(e) =>
                setFeatureInput(e.target.value)
              }
              onKeyDown={
                handleFeatureKeyDown
              }
              placeholder="e.g. Student Login System"
              className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <button
              type="button"
              onClick={addFeature}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              <Plus size={17} />
              Add
            </button>
          </div>

          {features.length > 0 && (
            <div className="mt-4 space-y-2">
              {features.map(
                (feature, index) => (
                  <div
                    key={feature}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-xs font-semibold text-slate-500">
                        {index + 1}
                      </span>

                      <span className="text-sm text-slate-700">
                        {feature}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        removeFeature(feature)
                      }
                      className="text-slate-400 transition hover:text-red-500"
                    >
                      <X size={17} />
                    </button>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* ---------------------------------- */}
        {/* Challenge / Solution / Result */}
        {/* ---------------------------------- */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Case Study Details
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Explain the problem, solution and outcome.
            </p>
          </div>

          <div className="space-y-5">
            {/* Challenge */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Challenge
              </label>

              <textarea
                name="challenge"
                value={formData.challenge}
                onChange={handleChange}
                rows={6}
                placeholder="What problem or challenge did the client/project have?"
                className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-sm leading-7 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Solution */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Solution
              </label>

              <textarea
                name="solution"
                value={formData.solution}
                onChange={handleChange}
                rows={6}
                placeholder="How did you solve the problem?"
                className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-sm leading-7 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Result */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Result
              </label>

              <textarea
                name="result"
                value={formData.result}
                onChange={handleChange}
                rows={6}
                placeholder="What was the final result or outcome?"
                className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-sm leading-7 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>

        {/* ---------------------------------- */}
        {/* Cover Image */}
        {/* ---------------------------------- */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-900">
              Cover Image
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Select the main image for this case study.
            </p>
          </div>

          {!coverImage ? (
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
                onChange={handleCoverImage}
                className="hidden"
              />
            </label>
          ) : (
            <div className="relative overflow-hidden rounded-2xl border border-slate-200">
              <img
                src={URL.createObjectURL(
                  coverImage
                )}
                alt="Case study cover preview"
                className="h-72 w-full object-cover"
              />

              <button
                type="button"
                onClick={() =>
                  setCoverImage(null)
                }
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-700 shadow-md transition hover:text-red-600"
              >
                <X size={18} />
              </button>
            </div>
          )}
        </div>

        {/* ---------------------------------- */}
        {/* Gallery Images */}
        {/* ---------------------------------- */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-900">
              Project Gallery
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Select multiple project images. Maximum 20 images.
            </p>
          </div>

          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 px-6 py-10 text-center transition hover:border-blue-400 hover:bg-blue-50/40">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-600">
              <ImageIcon size={24} />
            </div>

            <p className="text-sm font-semibold text-slate-800">
              Select project images
            </p>

            <p className="mt-1 text-xs text-slate-500">
              You can select multiple images
            </p>

            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
              multiple
              onChange={handleGalleryImages}
              className="hidden"
            />
          </label>

          {galleryImages.length > 0 && (
            <>
              <div className="mt-5 flex items-center justify-between">
                <p className="text-sm font-medium text-slate-700">
                  Selected Images
                </p>

                <p className="text-xs text-slate-500">
                  {galleryImages.length} / 20
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {galleryImages.map(
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
                          removeGalleryImage(
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
            </>
          )}
        </div>

        {/* ---------------------------------- */}
        {/* Submit */}
        {/* ---------------------------------- */}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() =>
              navigate("/case-studies")
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
                Creating Case Study...
              </>
            ) : (
              <>
                <Save size={18} />
                Create Case Study
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCaseStudy;