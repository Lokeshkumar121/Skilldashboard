import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  User,
  Tag,
  Code2,
  CheckCircle2,
  Image as ImageIcon,
  Trash2,
  Edit3,
  Loader2,
  AlertCircle,
  Target,
  Lightbulb,
  Trophy,
} from "lucide-react";

import {
  getCaseStudies,
  deleteCaseStudy,
} from "../../services/caseStudyService";

const CaseStudyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [caseStudy, setCaseStudy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] =
    useState(false);
  const [error, setError] = useState("");

  // ----------------------------------
  // Fetch Case Study
  // ----------------------------------
  useEffect(() => {
    const fetchCaseStudy = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getCaseStudies();

        const caseStudies =
          response.data?.data ||
          response.data?.caseStudies ||
          [];

        const foundCaseStudy = caseStudies.find(
          (item) =>
            String(item._id || item.id) ===
            String(id)
        );

        if (!foundCaseStudy) {
          setError("Case study not found.");
          return;
        }

        setCaseStudy(foundCaseStudy);
      } catch (err) {
        console.error(
          "Fetch case study error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to load case study details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCaseStudy();
  }, [id]);

  // ----------------------------------
  // Delete Case Study
  // ----------------------------------
  const handleDelete = async () => {
    if (!caseStudy) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this case study?"
    );

    if (!confirmed) return;

    try {
      setDeleteLoading(true);

      await deleteCaseStudy(
        caseStudy._id || caseStudy.id
      );

      navigate("/case-studies");
    } catch (err) {
      console.error(
        "Delete case study error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to delete case study."
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
            Loading case study details...
          </p>
        </div>
      </div>
    );
  }

  // ----------------------------------
  // Error
  // ----------------------------------
  if (error || !caseStudy) {
    return (
      <div>
        <button
          type="button"
          onClick={() =>
            navigate("/case-studies")
          }
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft size={17} />
          Back to Case Studies
        </button>

        <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-6 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
            <AlertCircle size={28} />
          </div>

          <h2 className="text-lg font-semibold text-slate-900">
            Case Study Not Found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {error ||
              "The requested case study could not be found."}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/case-studies")
            }
            className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Back to Case Studies
          </button>
        </div>
      </div>
    );
  }

  const caseStudyId =
    caseStudy._id || caseStudy.id;

  // ----------------------------------
  // Data
  // ----------------------------------

  const coverImage =
    caseStudy.coverImage?.url ||
    caseStudy.coverImage ||
    "";

  const galleryImages = Array.isArray(
    caseStudy.images
  )
    ? caseStudy.images
    : [];

  const categories = Array.isArray(
    caseStudy.categories
  )
    ? caseStudy.categories
    : [];

  const technologies = Array.isArray(
    caseStudy.technologies
  )
    ? caseStudy.technologies
    : [];

  const features = Array.isArray(
    caseStudy.features
  )
    ? caseStudy.features
    : [];

  // ----------------------------------
  // Date formatter
  // ----------------------------------

  const formatDate = (date) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  };

  return (
    <div className="pb-10">
      {/* ---------------------------------- */}
      {/* Header */}
      {/* ---------------------------------- */}

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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
            Case Study Details
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            View complete project case study information.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              navigate(
                `/case-studies/${caseStudyId}/edit`
              )
            }
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

            {deleteLoading
              ? "Deleting..."
              : "Delete"}
          </button>
        </div>
      </div>

      {/* ---------------------------------- */}
      {/* Main Layout */}
      {/* ---------------------------------- */}

      <div className="grid grid-cols-1 gap-6">
        {/* ---------------------------------- */}
        {/* Hero */}
        {/* ---------------------------------- */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {/* Cover */}
          {coverImage ? (
            <img
              src={coverImage}
              alt={caseStudy.title}
              className="h-[280px] w-full object-cover sm:h-[400px]"
            />
          ) : (
            <div className="flex h-[280px] w-full items-center justify-center bg-slate-100 text-slate-400 sm:h-[400px]">
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
                {categories.map(
                  (category) => (
                    <span
                      key={category}
                      className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700"
                    >
                      {category}
                    </span>
                  )
                )}
              </div>
            )}

            {/* Title */}
            <h2 className="text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
              {caseStudy.title}
            </h2>

            {/* Short Description */}
            {caseStudy.shortDescription && (
              <p className="mt-4 max-w-4xl text-base leading-7 text-slate-600">
                {caseStudy.shortDescription}
              </p>
            )}

            {/* Meta */}
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-slate-100 pt-5">
              {caseStudy.clientType && (
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <User
                    size={16}
                    className="text-slate-400"
                  />

                  <span>
                    {caseStudy.clientType}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Calendar
                  size={16}
                  className="text-slate-400"
                />

                <span>
                  {formatDate(
                    caseStudy.publishedAt ||
                      caseStudy.createdAt
                  )}
                </span>
              </div>

              <div>
                {caseStudy.status ===
                "published" ? (
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
          </div>
        </div>

        {/* ---------------------------------- */}
        {/* Description */}
        {/* ---------------------------------- */}

        {caseStudy.description && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <h3 className="mb-5 text-lg font-semibold text-slate-900">
              Project Description
            </h3>

            <div className="whitespace-pre-wrap text-[15px] leading-8 text-slate-700">
              {caseStudy.description}
            </div>
          </div>
        )}

        {/* ---------------------------------- */}
        {/* Challenge / Solution / Result */}
        {/* ---------------------------------- */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Challenge */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <Target size={21} />
            </div>

            <h3 className="text-lg font-semibold text-slate-900">
              Challenge
            </h3>

            <div className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600">
              {caseStudy.challenge ||
                "No challenge information added."}
            </div>
          </div>

          {/* Solution */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Lightbulb size={21} />
            </div>

            <h3 className="text-lg font-semibold text-slate-900">
              Solution
            </h3>

            <div className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600">
              {caseStudy.solution ||
                "No solution information added."}
            </div>
          </div>

          {/* Result */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <Trophy size={21} />
            </div>

            <h3 className="text-lg font-semibold text-slate-900">
              Result
            </h3>

            <div className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600">
              {caseStudy.result ||
                "No result information added."}
            </div>
          </div>
        </div>

        {/* ---------------------------------- */}
        {/* Technologies + Features */}
        {/* ---------------------------------- */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Technologies */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <div className="mb-5 flex items-center gap-2">
              <Code2
                size={19}
                className="text-blue-600"
              />

              <h3 className="text-lg font-semibold text-slate-900">
                Technologies
              </h3>
            </div>

            {technologies.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {technologies.map(
                  (technology) => (
                    <span
                      key={technology}
                      className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700"
                    >
                      {technology}
                    </span>
                  )
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                No technologies added.
              </p>
            )}
          </div>

          {/* Features */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <div className="mb-5 flex items-center gap-2">
              <CheckCircle2
                size={19}
                className="text-green-600"
              />

              <h3 className="text-lg font-semibold text-slate-900">
                Project Features
              </h3>
            </div>

            {features.length > 0 ? (
              <div className="space-y-3">
                {features.map(
                  (feature, index) => (
                    <div
                      key={feature}
                      className="flex items-start gap-3"
                    >
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-green-50 text-xs font-semibold text-green-700">
                        {index + 1}
                      </span>

                      <span className="text-sm leading-6 text-slate-600">
                        {feature}
                      </span>
                    </div>
                  )
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                No features added.
              </p>
            )}
          </div>
        </div>

        {/* ---------------------------------- */}
        {/* Gallery */}
        {/* ---------------------------------- */}

        {galleryImages.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900">
                Project Gallery
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {galleryImages.length} project image
                {galleryImages.length !== 1
                  ? "s"
                  : ""}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {galleryImages.map(
                (image, index) => {
                  const imageUrl =
                    image?.url || image;

                  return (
                    <div
                      key={`${imageUrl}-${index}`}
                      className="group overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                    >
                      <div className="overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={`${caseStudy.title} ${
                            index + 1
                          }`}
                          className="h-52 w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                      </div>

                      <div className="px-4 py-3">
                        <p className="text-xs font-medium text-slate-500">
                          Project Image {index + 1}
                        </p>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        )}

        {/* ---------------------------------- */}
        {/* Additional Information */}
        {/* ---------------------------------- */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Categories */}
          {categories.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-center gap-2">
                <Tag
                  size={18}
                  className="text-blue-600"
                />

                <h3 className="text-sm font-semibold text-slate-900">
                  Categories
                </h3>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {categories.map(
                  (category) => (
                    <span
                      key={category}
                      className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700"
                    >
                      {category}
                    </span>
                  )
                )}
              </div>
            </div>
          )}

          {/* Information */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-sm font-semibold text-slate-900">
              Case Study Information
            </h3>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Slug
                </p>

                <p className="mt-1 break-all text-sm text-slate-700">
                  {caseStudy.slug ||
                    "Not available"}
                </p>
              </div>

              {caseStudy.clientType && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Client Type
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {caseStudy.clientType}
                  </p>
                </div>
              )}

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Created
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {formatDate(
                    caseStudy.createdAt
                  )}
                </p>
              </div>

              {caseStudy.updatedAt && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Last Updated
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {formatDate(
                      caseStudy.updatedAt
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseStudyDetails;