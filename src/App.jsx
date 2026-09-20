import React from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import AdminLayout from "./components/layout/AdminLayout";

import Dashboard from "./pages/Dashboard";
import EditCaseStudy from "./pages/case-studies/EditCaseStudy";
import Contacts from "./pages/contacts/Contacts";
import ContactDetails from "./pages/contacts/ContactDetails";

import Blogs from "./pages/blogs/Blogs";
import CreateBlog from "./pages/blogs/CreateBlog";
import BlogDetails from "./pages/blogs/BlogDetails";

import CaseStudies from "./pages/case-studies/CaseStudies";
import CreateCaseStudy from "./pages/case-studies/CreateCaseStudy";
import CaseStudyDetails from "./pages/case-studies/CaseStudyDetails";

import Projects from "./pages/projects/Projects";
import ProjectCategories from "./pages/projects/ProjectCategories";

import Consultations from "./pages/consultations/Consultations";

import Students from "./pages/students/Students";

const App = () => {
  return (
    <BrowserRouter>

      <Routes>

        <Route element={<AdminLayout />}>

          {/* Dashboard */}

          <Route
            path="/"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />


          {/* Contacts */}

          <Route
            path="/contacts"
            element={<Contacts />}
          />

          <Route
            path="/contacts/:id"
            element={<ContactDetails />}
          />


          {/* Projects */}

          <Route
            path="/projects"
            element={<Projects />}
          />

          <Route
            path="/project-categories"
            element={<ProjectCategories />}
          />


          {/* Blogs */}

          <Route
            path="/blogs"
            element={<Blogs />}
          />

          <Route
            path="/blogs/create"
            element={<CreateBlog />}
          />

          <Route
            path="/blogs/:id"
            element={<BlogDetails />}
          />

          <Route
            path="/blogs/:id/edit"
            element={<CreateBlog />}
          />


          {/* Case Studies */}

          <Route
            path="/case-studies"
            element={<CaseStudies />}
          />

          <Route
            path="/case-studies/create"
            element={<CreateCaseStudy />}
          />

          <Route
            path="/case-studies/:id/edit"
            element={<EditCaseStudy />}
          />

          <Route
            path="/case-studies/:id"
            element={<CaseStudyDetails />}
          />


          {/* Other */}

          <Route
            path="/consultations"
            element={<Consultations />}
          />

          <Route
            path="/students"
            element={<Students />}
          />

          <Route
            path="/settings"
            element={
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Settings
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Manage dashboard settings.
                </p>
              </div>
            }
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
};

export default App;