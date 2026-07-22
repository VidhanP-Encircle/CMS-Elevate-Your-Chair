"use client";

import { useEffect } from "react";

export default function ForceSolidNav() {
  useEffect(() => {
    // Dispatch an event to tell the Navigation component to stay solid
    const event = new CustomEvent("force-solid-nav");
    document.dispatchEvent(event);

    return () => {
      // Clean up when this component unmounts
      const cleanupEvent = new CustomEvent("unforce-solid-nav");
      document.dispatchEvent(cleanupEvent);
    };
  }, []);

  return null;
}
