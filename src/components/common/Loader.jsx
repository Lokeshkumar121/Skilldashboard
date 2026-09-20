import React from "react";

const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="flex min-h-[300px] items-center justify-center">
      <div className="flex flex-col items-center gap-3">

        <div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

        <p className="text-sm text-slate-500">
          {text}
        </p>

      </div>
    </div>
  );
};

export default Loader;