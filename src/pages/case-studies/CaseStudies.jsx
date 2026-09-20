import React, { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  BookOpen,
  Eye,
  Pencil,
} from "lucide-react";
import { Link } from "react-router-dom";

import {
  getCaseStudies,
  deleteCaseStudy,
} from "../../services/caseStudyService";

import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import StatusBadge from "../../components/common/StatusBadge";

const CaseStudies = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await getCaseStudies();

        setItems(
          response.data?.data ||
            response.data?.caseStudies ||
            []
        );
      } catch (error) {
        console.error(
          "Load case studies error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this case study?"
      )
    ) {
      return;
    }

    try {
      setDeletingId(id);

      await deleteCaseStudy(id);

      setItems((prev) =>
        prev.filter((item) => item._id !== id)
      );
    } catch (error) {
      console.error(error);
      alert("Unable to delete case study.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <Loader text="Loading case studies..." />
    );
  }

  return (
    <div>
      {/* HEADER */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Case Studies
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Showcase completed projects and results.
          </p>
        </div>

        <Link
          to="/case-studies/create"
          className="flex w-fit items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          New Case Study
        </Link>
      </div>

      {/* CONTENT */}

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {items.length === 0 ? (
          <EmptyState
            title="No case studies"
            description="Create your first case study."
          />
        ) : (
          <div className="divide-y divide-slate-100">
            {items.map((item) => (
              <div
                key={item._id}
                className="flex flex-col gap-4 px-5 py-5 transition hover:bg-slate-50 md:flex-row md:items-center md:justify-between"
              >
                {/* LEFT */}

                <Link
                  to={`/case-studies/${item._id}`}
                  className="flex min-w-0 items-center gap-4"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50">
                    {item.coverImage?.url ? (
                      <img
                        src={item.coverImage.url}
                        alt={item.title}
                        className="h-11 w-11 rounded-xl object-cover"
                      />
                    ) : (
                      <BookOpen className="h-5 w-5 text-purple-600" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-slate-800">
                      {item.title}
                    </h3>

                    <p className="mt-1 line-clamp-1 text-xs text-slate-400">
                      {item.categories?.join(", ") ||
                        "No category"}
                    </p>

                    {item.shortDescription && (
                      <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                        {item.shortDescription}
                      </p>
                    )}
                  </div>
                </Link>

                {/* ACTIONS */}

                <div className="flex items-center gap-2 md:shrink-0">
                  <StatusBadge status={item.status} />

                  <Link
                    to={`/case-studies/${item._id}`}
                    title="View"
                    className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>

                  <Link
                    to={`/case-studies/${item._id}/edit`}
                    title="Edit"
                    className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>

                  <button
                    type="button"
                    disabled={deletingId === item._id}
                    onClick={() =>
                      handleDelete(item._id)
                    }
                    title="Delete"
                    className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CaseStudies;