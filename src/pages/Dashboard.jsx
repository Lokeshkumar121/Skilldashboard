import React, { useEffect, useState } from "react";

import {
  Users,
  MessageSquare,
  FileText,
  BookOpen,
} from "lucide-react";

import {
  getContacts,
} from "../services/contactService";

import {
  getBlogs,
} from "../services/blogService";

import {
  getCaseStudies,
} from "../services/caseStudyService";

import StatCard from "../components/dashboard/StatCard";
import RecentEnquiries from "../components/dashboard/RecentEnquiries";
import RecentBlogs from "../components/dashboard/RecentBlogs";
import RecentCaseStudies from "../components/dashboard/RecentCaseStudies";
import QuickActions from "../components/dashboard/QuickActions";
import Loader from "../components/common/Loader";

const Dashboard = () => {

  const [contacts, setContacts] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [caseStudies, setCaseStudies] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [greeting, setGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState("");



useEffect(() => {
  const updateDateTime = () => {
    const now = new Date();
    const hour = now.getHours();

    // Live Greeting
    if (hour >= 5 && hour < 12) {
      setGreeting("Good morning");
    } else if (hour >= 12 && hour < 17) {
      setGreeting("Good afternoon");
    } else if (hour >= 17 && hour < 21) {
      setGreeting("Good evening");
    } else {
      setGreeting("Good night");
    }

    // Live Time
    setCurrentTime(
      now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })
    );
  };

  updateDateTime();

  // Every second
  const interval = setInterval(updateDateTime, 1000);

  return () => clearInterval(interval);
}, []);


useEffect(() => {

    const loadDashboard = async () => {

      try {

        setLoading(true);
        setError("");

        const [
          contactsResponse,
          blogsResponse,
          caseStudiesResponse,
        ] = await Promise.all([
          getContacts(),
          getBlogs(),
          getCaseStudies(),
        ]);

        setContacts(
          contactsResponse.data?.data ||
          contactsResponse.data?.contacts ||
          []
        );

        setBlogs(
          blogsResponse.data?.data ||
          blogsResponse.data?.blogs ||
          []
        );

        setCaseStudies(
          caseStudiesResponse.data?.data ||
          blogsResponse.data?.caseStudies ||
          caseStudiesResponse.data?.caseStudies ||
          []
        );

      } catch (error) {

        console.error("Dashboard error:", error);

        setError(
          "Unable to load dashboard data."
        );

      } finally {

        setLoading(false);

      }

    };

    loadDashboard();

  }, []);


  if (loading) {
    return <Loader text="Loading dashboard..." />;
  }


  return (
    <div>

      {/* Header */}

      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">

        <div>

          <p className="mb-1 text-sm font-medium text-blue-600">
            Admin Overview
          </p>
<h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
  {greeting}, Admin 👋
</h1>

<div className="mt-2 flex items-center gap-3">
  <span className="text-sm font-semibold text-blue-600">
    {currentTime}
  </span>

  <span className="h-1 w-1 rounded-full bg-slate-300" />

  <span className="text-sm text-slate-500">
    Live time
  </span>
</div>

          <p className="mt-1 text-sm text-slate-500">
            Here's what's happening with SkillPilot today.
          </p>

        </div>

        <a
          href="/blogs/create"
          className="w-fit rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          + Create Content
        </a>

      </div>


      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}


      {/* Stats */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Enquiries"
          value={contacts.length}
          change="Live"
          description="from database"
          icon={MessageSquare}
        />

        <StatCard
          title="Students"
          value={contacts.length}
          change="Active"
          description="enquiry records"
          icon={Users}
        />

        <StatCard
          title="Published Blogs"
          value={
            blogs.filter(
              (blog) =>
                blog.status === "published"
            ).length
          }
          change="Live"
          description="published content"
          icon={FileText}
        />

        <StatCard
          title="Case Studies"
          value={caseStudies.length}
          change="Live"
          description="total case studies"
          icon={BookOpen}
        />

      </div>


      {/* Main */}

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.7fr_1fr]">

        <RecentEnquiries
          enquiries={contacts.slice(0, 5)}
        />

        <QuickActions />

      </div>


      {/* Lower */}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">

        <RecentBlogs
          blogs={blogs.slice(0, 5)}
        />

        <RecentCaseStudies
          caseStudies={caseStudies.slice(0, 5)}
        />

      </div>

    </div>
  );
};

export default Dashboard;