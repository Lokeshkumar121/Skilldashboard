import React, {
  useEffect,
  useState,
} from "react";

import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  User,
  Send,
  Trash2,
  Clock,
  MessageSquare,
} from "lucide-react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getContactById,
  updateContactStatus,
  replyToContact,
  deleteContact,
} from "../../services/contactService";

import Loader from "../../components/common/Loader";

const ContactDetails = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [contact, setContact] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [replyMessage, setReplyMessage] =
    useState("");

  const [replyLoading, setReplyLoading] =
    useState(false);

  const [statusLoading, setStatusLoading] =
    useState(false);

  const [deleteLoading, setDeleteLoading] =
    useState(false);

  // ===============================
  // GET CONTACT
  // ===============================

  const loadContact = async () => {
    try {
      const response =
        await getContactById(id);

      setContact(
        response.data?.data || null
      );
    } catch (error) {
      console.error(
        "Contact details error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContact();
  }, [id]);

  // ===============================
  // UPDATE STATUS

  const handleStatusChange = async (
    status
  ) => {
    try {
      setStatusLoading(true);

      const response =
        await updateContactStatus(
          id,
          status
        );

      setContact(
        response.data?.data || {
          ...contact,
          status,
        }
      );
    } catch (error) {
      console.error(
        "Status update error:",
        error
      );

      alert(
        "Unable to update status."
      );
    } finally {
      setStatusLoading(false);
    }
  };

  // ===============================
  // SEND REPLY
  // ===============================

  const handleReply = async (e) => {
    e.preventDefault();

    if (!replyMessage.trim()) {
      alert(
        "Please enter a reply message."
      );
      return;
    }

    try {
      setReplyLoading(true);

      const response =
        await replyToContact(
          id,
          replyMessage.trim()
        );

      setContact(
        response.data?.data || contact
      );

      setReplyMessage("");

      alert(
        "Reply sent successfully."
      );
    } catch (error) {
      console.error(
        "Reply error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to send reply."
      );
    } finally {
      setReplyLoading(false);
    }
  };

  // ===============================
  // DELETE
  // ===============================

  const handleDelete = async () => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this enquiry?"
      );

    if (!confirmed) return;

    try {
      setDeleteLoading(true);

      await deleteContact(id);

      navigate("/contacts");
    } catch (error) {
      console.error(
        "Delete contact error:",
        error
      );

      alert(
        "Unable to delete enquiry."
      );

      setDeleteLoading(false);
    }
  };

  // ===============================
  // LOADING
  // ===============================

  if (loading) {
    return (
      <Loader text="Loading enquiry..." />
    );
  }

  // ===============================
  // NOT FOUND
  // ===============================

  if (!contact) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
        <h2 className="text-lg font-semibold text-slate-800">
          Enquiry not found
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          This enquiry may have been
          deleted or does not exist.
        </p>

        <Link
          to="/contacts"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Enquiries
        </Link>
      </div>
    );
  }

  const fullName =
    `${contact.firstName || ""} ${
      contact.lastName || ""
    }`.trim();

  return (
    <div className="space-y-6">

      {/* ===============================
          HEADER
      =============================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-3">

          <Link
            to="/contacts"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-blue-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div>

            <p className="text-sm text-slate-400">
              Contact Enquiry
            </p>

            <h1 className="text-2xl font-bold text-slate-900">
              {fullName}
            </h1>

          </div>

        </div>


        <button
          type="button"
          onClick={handleDelete}
          disabled={deleteLoading}
          className="flex w-fit items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Trash2 className="h-4 w-4" />

          {deleteLoading
            ? "Deleting..."
            : "Delete Enquiry"}
        </button>

      </div>


      {/* ===============================
          MAIN GRID
      =============================== */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* ===============================
            LEFT / STUDENT DETAILS
        =============================== */}

        <div className="space-y-6 xl:col-span-2">

          {/* STUDENT INFORMATION */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center gap-3 border-b border-slate-100 pb-5">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                <User className="h-5 w-5 text-blue-600" />
              </div>

              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Student Information
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Personal and contact details
                </p>
              </div>

            </div>


            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* NAME */}

              <InfoItem
                icon={User}
                label="Full Name"
                value={fullName || "—"}
              />


              {/* EMAIL */}

              <InfoItem
                icon={Mail}
                label="Email Address"
                value={contact.email || "—"}
              />


              {/* PHONE */}

              <InfoItem
                icon={Phone}
                label="Phone Number"
                value={
                  contact.phoneNumber ||
                  "—"
                }
              />


              {/* PROJECT TYPE */}

              <InfoItem
                icon={Briefcase}
                label="Project Type"
                value={
                  contact.projectType ||
                  "Not specified"
                }
              />

            </div>

          </div>


          {/* LOCATION */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center gap-3 border-b border-slate-100 pb-5">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                <MapPin className="h-5 w-5 text-slate-600" />
              </div>

              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Location
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Student location details
                </p>
              </div>

            </div>


            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">

              <InfoItem
                icon={MapPin}
                label="State"
                value={
                  contact.state || "—"
                }
              />

              <InfoItem
                icon={MapPin}
                label="District"
                value={
                  contact.district ||
                  "—"
                }
              />

              <InfoItem
                icon={MapPin}
                label="City"
                value={
                  contact.city || "—"
                }
              />

            </div>

          </div>


          {/* ORIGINAL MESSAGE */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center gap-3 border-b border-slate-100 pb-5">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </div>

              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Student Message
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Original enquiry submitted by
                  the student
                </p>
              </div>

            </div>


            <div className="mt-6 rounded-xl bg-slate-50 p-5">

              <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
                {contact.message ||
                  "No message provided."}
              </p>

            </div>

          </div>


          {/* REPLY HISTORY */}

          {contact.replies?.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center gap-3 border-b border-slate-100 pb-5">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">
                  <Clock className="h-5 w-5 text-green-600" />
                </div>

                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Reply History
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    Previous replies sent to this
                    student
                  </p>
                </div>

              </div>


              <div className="mt-6 space-y-4">

                {contact.replies
                  .slice()
                  .reverse()
                  .map(
                    (
                      reply,
                      index
                    ) => (

                      <div
                        key={
                          reply._id ||
                          index
                        }
                        className="rounded-xl border border-slate-100 bg-slate-50 p-5"
                      >

                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                          <span className="text-xs font-semibold text-slate-500">
                            Reply
                            #{contact.replies.length - index}
                          </span>

                          <span className="text-xs text-slate-400">
                            {reply.sentAt
                              ? new Date(
                                  reply.sentAt
                                ).toLocaleString(
                                  "en-IN",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )
                              : "—"}
                          </span>

                        </div>


                        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                          {reply.message}
                        </p>

                      </div>

                    )
                  )}

              </div>

            </div>
          )}

        </div>


        {/* ===============================
            RIGHT SIDEBAR
        =============================== */}

        <div className="space-y-6">

          {/* STATUS */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Enquiry Status
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Update enquiry progress
                </p>
              </div>

            </div>


            <div className="mt-5">

              <select
                value={
                  contact.status ||
                  "new"
                }
                onChange={(e) =>
                  handleStatusChange(
                    e.target.value
                  )
                }
                disabled={statusLoading}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
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

                <option value="closed">
                  Closed
                </option>

              </select>

              {statusLoading && (
                <p className="mt-2 text-xs text-slate-400">
                  Updating status...
                </p>
              )}

            </div>

          </div>


          {/* DATE */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="text-base font-semibold text-slate-900">
              Enquiry Information
            </h2>


            <div className="mt-5 space-y-4">

              <InfoItem
                icon={Calendar}
                label="Submitted"
                value={
                  contact.createdAt
                    ? new Date(
                        contact.createdAt
                      ).toLocaleString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )
                    : "—"
                }
              />


              <InfoItem
                icon={Clock}
                label="Last Updated"
                value={
                  contact.updatedAt
                    ? new Date(
                        contact.updatedAt
                      ).toLocaleString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )
                    : "—"
                }
              />

            </div>

          </div>


          {/* REPLY */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                <Mail className="h-4 w-4 text-blue-600" />
              </div>

              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Reply to Student
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Send an email response
                </p>
              </div>

            </div>


            <form
              onSubmit={handleReply}
              className="mt-5"
            >

              <textarea
                value={replyMessage}
                onChange={(e) =>
                  setReplyMessage(
                    e.target.value
                  )
                }
                rows={7}
                placeholder="Write your reply..."
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />


              <button
                type="submit"
                disabled={
                  replyLoading ||
                  !replyMessage.trim()
                }
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >

                <Send className="h-4 w-4" />

                {replyLoading
                  ? "Sending..."
                  : "Send Reply"}

              </button>

            </form>

          </div>


          {/* QUICK CONTACT */}

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Quick Contact
            </p>


            <div className="mt-4 space-y-3">

              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-3 rounded-xl bg-white p-3 text-sm text-slate-600 transition hover:text-blue-600"
                >
                  <Mail className="h-4 w-4 text-blue-600" />

                  <span className="truncate">
                    Email Student
                  </span>
                </a>
              )}


              {contact.phoneNumber && (
                <a
                  href={`tel:${contact.phoneNumber}`}
                  className="flex items-center gap-3 rounded-xl bg-white p-3 text-sm text-slate-600 transition hover:text-blue-600"
                >
                  <Phone className="h-4 w-4 text-blue-600" />

                  <span>
                    Call Student
                  </span>
                </a>
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};


// ===============================
// INFO ITEM
// ===============================

const InfoItem = ({
  icon: Icon,
  label,
  value,
}) => {
  return (
    <div className="flex gap-3">

      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50">
        <Icon className="h-4 w-4 text-slate-500" />
      </div>

      <div className="min-w-0">

        <p className="text-xs font-medium text-slate-400">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-medium text-slate-700">
          {value}
        </p>

      </div>

    </div>
  );
};

export default ContactDetails;