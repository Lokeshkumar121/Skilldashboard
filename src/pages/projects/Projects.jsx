import React from "react";

const Projects = () => {
  return (
    <Page
      title="Projects"
      description="Manage SkillPilot project offerings."
    />
  );
};

const Page = ({ title, description }) => (
  <div>

    <h1 className="text-2xl font-bold text-slate-900">
      {title}
    </h1>

    <p className="mt-1 text-sm text-slate-500">
      {description}
    </p>

    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-10 text-center">
      <p className="text-sm text-slate-400">
        Project management module coming next.
      </p>
    </div>

  </div>
);

export default Projects;