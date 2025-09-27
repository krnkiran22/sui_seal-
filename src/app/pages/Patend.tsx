"use client";

import { useEffect } from "react";

export default function PatentPage() {
  useEffect(() => {
    const newTab = window.open(
      "https://app.gitbook.com/o/MLFrHEFxnjVjcQ7HosVq/s/4PEsfHxrn4QCCPzGeh2p/",
      "_blank"
    );

    // If popup blocked, fallback to same tab
    if (!newTab) {
      window.location.href =
        "https://app.gitbook.com/o/MLFrHEFxnjVjcQ7HosVq/s/4PEsfHxrn4QCCPzGeh2p/";
    }
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-teal-600 mb-4">Patent Resources</h1>
        <p className="text-gray-700 text-lg">
          Redirecting you to our GitBook Patent Integration guide...
        </p>
        <p className="mt-4 text-sm text-gray-500">
          If you are not redirected automatically,{" "}
          <a
            href="https://app.gitbook.com/o/MLFrHEFxnjVjcQ7HosVq/s/4PEsfHxrn4QCCPzGeh2p/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-600 underline"
          >
            click here
          </a>
          .
        </p>
      </div>
    </main>
  );
}
