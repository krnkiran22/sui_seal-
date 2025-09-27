"use client";

import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    // Redirect in a new tab
    const newTab = window.open(
      "https://docs.google.com/document/d/1A_EiGgFBijOAvVu-vvuNj3Jq7inYkwwkleNNHi4gs6k/edit?tab=t.0",
      "_blank"
    );

    // If popup blocked, fallback to same tab
    if (!newTab) {
      window.location.href =
        "https://docs.google.com/document/d/1A_EiGgFBijOAvVu-vvuNj3Jq7inYkwwkleNNHi4gs6k/edit?tab=t.0";
    }
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="text-2xl font-bold">Opening Project Doc...</h1>
    </main>
  );
}