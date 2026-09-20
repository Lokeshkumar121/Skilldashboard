import React, {
  useEffect,
  useState,
} from "react";

import {
  Search,
  Mail,
  Phone,
  Eye,
  Trash2,
  MessageSquare,
  User,
} from "lucide-react";

import { Link } from "react-router-dom";

import {
  getContacts,
  deleteContact,
  updateContactStatus,
} from "../../services/contactService";

import StatusBadge from "../../components/common/StatusBadge";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

const Contacts = () => {
  const [contacts, setContacts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const loadContacts = async () => {
    try {
      const response =
        await getContacts();

      setContacts(
        response.data?.data ||
          response.data?.contacts ||
          []
      );
    } catch (error) {
      console.error(
        "Contacts error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  // ===============================
  // DELETE CONTACT
  // ===============================

  const handleDelete = async (id) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this enquiry?"
      );

    if (!confirmed) return;

    try {
      await deleteContact(id);

      setContacts((prev) =>
        prev.filter(
          (contact) =>
            contact._id !== id
        )
      );
    } catch (error) {
      console.error(
        "Delete contact error:",
        error
      );

      alert(
        "Unable to delete enquiry."
      );
    }
  };

  // ===============================
  // STATUS CHANGE
  // ===============================

  const handleStatusChange = async (
    id,
    status
  ) => {
    try {
      const response =
        await updateContactStatus(
          id,
          status
        );

      const updatedContact =
        response.data?.data;

      setContacts((prev) =>
        prev.map((contact) =>
          contact._id === id
            ? updatedContact ||
              {
                ...contact,
                status,
              }
            : contact
        )
      );
    } catch (error) {
      console.error(
        "Status update error:",
        error
      );

      alert(
        "Unable to update status."
      );
    }
  };

  // ===============================
  // SEARCH
  // ===============================

  const filteredContacts =
    contacts.filter((contact) => {
      const searchText =
        search
          .toLowerCase()
          .trim();

      if (!searchText) return true;

      return (
        contact.firstName
          ?.toLowerCase()
          .includes(searchText) ||
        contact.lastName
          ?.toLowerCase()
          .includes(searchText) ||
        contact.email
          ?.toLowerCase()
          .includes(searchText) ||
        contact.phone
          ?.toLowerCase()
          .includes(searchText) ||
        contact.subject
          ?.toLowerCase()
          .includes(searchText) ||
        contact.message
          ?.toLowerCase()
          .includes(searchText)
      );
    });

  // ===============================
  // LOADING
  // ===============================

  if (loading) {
    return (
      <Loader text="Loading enquiries..." />
    );
  }

  return (
    <div>

      {/* ===============================
          HEADER
      =============================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Contact Enquiries
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage student enquiries and contact
            messages.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 shadow-sm">
          <MessageSquare className="h-4 w-4 text-blue-600" />

          <span>
            {contacts.length} Enquiries
          </span>
        </div>

      </div>


      {/* ===============================
          SEARCH
      =============================== */}

      <div className="mt-6">

        <div className="relative max-w-md">

          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Search enquiries..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

        </div>

      </div>


      {/* ===============================
          TABLE
      =============================== */}

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {filteredContacts.length ===
        0 ? (
          <EmptyState
            title="No enquiries found"
            description={
              search
                ? "Try another search."
                : "No contact enquiries have been received yet."
            }
          />
        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1000px]">

              <thead>

                <tr className="border-b border-slate-100 bg-slate-50">

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Student
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Contact
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Subject
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Status
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Date
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredContacts.map(
                  (contact) => {

                    const fullName =
                      [
                        contact.firstName,
                        contact.lastName,
                      ]
                        .filter(Boolean)
                        .join(" ") ||
                      "Unknown";

                    return (

                      <tr
                        key={
                          contact._id
                        }
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70"
                      >

                        {/* STUDENT */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">

                              <User className="h-4 w-4 text-blue-600" />

                            </div>

                            <div>

                              <Link
                                to={`/contacts/${contact._id}`}
                                className="text-sm font-semibold text-slate-800 hover:text-blue-600"
                              >
                                {fullName}
                              </Link>

                            </div>

                          </div>

                        </td>


                        {/* CONTACT */}

                        <td className="px-5 py-4">

                          <div className="space-y-1">

                            {contact.email && (
                              <div className="flex items-center gap-2 text-xs text-slate-500">

                                <Mail className="h-3.5 w-3.5 text-slate-400" />

                                <span>
                                  {contact.email}
                                </span>

                              </div>
                            )}

                            {contact.phone && (
                              <div className="flex items-center gap-2 text-xs text-slate-500">

                                <Phone className="h-3.5 w-3.5 text-slate-400" />

                                <span>
                                  {contact.phone}
                                </span>

                              </div>
                            )}

                          </div>

                        </td>


                        {/* SUBJECT */}

                        <td className="px-5 py-4">

                          <p className="max-w-[220px] truncate text-sm font-medium text-slate-700">
                            {contact.subject ||
                              "General Enquiry"}
                          </p>

                          {contact.message && (
                            <p className="mt-1 max-w-[250px] truncate text-xs text-slate-400">
                              {
                                contact.message
                              }
                            </p>
                          )}

                        </td>


                        {/* STATUS */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-2">

                            <StatusBadge
                              status={
                                contact.status
                              }
                            />

                            <select
                              value={
                                contact.status ||
                                "new"
                              }
                              onChange={(
                                e
                              ) =>
                                handleStatusChange(
                                  contact._id,
                                  e.target.value
                                )
                              }
                              className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 outline-none focus:border-blue-500"
                            >

                              <option value="new">
                                New
                              </option>

                              <option value="contacted">
                                Contacted
                              </option>

                              <option value="in-progress">
                                In Progress
                              </option>

                              <option value="resolved">
                                Resolved
                              </option>

                              <option value="closed">
                                Closed
                              </option>

                            </select>

                          </div>

                        </td>


                        {/* DATE */}

                        <td className="px-5 py-4">

                          <span className="text-xs text-slate-500">

                            {contact.createdAt
                              ? new Date(
                                  contact.createdAt
                                ).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )
                              : "—"}

                          </span>

                        </td>


                        {/* ACTION */}

                        <td className="px-5 py-4">

                          <div className="flex items-center justify-end gap-1">

                            <Link
                              to={`/contacts/${contact._id}`}
                              title="View enquiry"
                              className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>

                            <button
                              type="button"
                              title="Delete enquiry"
                              onClick={() =>
                                handleDelete(
                                  contact._id
                                )
                              }
                              className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>

                          </div>

                        </td>

                      </tr>

                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
};

export default Contacts;