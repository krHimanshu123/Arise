"use client";

import React, { lazy, Suspense } from "react";

// Lazy load MDEditor for better performance
const MDEditor = lazy(() => import("@uiw/react-md-editor"));

const CoverLetterPreview = ({ content }) => {
  return (
    <div className="py-4">
      <Suspense fallback={
        <div className="flex items-center justify-center h-96 border rounded-lg">
          <div className="loading-skeleton w-full h-full rounded-lg"></div>
        </div>
      }>
        <MDEditor value={content} preview="preview" height={700} />
      </Suspense>
    </div>
  );
};

export default CoverLetterPreview;
